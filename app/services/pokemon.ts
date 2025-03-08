import { Pokemon, PokemonCardData } from "../types/pokemon";

const POKE_API_BASE_URL = "https://pokeapi.co/api/v2";

export async function fetchPokemon(id: number): Promise<Pokemon> {
  const response = await fetch(`${POKE_API_BASE_URL}/pokemon/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon with ID ${id}`);
  }
  return response.json();
}

export async function fetchGen1Pokemon(): Promise<PokemonCardData[]> {
  // Gen 1 Pokemon IDs are 1-151
  const gen1Ids = Array.from({ length: 151 }, (_, i) => i + 1);

  try {
    const pokemonPromises = gen1Ids.map((id) => fetchPokemon(id));
    const pokemonData = await Promise.all(pokemonPromises);

    return pokemonData.map((pokemon) => ({
      id: pokemon.id,
      name: pokemon.name,
      type: pokemon.types[0].type.name,
      artwork: pokemon.sprites.other["official-artwork"].front_default,
    }));
  } catch (error) {
    console.error("Error fetching Gen 1 Pokemon:", error);
    throw error;
  }
}
