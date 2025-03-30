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

export async function fetchAggregatedPokemon(): Promise<AggregatedPokemon[]> {
  try {
    // Fetch data from both APIs in parallel
    const [pokeApiData, tcgData] = await Promise.all([
      fetchGen1Pokemon(),
      fetchBaseSetPokemon(),
    ]);

    // Create a map of TCG cards by normalized name for easier lookup
    const tcgDataMap = new Map(
      tcgData.map((card) => [normalizeName(card.name), card])
    );

    // Combine the data, using PokeAPI as the base
    return pokeApiData.map((pokemon) => {
      const tcgCard = tcgDataMap.get(normalizeName(pokemon.name));

      return {
        id: pokemon.id,
        name: pokemon.name,
        // PokeAPI data
        type: pokemon.type,
        artwork: pokemon.artwork,
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
  } catch (error) {
    console.error("Error aggregating Pokemon data:", error);
    throw error;
  }
}

// Helper function to normalize Pokemon names for comparison
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "") // Remove special characters
    .replace(/^mr/, "mr.") // Handle Mr. Mime
    .replace(/^nidoran[mf]$/, "nidoran"); // Handle Nidoran♂/♀
}
