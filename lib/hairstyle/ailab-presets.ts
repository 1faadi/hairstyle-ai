export type AILabPresetCatalogItem = {
  id: string
  name: string
  hairStyle: string
  gender: "male" | "female"
  thumbnailSlug: string
}

const MALE_PRESETS: AILabPresetCatalogItem[] = [
  { id: "male-buzz-cut", name: "Buzz Cut", hairStyle: "BuzzCut", gender: "male", thumbnailSlug: "male_buzzcut" },
  { id: "male-undercut", name: "Undercut", hairStyle: "UnderCut", gender: "male", thumbnailSlug: "male_undercut" },
  { id: "male-pompadour", name: "Pompadour", hairStyle: "Pompadour", gender: "male", thumbnailSlug: "male_pompadour" },
  { id: "male-slick-back", name: "Slick Back", hairStyle: "SlickBack", gender: "male", thumbnailSlug: "male_slick_back" },
  { id: "male-curly-shag", name: "Curly Shag", hairStyle: "CurlyShag", gender: "male", thumbnailSlug: "male_curly_shag" },
  { id: "male-wavy-shag", name: "Wavy Shag", hairStyle: "WavyShag", gender: "male", thumbnailSlug: "male_wavy_shag" },
  { id: "male-faux-hawk", name: "Faux Hawk", hairStyle: "FauxHawk", gender: "male", thumbnailSlug: "male_faux_hawk" },
  { id: "male-spiky", name: "Spiky", hairStyle: "Spiky", gender: "male", thumbnailSlug: "male_spiky" },
  { id: "male-comb-over", name: "Comb Over", hairStyle: "CombOver", gender: "male", thumbnailSlug: "male_comb_over" },
  { id: "male-high-tight-fade", name: "High and Tight Fade", hairStyle: "HighTightFade", gender: "male", thumbnailSlug: "male_high_tight_fade" },
  { id: "male-man-bun", name: "Man Bun", hairStyle: "ManBun", gender: "male", thumbnailSlug: "male_man_bun" },
  { id: "male-afro", name: "Afro", hairStyle: "Afro", gender: "male", thumbnailSlug: "male_afro" },
  { id: "male-low-fade", name: "Low Fade", hairStyle: "LowFade", gender: "male", thumbnailSlug: "male_low_fade" },
  { id: "male-undercut-long-hair", name: "Undercut Long Hair", hairStyle: "UndercutLongHair", gender: "male", thumbnailSlug: "male_undercut_long_hair" },
  { id: "male-two-block", name: "Two Block Haircut", hairStyle: "TwoBlockHaircut", gender: "male", thumbnailSlug: "male_two_block_haircut" },
  { id: "male-textured-fringe", name: "Textured Fringe", hairStyle: "TexturedFringe", gender: "male", thumbnailSlug: "male_textured_fringe" },
  { id: "male-blunt-bowl-cut", name: "Blunt Bowl Cut", hairStyle: "BluntBowlCut", gender: "male", thumbnailSlug: "male_blunt_bowl_cut" },
  { id: "male-long-wavy-curtain-bangs", name: "Long Wavy Curtain Bangs", hairStyle: "LongWavyCurtainBangs", gender: "male", thumbnailSlug: "male_long_wavy_curtain_bangs" },
  { id: "male-messy-tousled", name: "Messy Tousled", hairStyle: "MessyTousled", gender: "male", thumbnailSlug: "male_messy_tousled" },
  { id: "male-cornrow-braids", name: "Cornrow Braids", hairStyle: "CornrowBraids", gender: "male", thumbnailSlug: "male_cornrow_braids" },
  { id: "male-long-hair-tied-up", name: "Long Hair Tied Up", hairStyle: "LongHairTiedUp", gender: "male", thumbnailSlug: "male_long_hair_tied_up" },
  { id: "male-middle-parted", name: "Middle Parted", hairStyle: "Middle-parted", gender: "male", thumbnailSlug: "male_middle_parted" },
]

const FEMALE_PRESETS: AILabPresetCatalogItem[] = [
  { id: "female-short-pixie-shaved-sides", name: "Short Pixie With Shaved Sides", hairStyle: "ShortPixieWithShavedSides", gender: "female", thumbnailSlug: "female_sideswept_pixie" },
  { id: "female-short-neat-bob", name: "Short Neat Bob", hairStyle: "ShortNeatBob", gender: "female", thumbnailSlug: "female_bob" },
  { id: "female-double-bun", name: "Double Bun", hairStyle: "DoubleBun", gender: "female", thumbnailSlug: "female_space_buns" },
  { id: "female-updo", name: "Updo", hairStyle: "Updo", gender: "female", thumbnailSlug: "female_updo" },
  { id: "female-spiked", name: "Spiked", hairStyle: "Spiked", gender: "female", thumbnailSlug: "female_spiked" },
  { id: "female-bowl-cut", name: "Bowl Cut", hairStyle: "bowlCut", gender: "female", thumbnailSlug: "female_pageboy" },
  { id: "female-chignon", name: "Chignon", hairStyle: "Chignon", gender: "female", thumbnailSlug: "female_messy_chignon" },
  { id: "female-pixie-cut", name: "Pixie Cut", hairStyle: "PixieCut", gender: "female", thumbnailSlug: "female_pixie_cut" },
  { id: "female-slicked-back", name: "Slicked Back", hairStyle: "SlickedBack", gender: "female", thumbnailSlug: "female_ballerina_bun" },
  { id: "female-long-curly", name: "Long Curly", hairStyle: "LongCurly", gender: "female", thumbnailSlug: "female_curly" },
  { id: "female-curly-bob", name: "Curly Bob", hairStyle: "CurlyBob", gender: "female", thumbnailSlug: "female_bob" },
  { id: "female-stacked-curls-short-bob", name: "Stacked Curls Short Bob", hairStyle: "StackedCurlsInShortBob", gender: "female", thumbnailSlug: "female_graduated_bob" },
  { id: "female-side-part-comb-over-high-fade", name: "Side Part Comb-Over High Fade", hairStyle: "SidePartCombOverHairstyleWithHighFade", gender: "female", thumbnailSlug: "female_side_swept_bangs" },
  { id: "female-wavy-french-bob-1920", name: "Wavy French Bob 1920", hairStyle: "WavyFrenchBobVibesfrom1920", gender: "female", thumbnailSlug: "female_finger_waves" },
  { id: "female-bob-cut", name: "Bob Cut", hairStyle: "BobCut", gender: "female", thumbnailSlug: "female_bob" },
  { id: "female-short-twintails", name: "Short Twintails", hairStyle: "ShortTwintails", gender: "female", thumbnailSlug: "female_pigtails" },
  { id: "female-short-curly-pixie", name: "Short Curly Pixie", hairStyle: "ShortCurlyPixie", gender: "female", thumbnailSlug: "female_sideswept_pixie" },
  { id: "female-long-straight", name: "Long Straight", hairStyle: "LongStraight", gender: "female", thumbnailSlug: "female_straight" },
  { id: "female-long-wavy", name: "Long Wavy", hairStyle: "LongWavy", gender: "female", thumbnailSlug: "female_wavy" },
  { id: "female-fishtail-braid", name: "Fishtail Braid", hairStyle: "FishtailBraid", gender: "female", thumbnailSlug: "female_fishtail_braid" },
  { id: "female-twin-braids", name: "Twin Braids", hairStyle: "TwinBraids", gender: "female", thumbnailSlug: "female_double_dutch_braids" },
  { id: "female-ponytail", name: "Ponytail", hairStyle: "Ponytail", gender: "female", thumbnailSlug: "female_high_ponytail" },
  { id: "female-dreadlocks", name: "Dreadlocks", hairStyle: "Dreadlocks", gender: "female", thumbnailSlug: "female_dreadlocks" },
  { id: "female-cornrows", name: "Cornrows", hairStyle: "Cornrows", gender: "female", thumbnailSlug: "female_cornrows" },
  { id: "female-shoulder-length", name: "Shoulder Length Straight", hairStyle: "ShoulderLengthHair", gender: "female", thumbnailSlug: "female_lob" },
  { id: "female-loose-curly-afro", name: "Loose Curly Afro", hairStyle: "LooseCurlyAfro", gender: "female", thumbnailSlug: "female_curly" },
  { id: "female-long-twintails", name: "Long Twintails", hairStyle: "LongTwintails", gender: "female", thumbnailSlug: "female_long_twintails" },
  { id: "female-long-hime-cut", name: "Long Hime Cut", hairStyle: "LongHimeCut", gender: "female", thumbnailSlug: "female_long_hime_cut" },
  { id: "female-box-braids", name: "Box Braids", hairStyle: "BoxBraids", gender: "female", thumbnailSlug: "female_box_braids" },
]

export const AILAB_PRESET_CATALOG: AILabPresetCatalogItem[] = [
  ...MALE_PRESETS,
  ...FEMALE_PRESETS,
]

export const AILAB_HAIRSTYLE_SET = new Set(
  AILAB_PRESET_CATALOG.map((item) => item.hairStyle)
)
