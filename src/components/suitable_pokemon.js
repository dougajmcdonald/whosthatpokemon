import React from "react";
import Image from "next/image";

import svPokemon from "../../all_pokemon.json";

import HeadedCard from "./headed_card";

const pokemonImageUrl = (id) => {
  let paddedId;

  if (id.toString().length > 3) {
    paddedId = ("0" + id).slice(-4);
  } else {
    paddedId = ("00" + id).slice(-3);
  }

  return `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${paddedId}.png`;
};

const getSuitablePokemon = (moves, types) => {
  const data = moves.map((m) =>
    types
      .find((t) => t.name === m.type)
      ?.damage_relations.double_damage_to.map((ddt) => ddt.name)
  );

  const uniqueTypes = [...new Set(data.flat())];

  const suitable = svPokemon.filter(
    (p) => !p.types.some((t) => uniqueTypes.includes(t))
  );
  //console.log(suitable);
  return suitable.sort(sortNameDesc);
};

const sortNameDesc = (a, b) => {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
};

const SuitablePokemon = ({ pokemon, types }) => (
  <HeadedCard headerText="Who should you pick?">
    <section className="p-4">
      <p>Enemy is level 90, make sure your Pokemon is over level 90.</p>
      <ul className="grid grid-cols-3">
        {getSuitablePokemon(pokemon.moveInfo, types).map((p) => (
          <article
            key={p.id + p.name}
            className="flex justify-center items-center border border-gray-500 rounded-md py-2 m-2 w-auto"
          >
            <div>
              <Image
                src={pokemonImageUrl(p.id)}
                alt={p.name}
                width="64"
                height="64"
              />
            </div>
            <section>
              <p className="font-bold capitalize">{p.name}</p>
              <ul>
                {p.types.map((t) => (
                  <li key={p.id + t}>
                    <Image
                      src={`/img/${t}_banner.png`}
                      alt={t}
                      width="66"
                      height="16"
                    />
                  </li>
                ))}
              </ul>
            </section>
          </article>
        ))}
      </ul>
    </section>
  </HeadedCard>
);

export default SuitablePokemon;
