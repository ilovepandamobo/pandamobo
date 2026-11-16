export type ProductExperienceMedia = { type: "video" | "image"; src: string; poster?: string };

/** Add a product's final video or image here; the surrounding interaction stays unchanged. */
export const productExperienceMedia: Partial<Record<string, ProductExperienceMedia>> = {};

export const productExperienceDesign: Record<string, {
  headline: string; accent: string; tint: string; label: string; stages: string[]; widget: string;
}> = {
  pandarocket: { headline: "广告资产\n尽在掌握", accent: "#2465e8", tint: "224 236 255", label: "ASSET WORKSPACE", stages: ["账户接入", "资产管理", "实时监测"], widget: "账户与资产，一处协同" },
  joinspark: { headline: "让每一次灵感\n成为出海创意", accent: "#8b55d8", tint: "238 226 255", label: "CREATIVE WORKSPACE", stages: ["创意输入", "素材生成", "持续迭代"], widget: "从灵感到多风格素材" },
  joincompass: { headline: "跨越时区与语言\n连接每一次商机", accent: "#7158cd", tint: "230 228 255", label: "CONVERSATION WORKSPACE", stages: ["线索接入", "协同跟进", "客户互动"], widget: "让每一次沟通，顺畅连接" },
  joinmc: { headline: "让品牌的每次发声\n都有回应", accent: "#168caf", tint: "219 243 247", label: "SOCIAL WORKSPACE", stages: ["内容规划", "矩阵运营", "互动洞察"], widget: "连接内容、社媒与用户" },
};
