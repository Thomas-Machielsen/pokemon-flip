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
            {artwork ? (
              <Image
                src={artwork}
                alt={`${name} artwork`}
                width={250}
                height={250}
                style={{ width: "auto", height: "auto" }}
                priority
              />
            ) : (
              <div className="placeholder">?</div>
            )}
            <h2>{name}</h2>
            <p>#{id}</p>
            <p>{type || "Unknown"}</p>
          </>
        ) : (
          <>
            <Image
              src={pokemusuImage}
              alt={`${name} pokemusu`}
              width={250}
              height={250}
              style={{ width: "auto", height: "auto" }}
              priority
            />
            <h2>Pokemusu {name}!</h2>
          </>
        )}
      </div>
    </button>
  );
}
