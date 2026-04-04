export type AILabPresetCatalogItem = {
  id: string
  name: string
  hairStyle: string
  thumbnailSlug: string
}

// `hairStyle` values follow AILab hairstyle-editor-pro documented options.
export const AILAB_PRESET_CATALOG: AILabPresetCatalogItem[] = [
  {
    id: "pixie-cut",
    name: "Pixie Cut",
    hairStyle: "PixieCut",
    thumbnailSlug: "female_pixie_cut",
  },
  {
    id: "bob-cut",
    name: "Bob Cut",
    hairStyle: "BobCut",
    thumbnailSlug: "female_bob",
  },
  {
    id: "choppy-bob",
    name: "Choppy Bob",
    hairStyle: "ChoppyBob",
    thumbnailSlug: "female_choppy_layers",
  },
  {
    id: "long-curly",
    name: "Long Curly",
    hairStyle: "LongCurly",
    thumbnailSlug: "female_curly",
  },
  {
    id: "long-straight",
    name: "Long Straight",
    hairStyle: "LongStraight",
    thumbnailSlug: "female_straight",
  },
  {
    id: "long-wavy",
    name: "Long Wavy",
    hairStyle: "LongWavy",
    thumbnailSlug: "female_wavy",
  },
  {
    id: "cornrow-braids",
    name: "Cornrow Braids",
    hairStyle: "CornrowBraids",
    thumbnailSlug: "female_cornrows",
  },
  {
    id: "fishtail-braid",
    name: "Fishtail Braid",
    hairStyle: "FishtailBraid",
    thumbnailSlug: "female_fishtail_braid",
  },
  {
    id: "afro",
    name: "Afro",
    hairStyle: "Afro",
    thumbnailSlug: "female_twist_out",
  },
  {
    id: "man-bun",
    name: "Man Bun",
    hairStyle: "ManBun",
    thumbnailSlug: "female_messy_bun",
  },
  {
    id: "ponytail",
    name: "Ponytail",
    hairStyle: "Ponytail",
    thumbnailSlug: "female_high_ponytail",
  },
  {
    id: "slick-back",
    name: "Slick Back",
    hairStyle: "SlickBack",
    thumbnailSlug: "female_ballerina_bun",
  },
]

export const AILAB_HAIRSTYLE_SET = new Set(
  AILAB_PRESET_CATALOG.map((item) => item.hairStyle)
)
