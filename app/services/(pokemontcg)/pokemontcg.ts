const API_KEY = process.env.POKEMON_TCG_API_KEY;
const BASE_URL = "https://api.pokemontcg.io/v2";

interface PokemonTCGCard {
  id: string;
  name: string;
  supertype: string;
  subtypes: string[];
  hp: string;
  types: string[];
  images: {
    small: string;
    large: string;
  };
  set: {
    id: string;
    name: string;
    series: string;
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
