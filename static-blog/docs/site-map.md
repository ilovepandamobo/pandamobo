# 站点路由

主导航按网站架构图排列。出海资讯已进入导航，但没有真实稿件，页面禁止收录。招聘仍不进入导航。

| 路径 | 名称 | 阶段 | 当前状态 |
|---|---|---|---|
| `/` | 首页 | 1 | Banner、媒体矩阵、地图、四大服务、WhatsApp、AI 产品、案例 |
| `/services` | 优质媒介服务 | 2 | 广告资产管理、广告代投、品牌出海、全球商业智库 |
| `/services/ad-asset-operations` | 广告资产管理 | 2 | 已建 |
| `/services/media-operations` | 广告代投服务 | 2 | 已建 |
| `/services/global-brand-marketing` | 品牌出海营销 | 2 | 已建 |
| `/services/strategic-studio` | 全球商业智库 | 2 | 策略支持，不是软件 |
| `/solutions` | 行业解决方案 | 2 | 五个行业入口 |
| `/solutions/[slug]` | 行业子页 | 2 | 只连接已收录案例 |
| `/whatsapp` | WhatsApp | 2 | 不展示价格和到达率 |
| `/products` | 技术产品 | 2 | Panda Rocket、JoinSpark、JoinCompass |
| `/products/pandarocket` | Panda Rocket | 2 | 沿用通案能力 |
| `/products/joinspark` | JoinSpark | 2 | 功能清单未确认 |
| `/products/joincompass` | JoinCompass | 2 | 功能清单未确认 |
| `/products/joinmc` | JoinMC | 2 | 保留，不并入 JoinSpark |
| `/cases` | 成功案例 | 2 | 客户评价为空，案例来自通案 |
| `/cases/[slug]` | 案例详情 | 2 | 已建，12 条 |
| `/insights` | 出海资讯 | 2 | 四个栏目均为空态，noindex |
| `/insights/[slug]` | 文章详情 | 3 | 等 CMS |
| `/about` | 关于我们 | 2 | 定位、服务优势、企业荣誉、留资 |
| `/careers` | 加入我们 | 2 | 空态，不进入导航 |
| `/contact` | 联系我们 | 2 | 已建，表单仍不发送 |
| `/privacy` | 隐私政策 | 2 | 待确认主体，只有说明 |
| `/admin` | 运营后台 | 3 | 未建 |

代码中的同一份清单在 `src/lib/routes.ts`。行业页不编造打法和效果。备案、友情链接、二维码和联系方式确认前不展示。
