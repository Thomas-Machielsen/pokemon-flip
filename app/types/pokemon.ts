export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonSprites {
  front_default: string;
  back_default: string;
  front_shiny: string;
  back_shiny: string;
  other: {
    "official-artwork": {
      front_default: string;
      front_shiny: string;
    };
  };
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface Pokemon {
  id: number;
  name: string;
  types: PokemonType[];
  sprites: PokemonSprites;
  stats: PokemonStat[];
}

export interface PokemonCardData {
  id: number;
  name: string;
  type: string;
  artwork: string;
}
