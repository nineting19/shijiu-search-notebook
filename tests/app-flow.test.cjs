// DOM event smoke test in Node, without launching or controlling any browser.
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
function setup(initialStorage){
 class Element{constructor(tag='div'){this.tag=tag;this.children=[];this.options=[];this.value='';this.checked=false;this.textContent='';this.listeners={};this.classes=new Set();this.classList={add:s=>this.classes.add(s),remove:s=>this.classes.delete(s),toggle:(s,on)=>on?this.classes.add(s):this.classes.delete(s)};}append(...es){this.children.push(...es);}replaceChildren(...es){this.children=es;if(this.tag==='select'){this.options=es;this.value=es[0]?.value||'';}}add(o){this.options.push(o);if(this.options.length===1)this.value=o.value;}addEventListener(k,f){this.listeners[k]=f;}focus(){}select(){}remove(){}click(){if(this.onclick)this.onclick();}}
 const html=fs.readFileSync(path.resolve(__dirname,'../dist/app.html'),'utf8'),nodes={};for(const m of html.matchAll(/<(\w+)\b[^>]*\bid="([^"]+)"/g))nodes[m[2]]=new Element(m[1]);
 for(const[id,value]of Object.entries({brand:'拾玖搜证台',platform:'豆包',entry:'网页',mode:'默认',network:'已开启',login:'已登录',region:'郑州',status:'complete'}))nodes[id].value=value;
 const storage=new Map(initialStorage?[['shijiu-search-notebook-v1',initialStorage]]:[]),alerts=[];const context={window:{},document:{getElementById:id=>nodes[id],createElement:tag=>new Element(tag),body:new Element('body')},Option:function(t,v){this.textContent=t;this.value=v;},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},confirm:()=>true,navigator:{clipboard:{writeText:async()=>{}}},URL,Blob,TextEncoder,Date,console,setTimeout:()=>1,clearTimeout:()=>{}};
 context.window=context;vm.createContext(context);for(const file of ['core.js','questions.js','app.js'])vm.runInContext(fs.readFileSync(path.resolve(__dirname,'../dist',file),'utf8'),context);
 return {nodes,storage,context};
}
test('真实表单保存、清空输入、模拟切换与回到真实历史',()=>{
 const {nodes:n,storage}=setup();assert.equal(storage.size,0);assert.equal(n.count.textContent,'0 条记录');
 n.fresh.checked=true;n.answer.value='<img src=x onerror=alert(1)> 完整真实记录';n.sources.value='https://example.com/facts';n['fact-notes'].value='事实一\n事实二';for(const id of ['mentioned','identity','facts','source-verified'])n[id].checked=true;
 n['record-form'].listeners.submit({preventDefault(){}});assert.equal(n.count.textContent,'1 条记录');const saved=[...storage.values()][0];const data=JSON.parse(saved);assert.equal(data.records[0].answer,'<img src=x onerror=alert(1)> 完整真实记录');assert.equal(n.answer.value,'');assert.equal(n.mentioned.checked,false);
 n['toggle-practice'].onclick();assert.match(n['mode-label'].textContent,/模拟/);assert.equal([...storage.values()][0],saved);
 n.answer.value='【模拟】测试';n['record-form'].listeners.submit({preventDefault(){}});assert.equal(n.count.textContent,'2 条记录');assert.equal([...storage.values()][0],saved);
 n['toggle-practice'].onclick();assert.equal(n.count.textContent,'1 条记录');assert.match(n['mode-label'].textContent,/真实/);
});

test('旧版超限历史可读取，拒绝新增时保留原存储与输入，分批入口可用',()=>{
 const C=require('../dist/core.js'),r={id:'old-1',questionId:'N01',kind:'name',question:'测试',brand:'拾玖搜证台',batch:'合成练习',platform:'合成平台',entry:'网页',network:'未知',login:'未知',region:'测试',mode:'默认',created:'2026-11-15T00:00:00Z',status:'complete',answer:'汉'.repeat(80000),sources:'',factNotes:'',notes:'',fresh:true,mentioned:false,identity:false,facts:false,sourceVerified:false,recommended:false,simulated:false};
 const records=Array.from({length:15},(_,i)=>({...r,id:'old-'+i})),raw=C.exportJSON(records);
 const {nodes:n,storage}=setup(raw);assert.equal(n.count.textContent,'15 条记录');assert.match(n['storage-warning'].textContent,/旧版超限/);assert.notEqual(n.save.disabled,true);
 n.answer.value='新输入请保留';n['record-form'].listeners.submit({preventDefault(){}});assert.equal(storage.get('shijiu-search-notebook-v1'),raw);assert.equal(n.answer.value,'新输入请保留');assert.match(n.toast.textContent,/3,000,000/);
 n['export-parts'].onclick();assert.equal(n['split-backup-box'].children.length,3);assert.match(n['split-backup-box'].children[0].textContent,/2 份/);assert.equal(storage.get('shijiu-search-notebook-v1'),raw);
});

test('导入预览后选择无效文件，不保留旧的待合并数据',async()=>{
 const {nodes:n,storage,context}=setup();n['toggle-practice'].onclick();const r=JSON.parse(JSON.stringify(context.SearchNotebook.validate({id:'import-1',questionId:'N01',kind:'name',question:'合成测试',brand:'拾玖搜证台',batch:'练习',platform:'模拟',entry:'练习',network:'未知',login:'未知',region:'未知',mode:'练习',created:'2026-11-15T00:00:00Z',status:'complete',answer:'模拟',sources:'',factNotes:'',notes:'',fresh:true,mentioned:false,identity:false,facts:false,sourceVerified:false,recommended:false,simulated:true})));
 const raw=context.SearchNotebook.exportJSON([r]);await n['import-json'].onchange({target:{files:[{size:Buffer.byteLength(raw),text:async()=>raw}],value:''}});
 await n['import-json'].onchange({target:{files:[{size:2,text:async()=>'{!'}],value:''}});n['confirm-import'].onclick();assert.equal(n.count.textContent,'1 条记录');assert.equal(storage.size,0);assert.match(n.toast.textContent,/JSON 格式错误/);
});
test('无原文和非法来源不会保存，来源复核缺失不算成功',()=>{
 const {nodes:n,storage}=setup();n['record-form'].listeners.submit({preventDefault(){}});assert.equal(storage.size,0);assert.match(n.toast.textContent,/原文/);
 n.answer.value='回答';n.sources.value='javascript:alert(1)';n['record-form'].listeners.submit({preventDefault(){}});assert.equal(storage.size,0);assert.match(n.toast.textContent,/来源/);
 n.sources.value='';n.fresh.checked=true;n['record-form'].listeners.submit({preventDefault(){}});assert.equal(n.count.textContent,'1 条记录');const summary=n['record-list'].children[0].children[0];assert.match(summary.textContent,/未达标/);
});
