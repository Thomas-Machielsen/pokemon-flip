import Image from "next/image";
import "./Card.css";

interface CardProps {
  id: number;
  name: string;
  type: string;
  artwork: string;
}

export default function Card({ id, name, type, artwork }: CardProps) {
  return (
    <div className={`card ${type}`}>
      <Image
        src={artwork}
        alt={`${name} artwork`}
        width={250}
        height={250}
        priority
      />
      <h2>{name}</h2>
      <p>#{id}</p>
      <p>{type}</p>
    </div>
  );
}
