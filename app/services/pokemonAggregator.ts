import fs from "fs";
import path from "path";
import { fetchGen1Pokemon } from "./(pokeapi)/pokemon";
import {
  CardMarket,
  fetchBaseSetPokemon,
  TCGAbility,
  TCGAttack,
  TCGImages,
  TCGPlayer,
  TCGSet,
  TCGTypeEffect,
} from "./(pokemontcg)/pokemontcg";

export interface AggregatedPokemon {
  id: number;
  name: string;
  // PokeAPI data
  type?: string;
  artwork?: string;
  // TCG data
  tcgId?: string;
  tcgHp?: string;
  tcgTypes?: string[];
  tcgImages?: TCGImages;
  tcgSet?: TCGSet;
  tcgAbilities?: TCGAbility[];
  tcgAttacks?: TCGAttack[];
  tcgWeaknesses?: TCGTypeEffect[];
  tcgResistances?: TCGTypeEffect[];
  tcgRetreatCost?: string[];
  tcgRarity?: string;
  tcgFlavorText?: string;
  tcgArtist?: string;
  tcgNumber?: string;
  tcgPrices?: {
    tcgplayer?: TCGPlayer;
    cardmarket?: CardMarket;
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

// Helper function to get the effective ID for sorting
function getEffectiveId(pokemon: AggregatedPokemon): number {
  // If we have a PokeAPI ID, use that (matches Pokedex number)
  if (pokemon.id) {
    return pokemon.id;
  }

  // If we have a TCG number, try to parse it
  if (pokemon.tcgNumber) {
    const parsedId = parseInt(pokemon.tcgNumber, 10);
    if (!isNaN(parsedId)) {
      return parsedId;
    }
  }

  // If we have a TCG ID that starts with 'base1-', try to parse the number after it
  if (pokemon.tcgId && pokemon.tcgId.startsWith("base1-")) {
    const parsedId = parseInt(pokemon.tcgId.replace("base1-", ""), 10);
    if (!isNaN(parsedId)) {
      return parsedId;
    }
  }

  // Default to a large number to put unidentified Pokémon at the end
  return 1000;
}

export async function fetchAggregatedPokemon(): Promise<AggregatedPokemon[]> {
  // Fetch data from all sources in parallel
  const [pokeApiData, tcgData, imageData] = await Promise.allSettled([
    safelyFetchPokeApi(),
    safelyFetchTcgApi(),
    getImageBasedPokemon(),
  ]);

  const tcgDataMap =
    tcgData.status === "fulfilled"
      ? new Map(tcgData.value?.map((card) => [normalizeName(card.name), card]))
      : new Map();

  // Create a map for PokeAPI data if available
  const pokeApiDataMap =
    pokeApiData.status === "fulfilled"
      ? new Map(
          pokeApiData.value?.map((pokemon) => [
            normalizeName(pokemon.name),
            pokemon,
          ])
        )
      : new Map();

  // Since imageData is reading local files, it will always be fulfilled
  const images = imageData.status === "fulfilled" ? imageData.value : [];

  // Create aggregated Pokemon data
  const aggregatedPokemon = images.map((imagePokemon: FallbackPokemon) => {
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

  // Sort the Pokemon by their effective IDs
  return aggregatedPokemon.sort(
    (a, b) => getEffectiveId(a) - getEffectiveId(b)
  );
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
