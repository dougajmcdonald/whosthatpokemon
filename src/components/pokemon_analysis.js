import React from "react";
import Image from "next/image";
import StatListItem from "../components/statlistitem";
import HeadedCard from "./headed_card";

export default ({ pokemon, teraType }) => (
  <HeadedCard headerText={pokemon.name}>
    <section className="p-4">
      <section className="flex flex-row justify-center items-center gap-4">
        <div>
          <Image
            src={pokemon.image}
            alt={pokemon.name}
            width="64"
            height="64"
          />
        </div>
        <div>
          <Image
            src={`/img/${teraType.name}_type.png`}
            alt={teraType.name}
            width="48"
            height="48"
          />
        </div>
        <ul>
          {pokemon.types.map((t) => (
            <li key={t}>
              <Image
                key={"type_banner_" + t}
                src={`/img/${t}_banner.png`}
                alt={t}
                width="100"
                height="24"
                className="inline-block"
              />
            </li>
          ))}
        </ul>
      </section>
      <ul className="pt-4 flex flex-col items-center">
        <StatListItem label="HP" value={pokemon.stats.hp} />
        <StatListItem label="Speed" value={pokemon.stats.speed} />
        <StatListItem label="Defence" value={pokemon.stats.defense} />
        <StatListItem
          label="Special Defence"
          value={pokemon.stats["special-defense"]}
        />
        <StatListItem label="Attack" value={pokemon.stats.attack} />
        <StatListItem
          label="Special Attack"
          value={pokemon.stats["special-attack"]}
        />
      </ul>
    </section>
  </HeadedCard>
);
