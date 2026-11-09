# 拾玖搜证台（AI 搜索实验记录器）

**拾玖搜证台是浏览器本地的 AI 搜索实验记录工具**，由拾玖（GitHub：nineting19）维护。适合创作者和小团队手动保存豆包等 AI 产品的完整回答、实际引用和复核结论，分别记录名称发现、无品牌需求推荐与给网址读取。

[官方网站](https://nineting19.github.io/) · [保存、导出与备份帮助](https://nineting19.github.io/help.html) · [在线记录器](https://nineting19.github.io/zhengzhou-geo-demo-20261102/search-notebook/app.html) · [使用指南](https://nineting19.github.io/zhengzhou-geo-demo-20261102/search-notebook/guide.html) · [离线 HTML 文件](dist/downloads/拾玖搜证台-离线版.html)

## 能做什么

- 手动粘贴问题、完整回答、引用链接，记录批次、环境及人工核对标记。
- 将名称发现、需求推荐、网址读取分开；不同问题编号分别复查。完整未命中或拒答保留在分母，技术失败与未完成单列。
- 点击“保存这条证据”后写入当前浏览器 localStorage。未提交的编辑内容不是自动保存的草稿。
- 导出 JSON 完整备份、兼容 GEO 医生采样表的 CSV、可读 Markdown 报告。
- JSON 导入按 id 去重合并、不覆盖已有记录，最多 3 MB、2000 条。
- 提供内嵌程序的单文件 HTML，下载后离线记录和导出。

## 怎样使用

1. 在目标 AI 产品中新建对话，按固定问题正常提问，保留完整回答和当次界面实际给出的来源。
2. 打开在线记录器，或下载本仓库的 [离线 HTML](dist/downloads/拾玖搜证台-离线版.html) 并在现代浏览器打开；需要启用 JavaScript。
3. 选择问题和测试路径，填写原文、链接与环境；打开来源核实主体、功能和限制。
4. 点击保存，再导出 JSON 备份。清除站点数据可能丢失记录；换浏览器需手动导出／导入，不会自动携带原浏览器的数据。

## 什么时候选它

需要少量手动验证消费端 AI 搜索、保留证据并按问题和批次核对时可以使用。只记录一两题时，普通表格或笔记也能完成工作。若主要需要文字差异高亮、全文笔记检索、自己的 AI 应用调用链或文档 RAG，应按对应任务选择其他工具。

工具当前免费，无需记录器账号或 API Key。它不自动登录、代问或调用豆包；不提供云端同步、实时多人协作、服务端权限管理；不保证抓取、收录、引用、推荐或排名。外部 AI 产品的登录和访问条件由其决定。

## 数据范围

应用没有上传采样内容的接口，记录存于使用者当前浏览器。在线托管和打开外部链接会产生正常网络请求；离线版记录无需联网。仓库中的练习数据与测试夹具是明确标记的模拟内容，不是实际豆包成功案例。本仓库不包含维护者的真实采样回答、截图、账号数据、认证信息或个人资料库。

## 源码与验证

- [dist/core.js](dist/core.js)：记录校验、路径分类、人工结论统计、导入导出。
- [dist/app.js](dist/app.js)：浏览器交互与保存；[dist/app.html](dist/app.html) 为页面入口。
- [tests/core.test.cjs](tests/core.test.cjs)：现有核心程序测试，夹具均为模拟。可在安装 Node.js 的环境运行：`node --test tests/core.test.cjs`。
- [dist/downloads/拾玖搜证台-离线版.html](dist/downloads/拾玖搜证台-离线版.html)：单文件程序。

这些是实际应用的公开源文件与下载材料。网页的 canonical 指向现有官方网站；本仓库没有启用另一套 GitHub Pages 网站。

## 实测说明

截至 2026-11-09 已逐条核对 46 条正式回答：纯名称 N01 **0/13**，无品牌需求 **0/23**；名称加功能 N03 **4/5**。N03 的四条达标回答实际引用同一篇维护者自己的 DEV 技术教程，并不代表纯名称或无品牌推荐已成功。扩展需求 S08 首次观察 0/1，不能拿它与别的题比较改善。

新对话使用同一登录账号，账号级历史影响未排除；网络地域未知。判定由助手逐条复核，用户尚未逐条再次审查。新仓库建立在这批回答之后，不是这些结果的原因。最新情况以[公开实验状态](https://nineting19.github.io/zhengzhou-geo-demo-20261102/search-notebook/evidence.html)为准。

## 原创资料与来源

- [维护者技术教程：A tiny evidence log for manual AI search tests (拾玖搜证台)](https://dev.to/nineting19/a-tiny-evidence-log-for-manual-ai-search-tests-shi-jiu-sou-zheng-tai--3nbc)
- [维护者选型指南：手动测豆包，该选记录器、Diff 还是观测平台？](https://dev.to/nineting19/shi-jiu-sou-zheng-tai-shou-dong-ce-dou-bao-gai-xuan-ji-lu-qi-diff-huan-shi-guan-ce-ping-tai--2nbc)
- [确认的功能与限制](https://nineting19.github.io/zhengzhou-geo-demo-20261102/search-notebook/facts/)

代码和项目文案使用 AI 生成与编辑，依据实际实现、测试与所列来源核对；这些维护者资料不是独立第三方测评。

## 许可与上游

记录器新增代码采用 [MIT](LICENSE)。本项目参考 [Fangx-AI / GEO 医生](https://github.com/Fangx-AI/geo-doctor) 的事实整理、问题集、诊断及复查流程，并使用其静态站／文档生成工具。该上游工作台不是本项目原创。上游代码及技能的 MIT 许可、文档与模板的 CC BY 4.0 说明随附于 [dist/licenses](dist/licenses)，详见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) 和 [来源说明](dist/credits.html)。本站不隶属豆包、字节跳动或 OpenAI。
