import fs from "fs";
import path from "path";
import { fetchGen1Pokemon } from "./(pokeapi)/pokemon";
import { fetchBaseSetPokemon } from "./(pokemontcg)/pokemontcg";

interface AggregatedPokemon {
  id: number;
  name: string;
  // PokeAPI data
  type?: string;
  artwork?: string;
  // TCG data
  tcgId?: string;
  tcgHp?: string;
  tcgTypes?: string[];
  tcgImages?: {
    small: string;
    large: string;
  };
  tcgSet?: {
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
  tcgAbilities?: Array<{
    name: string;
    text: string;
    type: string;
  }>;
  tcgAttacks?: Array<{
    name: string;
    cost: string[];
    convertedEnergyCost: number;
    damage: string;
    text: string;
  }>;
  tcgWeaknesses?: Array<{
    type: string;
    value: string;
  }>;
  tcgResistances?: Array<{
    type: string;
    value: string;
  }>;
  tcgRetreatCost?: string[];
  tcgRarity?: string;
  tcgFlavorText?: string;
  tcgArtist?: string;
  tcgNumber?: string;
  tcgPrices?: {
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
  };
}

interface FallbackPokemon {
  id: number;
  name: string;
  artwork: string;
}

async function getImageBasedPokemon(): Promise<FallbackPokemon[]> {
  const imageDir = path.join(process.cwd(), "public/images");
  try {
    const files = fs.readdirSync(imageDir);
    return files
      .filter((file) => file.endsWith(".png"))
      .map((file, index) => ({
        id: index + 1,
        name: path
          .basename(file, ".png")
          .replace("♀", "-f")
          .replace("♂", "-m")
          .replace(". ", "")
          .toLowerCase(),
        artwork: `/images/${file}`,
      }));
  } catch (error) {
    console.error("Error reading Pokemon images:", error);
    return [];
  }
}

async function safelyFetchPokeApi() {
  try {
    return await fetchGen1Pokemon();
  } catch (error) {
    console.error("PokeAPI fetch failed:", error);
    return null;
  }
}

async function safelyFetchTcgApi() {
  try {
    return await fetchBaseSetPokemon();
  } catch (error) {
    console.error("Pokemon TCG API fetch failed:", error);
    return null;
  }
}

export async function fetchAggregatedPokemon(): Promise<AggregatedPokemon[]> {
  // Fetch data from all sources in parallel
  const [pokeApiData, tcgData, imageData] = await Promise.all([
    safelyFetchPokeApi(),
    safelyFetchTcgApi(),
    getImageBasedPokemon(),
  ]);

  // Create a map for TCG data if available
  const tcgDataMap = tcgData
    ? new Map(tcgData.map((card) => [normalizeName(card.name), card]))
    : new Map();

  // Create a map for PokeAPI data if available
  const pokeApiDataMap = pokeApiData
    ? new Map(
        pokeApiData.map((pokemon) => [normalizeName(pokemon.name), pokemon])
      )
    : new Map();

  // Use image data as the base source of truth
  return imageData.map((imagePokemon) => {
    const normalizedName = normalizeName(imagePokemon.name);
    const pokeApiPokemon = pokeApiDataMap.get(normalizedName);
    const tcgCard = tcgDataMap.get(normalizedName);

    return {
      id: pokeApiPokemon?.id || imagePokemon.id,
      name: pokeApiPokemon?.name || imagePokemon.name,
      // PokeAPI data (if available)
      type: pokeApiPokemon?.type,
      artwork: pokeApiPokemon?.artwork || imagePokemon.artwork,
      // TCG data (if available)
      ...(tcgCard && {
        tcgId: tcgCard.id,
        tcgHp: tcgCard.hp,
        tcgTypes: tcgCard.types,
        tcgImages: tcgCard.images,
        tcgSet: tcgCard.set,
        tcgAbilities: tcgCard.abilities,
        tcgAttacks: tcgCard.attacks,
        tcgWeaknesses: tcgCard.weaknesses,
        tcgResistances: tcgCard.resistances,
        tcgRetreatCost: tcgCard.retreatCost,
        tcgRarity: tcgCard.rarity,
        tcgFlavorText: tcgCard.flavorText,
        tcgArtist: tcgCard.artist,
        tcgNumber: tcgCard.number,
        tcgPrices: {
          tcgplayer: tcgCard.tcgplayer,
          cardmarket: tcgCard.cardmarket,
        },
      }),
    };
  });
}

// Helper function to normalize Pokemon names for comparison
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "") // Remove special characters
    .replace(/^mr/, "mr.") // Handle Mr. Mime
    .replace(/^nidoran[mf]$/, "nidoran") // Handle Nidoran♂/♀
    .replace(/\s+/g, ""); // Remove any remaining whitespace
}
