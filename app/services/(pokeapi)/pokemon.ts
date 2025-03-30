import { Pokemon, PokemonCardData } from "../../types/pokemon";

const POKE_API_BASE_URL = "https://pokeapi.co/api/v2";

interface PokemonListItem {
  name: string;
  url: string;
}

interface PokemonWithId {
  name: string;
  id: number;
  detailsPromise: Promise<Pokemon>;
}

interface PokemonList {
  results: PokemonListItem[];
}

async function fetchPokemonDetails(url: string): Promise<Pokemon> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon details`);
  }
  return response.json();
}

async function fetchPokemonList(): Promise<PokemonList> {
  const response = await fetch(
    `${POKE_API_BASE_URL}/pokemon?limit=151&offset=0`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch Pokemon list");
  }
  return response.json();
}

function createPokemonWithIds(pokemonList: PokemonList): PokemonWithId[] {
  return pokemonList.results.map(
    (pokemon: PokemonListItem, index: number): PokemonWithId => ({
      name: pokemon.name,
      id: index + 1,
      detailsPromise: fetchPokemonDetails(pokemon.url),
    })
  );
}

function mapToPokemonCardData(
  pokemon: PokemonWithId,
  details: Pokemon
): PokemonCardData {
  return {
    id: pokemon.id,
    name: pokemon.name,
    type: details.types[0].type.name,
    artwork: details.sprites.other["official-artwork"].front_default,
  };
}

function createFallbackPokemonData(pokemon: PokemonWithId): PokemonCardData {
  return {
    id: pokemon.id,
    name: pokemon.name,
    type: undefined,
    artwork: undefined,
  };
}

export async function fetchGen1Pokemon(): Promise<PokemonCardData[]> {
  try {
    // Step 1: Fetch basic Pokemon list
    const pokemonList = await fetchPokemonList();

    // Step 2: Create Pokemon with IDs and detail promises
    const pokemonWithIds = createPokemonWithIds(pokemonList);

    // Step 3: Fetch all details in parallel
    const results = await Promise.allSettled(
      pokemonWithIds.map((p) => p.detailsPromise)
    );

    // Step 4: Map results to final format
    return pokemonWithIds.map((pokemon, index) => {
      const detailsResult = results[index];

      if (detailsResult.status === "fulfilled") {
        return mapToPokemonCardData(pokemon, detailsResult.value);
      }

      return createFallbackPokemonData(pokemon);
    });
  } catch (error) {
    console.error("Error fetching Gen 1 Pokemon:", error);
    throw new Error("Failed to fetch Pokemon data. Please try again later.");
  }
}
