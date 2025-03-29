"use client";

import Image from "next/image";
import { useState } from "react";
import "./Card.css";

interface CardProps {
  id: number;
  name: string;
  type?: string;
  artwork?: string;
}

export default function Card({ id, name, type, artwork }: CardProps) {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const pokemusuImage = `/images/${name}.png`;

  return (
    <button className={`card ${type || "unknown"}`} onClick={handleFlip}>
      <div className={`card__face ${flipped ? "flipped" : ""}`}>
        {!flipped ? (
          <>
            <div className="card__header">
              <h2 className="card__title">{name}</h2>
              <span className="card__hp">40 HP</span>
            </div>
            <div className="card__image-container">
              {artwork ? (
                <Image
                  src={artwork}
                  alt={`${name} artwork`}
                  fill
                  className="card__image"
                  priority
                />
              ) : (
                <div className="placeholder">?</div>
              )}
            </div>
            <p className="card__caption">
              #{id} {type || "Unknown"} Pokémon
            </p>
            <div className="card__abilities">
              <p>Abilities coming soon...</p>
            </div>
          </>
        ) : (
          <>
            <div className="card__image-container">
              <Image
                src={pokemusuImage}
                alt={`${name} pokemusu`}
                fill
                className="card__image"
                priority
              />
            </div>
            <p className="card__caption">Pokemusu {name}</p>
          </>
        )}
      </div>
    </button>
  );
}
