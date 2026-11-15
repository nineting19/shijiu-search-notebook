// Rebuild only the single-file recorder; leave published research and result pages intact.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const dist=path.resolve(__dirname,'../dist'),base='https://nineting19.github.io/zhengzhou-geo-demo-20261102/search-notebook';
let html=fs.readFileSync(path.join(dist,'app.html'),'utf8');
html=html.replace('<link rel="stylesheet" href="style.css">',`<style>${fs.readFileSync(path.join(dist,'style.css'),'utf8')}</style>`).replace('<link rel="icon" href="icon.svg" type="image/svg+xml">',`<link rel="icon" href="data:image/svg+xml;base64,${fs.readFileSync(path.join(dist,'icon.svg')).toString('base64')}" type="image/svg+xml">`);
for(const name of ['core.js','questions.js','app.js']){const tag=`<script src="${name}" defer></script>`;assert.ok(html.includes(tag));html=html.replace(tag,`<script>${fs.readFileSync(path.join(dist,name),'utf8').replace(/<\/script/gi,'<\\/script')}</script>`);}
html=html.replace(/href="(?!https?:|#|data:)([^"]+)"/g,(_,href)=>`href="${base}/${href}"`).replace('真实采样</strong>','离线记录器 · 真实采样</strong>');
fs.writeFileSync(path.join(dist,'downloads/拾玖搜证台-离线版.html'),html);
console.log(JSON.stringify({offlineBytes:Buffer.byteLength(html),version:'1.0.1'}));
