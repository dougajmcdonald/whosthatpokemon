import React from "react";
import Image from "next/image";
import { Inter } from "@next/font/google";
import Pokedex from "pokedex-promise-v2";
import { filterNameToValidPokemon } from "../data/filters";
import { svPokedex } from "../data/sv_pokemon";

const inter = Inter({ subsets: ["latin"] });

import Layout from "../components/layout";
import Button from "../components/button";
import { AutoComplete } from "../components/autocomplete";
import { Item, Section } from "../components/combobox";

export default function TeraRaid({ types }) {
  const P = new Pokedex();

  const [teraType, setTeraType] = React.useState();
  const [targetPokemon, setTargetPokemon] = React.useState();
  const [validMoves, setValidMoves] = React.useState();
  const [moveTypeAccess, setMoveTypeAccess] = React.useState();
  //const [targetPokemonImage, setTargetPokemon] = React.useState();

  const handleClick = (type) => {
    setTeraType(type);
  };

  const handleSelectionChange = async (pokemonName) => {
    if (pokemonName) {
      const selectedPokemon = await P.getPokemonByName(pokemonName);
      console.log("SelectedPokemon", selectedPokemon);

      const pokemonWithImage = {
        ...selectedPokemon,
        image: pokemonImageUrl(selectedPokemon.id),
      };

      setTargetPokemon(pokemonWithImage);

      //moves
      //console.log("valid moves", getSVMoves(selectedPokemon.moves));
      const validMoves = getSVMoves(selectedPokemon.moves);

      const moveData = await P.getMoveByName(validMoves.map((m) => m.name));

      const damagingMoves = moveData.filter(
        (m) => m.damage_class.name !== "status"
      );

      setValidMoves(damagingMoves);

      const moveTypes = damagingMoves
        .map((m) => m.type.name)
        .filter((item, index, arr) => arr.indexOf(item) === index);

      setMoveTypeAccess(moveTypes);
      //damagingMoves.map(m => m.type.name)

      // const moveData = await validMoves.forEach(
      //   async (m) => await getMoveData(m.name)
      // );
      //console.log(moveData);
      //console.log(damagingMoves);
      console.log(moveTypes);
    }
  };

  const pokemonImageUrl = (id) => {
    let paddedId;

    if (id.toString().length > 3) {
      paddedId = ("0" + id).slice(-4);
    } else {
      paddedId = ("00" + id).slice(-3);
    }

    return `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${paddedId}.png`;
  };

  const getMoveData = async (name) => await P.getMoveByName(name);

  const getSVMoves = (moves) =>
    moves
      .filter(
        (m) =>
          m.version_group_details.filter(
            (vgd) => vgd.version_group.name === "scarlet-violet"
          ).length > 0
      )
      .map((m) => m.move);

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
                <Button onClick={() => handleClick(type)}>
                  <Image
                    src={`/img/${type.name}_tera.png`}
                    alt={type.name}
                    width="48"
                    height="48"
                  />
                  {type.name}
                </Button>
              </li>
            );
          })}
        </ul>
        <p className="font-bold">Which Pokemon is it?</p>
        <AutoComplete
          label="Search"
          defaultItems={svPokedex}
          onSelectionChange={handleSelectionChange}
        >
          {(item) => <Item>{item.name}</Item>}

          {/* <Section title="Companies">
            <Item>Chatterbridge</Item>
            <Item>Tagchat</Item>
            <Item>Yambee</Item>
            <Item>Photobug</Item>
            <Item>Livepath</Item>
          </Section>
          <Section title="People">
            <Item>Theodor Dawber</Item>
            <Item>Dwight Stollenberg</Item>
            <Item>Maddalena Prettjohn</Item>
            <Item>Maureen Fassan</Item>
            <Item>Abbie Binyon</Item>
          </Section> */}
        </AutoComplete>
      </section>

      {teraType && (
        <div>
          <section className="bg-slate-200 p-4 mt-4 rounded-md">
            <div className="p-2">
              <Image
                src={`/img/${teraType.name}_tera.png`}
                alt={teraType.name}
                width="48"
                height="48"
                className="inline-block"
              />
              <p className="inline-block font-bold mb-8">
                You&apos;re attacking {teraType.name} {targetPokemon.name}
              </p>
              <p>
                When attacking a tera raid, the Pokemon will ONLY have the
                weaknesses of it&apos;s Tera type.
              </p>
              <p>
                This means you should choose ATTACKS which will hit for
                supereffective damage.
              </p>
            </div>
            <section className="flex">
              <section className="bg-white p-2 m-2 rounded-md">
                <h2 className="font-bold">Pick these</h2>
                <p>These attacks are supereffective</p>
                <ul>
                  {teraType.damage_relations.double_damage_from.map((x) => (
                    <li key={x.name} className="py-1">
                      <Image
                        src={`/img/${x.name}_type_banner.png`}
                        alt={x.name}
                        width="100"
                        height="24"
                      />
                    </li>
                  ))}
                </ul>
              </section>
              <section className="bg-white m-2 p-2 rounded-md">
                <h2 className="font-bold">Avoid these</h2>
                <p>These attacks are not very effective</p>
                <ul>
                  {teraType.damage_relations.half_damage_from.map((x) => (
                    <li key={x.name} className="py-1">
                      <Image
                        src={`/img/${x.name}_type_banner.png`}
                        alt={x.name}
                        width="100"
                        height="24"
                      />
                    </li>
                  ))}
                </ul>
              </section>
              {teraType.damage_relations.no_damage_from.length > 0 && (
                <section className="bg-white m-2 p-2 rounded-md">
                  <h2 className="font-bold">Avoid these</h2>
                  <p>The attacks do no damage</p>
                  <ul>
                    {teraType.damage_relations.no_damage_from.map((x) => (
                      <li key={x.name} className="py-1">
                        <Image
                          src={`/img/${x.name}_type_banner.png`}
                          alt={x.name}
                          width="100"
                          height="24"
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </section>
            <p className="text-sm font-bold p-4">
              If your Pokemon is the same type as the attack it will recieve the
              Same Type Attack Bonus (STAB) which will do more damage.
            </p>
          </section>
          {targetPokemon && (
            <section className="bg-slate-200 p-4 mt-4 rounded-md flex flex-row">
              <article className="bg-white rounded-md flex flex-col items-center p-2 mr-4">
                <Image
                  src={targetPokemon.image}
                  alt={targetPokemon.name}
                  width="128"
                  height="128"
                />
                <p>Will STAB with</p>
                <ul>
                  {targetPokemon.types.map((t) => (
                    <li key={t.type.name} className="py-1">
                      <Image
                        src={`/img/${t.type.name}_type_banner.png`}
                        alt={t.type.name}
                        width="100"
                        height="24"
                      />
                    </li>
                  ))}
                </ul>
              </article>
              <article className="bg-white rounded-md flex flex-col items-center p-2">
                <p>Has access to:</p>
                <ul>
                  {moveTypeAccess.map((type) => (
                    <li key={type}>
                      {" "}
                      <Image
                        src={`/img/${type}_type_banner.png`}
                        alt={type}
                        width="100"
                        height="24"
                      />
                    </li>
                  ))}
                </ul>
              </article>
            </section>
          )}
          <section>
            {/* <p>Recommended pokemon</p>
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
            </ul> */}
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
