import React from "react";
import { Inter } from "@next/font/google";
import types from "../../types.json";
import raidPokemon from "../../six_star_raid_pokemon.json";

const inter = Inter({ subsets: ["latin"] });

import Layout from "../components/layout";
import { AutoComplete } from "../components/autocomplete";
import { Item, Section } from "../components/combobox";
import TeraTypeSelector from "../components/teratypeselector";
import PokemonAnalysis from "../components/pokemon_analysis";
import AttackAnalysis from "../components/attack_analysis";
import SuitablePokemon from "../components/suitable_pokemon";

export default function Home({ types, raidPokemon }) {
  const [targetPokemon, setTargetPokemon] = React.useState();
  const [teraType, setTeraType] = React.useState();

  const handleSelectionChange = (id) => {
    console.log("name", id);
    const p = raidPokemon.find((x) => x.id === id);
    if (p) {
      const pokemonWithImage = {
        ...p,
        image: pokemonImageUrl(p.id),
      };
      console.log(pokemonWithImage);
      setTargetPokemon(pokemonWithImage);
    }
  };

  function handleClick(type) {
    setTeraType(type);
  }

  // TODO: move this to data getter
  const pokemonImageUrl = (id) => {
    let paddedId;

    if (id.toString().length > 3) {
      paddedId = ("0" + id).slice(-4);
    } else {
      paddedId = ("00" + id).slice(-3);
    }

    return `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${paddedId}.png`;
  };

  return (
    <Layout title="Who's that Pokemon">
      <h1 className="text-4xl mb-8 text-center">Who&apos;s that Pokemon</h1>
      <section className="rounded-md mb-4">
        <AutoComplete
          label="Which Pokemon is the raid for?"
          defaultItems={raidPokemon}
          onSelectionChange={handleSelectionChange}
        >
          {(item) => <Item className="capitalize">{item.name}</Item>}
        </AutoComplete>
      </section>
      {targetPokemon && (
        <TeraTypeSelector types={types} handleClick={handleClick} />
      )}

      {targetPokemon && teraType && (
        <div>
          <PokemonAnalysis pokemon={targetPokemon} teraType={teraType} />
          <AttackAnalysis teraType={teraType} />
          <SuitablePokemon pokemon={targetPokemon} />
        </div>
      )}
    </Layout>
  );
}

export const getStaticProps = async () => {
  return {
    props: { types: types, raidPokemon: raidPokemon },
  };
};
