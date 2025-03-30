const API_KEY = process.env.POKEMON_TCG_API_KEY;
const BASE_URL = "https://api.pokemontcg.io/v2";

interface PokemonTCGCard {
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
  abilities?: Array<{
    name: string;
    text: string;
    type: string;
  }>;
  attacks?: Array<{
    name: string;
    cost: string[];
    convertedEnergyCost: number;
    damage: string;
    text: string;
  }>;
  weaknesses?: Array<{
    type: string;
    value: string;
  }>;
  resistances?: Array<{
    type: string;
    value: string;
  }>;
  retreatCost?: string[];
  convertedRetreatCost?: number;
  set: {
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
  };
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
  images: {
    small: string;
    large: string;
  };
  tcgplayer?: {
    url: string;
    updatedAt: string;
    prices: {
      normal?: {
        low: number;
        mid: number;
        high: number;
        market: number;
        directLow: number;
      };
      holofoil?: {
        low: number;
        mid: number;
        high: number;
        market: number;
        directLow: number;
      };
      reverseHolofoil?: {
        low: number;
        mid: number;
        high: number;
        market: number;
        directLow: number;
      };
    };
  };
  cardmarket?: {
    url: string;
    updatedAt: string;
    prices: {
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
    };
  };
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
    console.log("Pokemon TCG Base Set Data:", JSON.stringify(data, null, 2));

    return data.data;
  } catch (error) {
    console.error("Error fetching Pokemon TCG data:", error);
    throw error;
  }
}
