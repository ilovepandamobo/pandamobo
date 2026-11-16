# 参考站观察

观察日期：2026-11-03。只记录实际打开过的页面。

## 已访问

- https://www.sinoclick.com/
- 页面标题：飞书逸途 - Facebook/TikTok/Google官方广告开户一级代理商
- 页面可公开打开，没有遇到访问验证，也没有绕过任何访问控制。
- 内页没有逐一点开，不能把导航里的栏目名称当成已经分析过的页面。

## 桌面端

在 1440×900 视口测量，之后截图时浏览器视口也曾落在 1280 宽。整页滚动高度约 6146px。

- 导航固定，计算高度约 60px，背景计算值为透明。左侧品牌，中间文字链接：解决方案、服务与产品、成功案例、出海学院、合作伙伴、关于我们。右侧是白底胶囊按钮“登录/注册”。解决方案、服务与产品、关于我们是可展开菜单。滚动后导航在画面上呈现为白底横条。
- 正文字体栈包含 PingFang SC、system-ui、Roboto、Helvetica、微软雅黑。正文颜色约为 rgb(29, 33, 41)，页面底色为白。
- 1440 宽下内容列大约 1088px，左右留白大约 176px。
- 首屏是轮播，不是单张主视觉。观察到的画面包括 TikTok Shop 促销、全渠道效果营销，以及带有万里汇标识的一帧。轮播区域高度约 594px，背景是浅蓝色渐变和细网格。左侧是标题、说明和两枚胶囊按钮（线框按钮加蓝色实心按钮），右侧是产品照片或插画。PandaMobo 首页按任务要求使用一张主视觉，不复制这套轮播。
- 下一屏标题居中，三张白卡片并排，圆角和轻阴影。卡片内有标题、短文、标签和“了解更多”按钮，卡片下半是插画。标题右侧有悬浮二维码。
- 媒体区块是左文右图：左侧标题、要点和蓝色按钮，右侧是浅蓝色球体，上面漂着平台标识。
- 服务区块是一排浅紫色竖卡，其中一张展开更多文字和界面图，其余较窄。
- 再往下是宽圆角面板，左文右示意图；然后是横向标签，展开后带有仪表盘式图形。
- 案例是两行三列。图片在上，带标签；下面是标题、一句说明，以及媒体和品牌信息。
- 合作伙伴是白色圆角标识卡片，滚动时能看到不止一排，呈现横向延续。
- 页尾咨询带是蓝紫色波浪渐变，标题居中，两枚按钮。页脚是深色，左侧品牌和联系方式，中间多列链接，右侧二维码，底部有友情链接、版权和备案。
- 主按钮视觉上是饱和蓝，页脚接近深蓝黑。没有把对方按钮的计算色值当成可复用的官方色，因为采样没有稳定命中按钮本体。

截图：

- `docs/reference/screenshots/sinoclick-desktop-hero.png`
- `docs/reference/screenshots/sinoclick-desktop-900.png`
- `docs/reference/screenshots/sinoclick-desktop-1680.png`
- `docs/reference/screenshots/sinoclick-desktop-2500.png`
- `docs/reference/screenshots/sinoclick-desktop-3300.png`
- `docs/reference/screenshots/sinoclick-desktop-4100.png`
- `docs/reference/screenshots/sinoclick-desktop-5000.png`
- `docs/reference/screenshots/sinoclick-desktop-footer.png`

## 移动端

Playwright 将视口设为 390×844 并重新加载。

- `window.innerWidth` 为 390，`documentElement.scrollWidth` 仍为 1280，存在横向溢出。
- 导航没有收成汉堡菜单，可见区域只露出“解决方案”“服务与产品”，标题和右侧按钮被裁切。
- 这是参考站在该宽度下的实际表现，不作为 PandaMobo 的移动端布局来源。PandaMobo 需要在 375 和 390 宽度下避免横向溢出，并提供可开关的菜单。

截图：

- `docs/reference/screenshots/sinoclick-mobile-390-hero.png`
- `docs/reference/screenshots/sinoclick-mobile-390-reloaded.png`

## 采用与不采用

采用的是桌面端的组织方式：固定浅色导航、居中的内容宽度、大标题、充足留白、左文右图、白卡片、胶囊按钮、深色页脚和页尾咨询带。

不采用参考站的文案、客户、资质、联系方式、二维码、品牌标识，也不把它的轮播和移动端裁切照搬过来。PandaMobo 的颜色按通案里的高饱和蓝、深蓝和白色建立第一版变量，这些数值是设计初稿，不是已确认的官方标准色。
