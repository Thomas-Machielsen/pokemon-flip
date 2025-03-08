import { Card } from "../Card";
import "./CardGrid.css";

interface CardGridProps {
  cards: Array<{
    id: number;
    name: string;
    type: string;
    artwork: string;
  }>;
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
        />
      ))}
    </div>
  );
}
