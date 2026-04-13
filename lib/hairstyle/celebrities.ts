import { getCelebrityPortraitDeliveryUrl } from "@/lib/hairstyle/celebrity-image-url"

export type CelebrityRegion = "hollywood" | "bollywood"

export interface CelebrityPortrait {
  id: string
  name: string
  region: CelebrityRegion
  /** HTTPS Cloudinary URL or `/celebrities/...` when Cloudinary env is unset */
  imageSrc: string
  /** Short credit line for UI */
  attribution: string
}

type CelebrityPortraitSeed = {
  id: string
  name: string
  region: CelebrityRegion
  imageFileName: string
  attribution: string
}

const CELEBRITY_PORTRAIT_SEEDS: readonly CelebrityPortraitSeed[] = [
  {
    id: "margot-robbie",
    name: "Margot Robbie",
    region: "hollywood",
    imageFileName: "margot-robbie.jpg",
    attribution: "Glenn Francis / Wikimedia Commons (CC BY-SA 4.0)",
  },
  {
    id: "brad-pitt",
    name: "Brad Pitt",
    region: "hollywood",
    imageFileName: "brad-pitt.jpg",
    attribution: "Glenn Francis / Wikimedia Commons (CC BY-SA 4.0)",
  },
  {
    id: "leonardo-dicaprio",
    name: "Leonardo DiCaprio",
    region: "hollywood",
    imageFileName: "leonardo-dicaprio.jpg",
    attribution: "GabboT / Wikimedia Commons (CC BY-SA 2.0)",
  },
  {
    id: "tom-cruise",
    name: "Tom Cruise",
    region: "hollywood",
    imageFileName: "tom-cruise.jpg",
    attribution: "Gage Skidmore / Wikimedia Commons (CC BY-SA 3.0)",
  },
  {
    id: "sydney-sweeney",
    name: "Sydney Sweeney",
    region: "hollywood",
    imageFileName: "sydney-sweeney.jpg",
    attribution: "Glenn Francis / Wikimedia Commons (CC BY-SA 4.0)",
  },
  {
    id: "deepika-padukone",
    name: "Deepika Padukone",
    region: "bollywood",
    imageFileName: "deepika-padukone.jpg",
    attribution: "Georges Biard / Wikimedia Commons (CC BY-SA 3.0)",
  },
]

export const CELEBRITY_PORTRAITS: readonly CelebrityPortrait[] = CELEBRITY_PORTRAIT_SEEDS.map(
  (row) => ({
    id: row.id,
    name: row.name,
    region: row.region,
    attribution: row.attribution,
    imageSrc: getCelebrityPortraitDeliveryUrl(row.imageFileName),
  })
)
