import { AggregatedPokemon } from "@/app/services/pokemonAggregator";
import { Card } from "../Card";
import "./CardGrid.css";

interface CardGridProps {
  cards: AggregatedPokemon[];
}

export default function CardGrid({ cards }: CardGridProps) {
  return (
    <div className="card-grid">
      {cards.map((card) => (
        <Card
          key={card.id}
          id={card.id}
          name={card.name}
          type={card.type}
          artwork={card.artwork}
          tcgHp={card.tcgHp}
        />
      ))}
    </div>
  );
}
