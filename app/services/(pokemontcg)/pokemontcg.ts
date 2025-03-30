const API_KEY = process.env.POKEMON_TCG_API_KEY;
const BASE_URL = "https://api.pokemontcg.io/v2";

export interface TCGPricing {
  low: number;
  mid: number;
  high: number;
  market: number;
  directLow: number;
}

export interface TCGPrices {
  normal?: TCGPricing;
  holofoil?: TCGPricing;
  reverseHolofoil?: TCGPricing;
}

export interface TCGPlayer {
  url: string;
  updatedAt: string;
  prices: TCGPrices;
}

export interface CardMarketPrices {
  averageSellPrice: number;
  lowPrice: number;
  trendPrice: number;
  germanProLow: number | null;
  suggestedPrice: number | null;
  reverseHoloSell: number | null;
  reverseHoloLow: number | null;
  reverseHoloTrend: number | null;
  lowPriceExPlus: number;
  avg1: number;
  avg7: number;
  avg30: number;
  reverseHoloAvg1: number | null;
  reverseHoloAvg7: number | null;
  reverseHoloAvg30: number | null;
}

export interface CardMarket {
  url: string;
  updatedAt: string;
  prices: CardMarketPrices;
}

export interface TCGSet {
  id: string;
  name: string;
  series: string;
  printedTotal: number;
  total: number;
  legalities: {
    unlimited: string;
    standard: string;
    expanded: string;
  };
  releaseDate: string;
  updatedAt: string;
}

export interface TCGAbility {
  name: string;
  text: string;
  type: string;
}

export interface TCGAttack {
  name: string;
  cost: string[];
  convertedEnergyCost: number;
  damage: string;
  text: string;
}

export interface TCGTypeEffect {
  type: string;
  value: string;
}

export interface TCGImages {
  small: string;
  large: string;
}

export interface PokemonTCGCard {
  id: string;
  name: string;
  supertype: string;
  subtypes: string[];
  level?: string;
  hp: string;
  types: string[];
  evolvesFrom?: string;
  evolvesTo?: string[];
  rules?: string[];
  abilities?: TCGAbility[];
  attacks?: TCGAttack[];
  weaknesses?: TCGTypeEffect[];
  resistances?: TCGTypeEffect[];
  retreatCost?: string[];
  convertedRetreatCost?: number;
  set: TCGSet;
  number: string;
  artist: string;
  rarity: string;
  flavorText?: string;
  nationalPokedexNumbers: number[];
  legalities: {
    unlimited: string;
    standard: string;
    expanded: string;
  };
  images: TCGImages;
  tcgplayer?: TCGPlayer;
  cardmarket?: CardMarket;
}

interface PokemonTCGResponse {
  data: PokemonTCGCard[];
  page: number;
  pageSize: number;
  count: number;
  totalCount: number;
}

export async function fetchBaseSetPokemon(): Promise<PokemonTCGCard[]> {
  try {
    if (!API_KEY) {
      throw new Error("Pokemon TCG API key is not configured");
    }

    const response = await fetch(
      `${BASE_URL}/cards?q=set.id:base1 supertype:pokemon&orderBy=number&page=1&pageSize=151`,
      {
        headers: {
          "X-Api-Key": API_KEY as string,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch Pokemon TCG data: ${response.statusText}`
      );
    }

    const data: PokemonTCGResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching Pokemon TCG data:", error);
    throw error;
  }
}
