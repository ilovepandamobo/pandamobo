export type ProductArtVariant = "rocket" | "spark" | "compass" | "mc";

export type ProductArtConfig = {
  variant: ProductArtVariant;
  src: string;
  alt: string;
};

export const productArtById: Record<string, ProductArtConfig> = {
  pandarocket: {
    variant: "rocket",
    src: "/brand/products/panda-rocket.png",
    alt: "玻璃火箭与广告资产管理仓",
  },
  joinspark: {
    variant: "spark",
    src: "/brand/products/joinspark.png",
    alt: "创意棱镜与多风格广告素材",
  },
  joincompass: {
    variant: "compass",
    src: "/brand/products/joincompass.png",
    alt: "跨境运营罗盘与沟通气泡",
  },
  joinmc: {
    variant: "mc",
    src: "/brand/products/joinmc.png",
    alt: "社媒协同核心与客户互动模块",
  },
};

export function productArtFor(id: string) {
  return productArtById[id] ?? null;
}
