import Image from "next/image";
import Link from "next/link";
import { Inter } from "@next/font/google";
import Pokedex from "pokedex-promise-v2";
import React from "react";
import { filterNameToValidPokemon } from "../data/filters";

const inter = Inter({ subsets: ["latin"] });

import Layout from "../components/layout";

export default function TeraRaid({ types }) {
  const [teraType, setTeraType] = React.useState();

  const handleClick = (type) => {
    setTeraType(type);
  };

  //console.log(types[0]);

  return (
    <Layout title="Tera raid helper">
      <h1 className="text-4xl mb-8 text-center">Tera raid helper</h1>
      <section className="p-4 rounded-md bg-slate-200">
        <p className="font-bold">
          What tera type is the Pokemon you&apos;re attacking?
        </p>
        <ul className="grid grid-cols-6">
          {types.map((type) => {
            return (
              <li key={type.name} className="inline-block">
                <button
                  className="p-2 border rounded-md m-2 hover:bg-slate-300"
                  onClick={() => handleClick(type)}
                >
                  <Image
                    src={`/img/${type.name}_tera.png`}
                    alt={type.name}
                    width="48"
                    height="48"
                  />
                  {type.name}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {teraType && (
        <div>
          <section>
            <p>Your attacking {teraType.name}</p>
            <section className="bg-green-200">
              <p>{teraType.name} takes double damage from</p>
              <ul>
                {teraType.damage_relations.double_damage_from.map((x) => (
                  <li key={x.name}>{x.name}</li>
                ))}
              </ul>
            </section>
            <section className="bg-red-200">
              <p>{teraType.name} takes half damage from</p>
              <ul>
                {teraType.damage_relations.half_damage_from.map((x) => (
                  <li key={x.name}>{x.name}</li>
                ))}
              </ul>
            </section>
            <section className="bg-red-500">
              <p>{teraType.name} takes no damage from</p>
              <ul>
                {teraType.damage_relations.no_damage_from.map((x) => (
                  <li key={x.name}>{x.name}</li>
                ))}
              </ul>
            </section>
          </section>
          <section>
            <p>Recommended pokemon</p>
            <ul>
              {types
                .filter((x) =>
                  teraType.damage_relations.double_damage_from
                    .map((y) => y.name)
                    .includes(x.name)
                )
                .map((z) =>
                  z.pokemon
                    .map((x) => x.pokemon.name)
                    .filter(filterNameToValidPokemon)
                    .map((name) => <li key={name}>{name}</li>)
                )}
            </ul>
          </section>
        </div>
      )}
      <hr />
    </Layout>
  );
}

export const getStaticProps = async () => {
  const P = new Pokedex();

  const { results } = await P.getTypesList();
  const typeData = await Promise.all(
    results
      .filter((type) => type.name !== "unknown" && type.name !== "shadow")
      .map(async (r) => {
        //console.log(r);
        const typeInfo = await P.getTypeByName(r.name);
        //console.log(typeInfo.damage_relations);
        return {
          name: r.name,
          damage_relations: typeInfo.damage_relations,
          pokemon: typeInfo.pokemon,
        };
      })
  );

  //console.log(typeData);
  return {
    props: { types: typeData },
  };
};
