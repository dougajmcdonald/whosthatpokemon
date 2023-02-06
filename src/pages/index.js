import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Inter } from "@next/font/google";
import types from "../../types.json";
import raidPokemon from "../../six_star_raid_pokemon.json";

const inter = Inter({ subsets: ["latin"] });

import Layout from "../components/layout";
import { AutoComplete } from "../components/autocomplete";
import { Item, Section } from "../components/combobox";
import Button from "../components/button";

export default function Home({ types, raidPokemon }) {
  const [targetPokemon, setTargetPokemon] = React.useState();
  const [teraType, setTeraType] = React.useState();

  const handleSelectionChange = (id) => {
    console.log("name", id);
    const p = raidPokemon.find((x) => x.id === id);
    console.log(p);
    setTargetPokemon(p);
  };

  const handleClick = (type) => {
    setTeraType(type);
  };

  return (
    <Layout title="Who's that Pokemon">
      <h1 className="text-4xl mb-8 text-center">Who&apos;s that Pokemon</h1>
      <section className="p-4 rounded-md mb-4">
        <AutoComplete
          label="Which Pokemon is the raid for?"
          defaultItems={raidPokemon}
          onSelectionChange={handleSelectionChange}
        >
          {(item) => <Item>{item.name}</Item>}
        </AutoComplete>
      </section>
      {targetPokemon && (
        <section>
          <ul className="grid grid-cols-6">
            {types.map((type) => {
              return (
                <li key={type.name} className="inline-block">
                  <Button onPress={() => handleClick(type)}>
                    <Image
                      src={`/img/${type.name}_type.png`}
                      alt={type.name}
                      width="48"
                      height="48"
                    />
                  </Button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {targetPokemon && teraType && (
        <section className="bg-slate-800 rounded-md mt-6">
          <header className="bg-yellow-300 text-slate-800 font-bold py-2 pl-3 capitalize rounded-t-md">
            {targetPokemon.name}
          </header>
          <section>
            {targetPokemon.types.map((t) => (
              <Image
                key={"type_banner_" + t}
                src={`/img/${t}_type_banner.png`}
                alt={t}
                width="100"
                height="24"
                className="inline-block"
              />
            ))}
          </section>
        </section>
      )}
    </Layout>
  );
}

export const getStaticProps = async () => {
  return {
    props: { types: types, raidPokemon: raidPokemon },
  };
};
