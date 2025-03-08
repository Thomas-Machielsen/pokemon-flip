import { getGen1Pokemon } from "./actions/pokemon";
import { CardGrid } from "./features/CardGrid";

export default async function Home() {
  const pokemon = await getGen1Pokemon();

  return (
    <main className="content-grid">
      <h1 className="content u-text-centered">Gen 1 Pokemon</h1>
      <CardGrid cards={pokemon} />
    </main>
  );
}
