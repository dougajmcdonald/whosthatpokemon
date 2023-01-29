import Image from "next/image";
import Link from "next/link";
import { Inter } from "@next/font/google";
import Pokedex from "pokedex-promise-v2";
import { scarletVioletPokedex } from "../data/sv_pokemon";

const inter = Inter({ subsets: ["latin"] });

import Layout from "../components/layout";
import { version } from "react";

export default function Home({ pokemon }) {
  return (
    <Layout title="Who's that Pokemon">
      <h1 className="text-4xl mb-8 text-center">Who&apos;s that Pokemon</h1>
      <ul>
        {pokemon.map((mon) => {
          return (
            <li key={mon.id}>
              <Link href={`/pokemon/${mon.id}`}>
                <div className="border p-4 border-grey my-2 flex items-center text-lg bg-gray-200 rounded-md">
                  <section className="w-20 h-20 mr-3 relative">
                    <Image src={mon.image} alt={mon.name} fill="true" />
                  </section>
                  <span className="mr-2 font-bold">{mon.id}.</span>
                  {mon.name}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </Layout>
  );
}

export const getStaticProps = async () => {
  const P = new Pokedex();

  const pokemonList = await P.getPokemonByName(scarletVioletPokedex);

  // console.log(data);

  //const f = async () => {
  //const response = await P.getPokemonByName("sprigatito");
  //const data = response.json();

  //console.log(response);
  //};
  //f();

  //const pbn = async () => {
  // scarletVioletPokedex.forEach(async (name) => {
  //   const result = await P.getPokemonByName(name);
  //   console.log(result);
  //   //pokemonData.push(result);
  // });
  //};

  //const newSVPokemonMin = 906;
  //const newSVPokemonMax = 1008;

  //const res = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=1008");
  //const { results } = await res.json();
  //const svPokemon = results.map((p) => p.name);
  //console.log(svPokemon);

  // results.forEach(async (pokemon, i) => {
  // let url = pokemon.url;
  //console.log(url);
  // const pokemonData = await fetch(
  //   "https://pokeapi.co/api/v2/pokemon/sprigatito"
  // );
  // const kk = await pokemonData.json();
  //console.log(kk);
  //console.log(kk.game_indices.map((gi) => gi.version.url));
  //if (
  //kk.game_indices.filter(
  //(g) => g.version.url === "https://pokeapi.co/api/v2/version/41/"
  //);
  //)//{
  //  svPokemon.push(pokemonData);
  //}
  //});

  const pokemon = pokemonList.map((pokemon) => {
    //console.log(pokemon);

    let paddedId;

    if (pokemon.id.toString().length > 3) {
      paddedId = ("0" + pokemon.id).slice(-4);
    } else {
      paddedId = ("00" + pokemon.id).slice(-3);
    }

    //const
    const image = `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${paddedId}.png`;
    return { ...pokemon, image };
  });
  return {
    props: { pokemon },
  };
};
