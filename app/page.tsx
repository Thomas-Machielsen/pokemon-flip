import { CardGrid } from "./features/CardGrid";
import { fetchAggregatedPokemon } from "./services/pokemonAggregator";

export default async function Home() {
  const pokemon = await fetchAggregatedPokemon();

  return (
    <main className="content-grid">
      <h1 className="content u-text-centered">Gen 1 Pokemon</h1>
      <CardGrid cards={pokemon} />
    </main>
  );
}
