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
  const [statAnalysis, setStatAnalysis] = React.useState();

  const handleClick = (type) => {
    setTeraType(type);
  };

  const physicalSpecialAnalysis = (pokemon) => {
    const stats = pokemon.stats.map((s) => ({
      key: s.stat.name,
      base: s.base_stat,
    }));

    //console.log(stats);

    const statMap = stats.map((s) => ({ [s.key]: s.base }));

    const statObj = Object.assign({}, ...statMap);

    //console.log(statObj);

    const statAnalysis = {
      strongestAttackStat:
        statObj.attack > statObj["special-attack"] ? "physical" : "special",
      strongestDefenseStat:
        statObj.defense > statObj["special-defense"] ? "physical" : "special",
      ...statObj,
    };

    console.log(statAnalysis);
    setStatAnalysis(statAnalysis);
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

      physicalSpecialAnalysis(pokemonWithImage);

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

      const groupMoveByType = damagingMoves.reduce((group, move) => {
        const {
          type: { name },
        } = move;
        group[name] = group[name] ?? [];
        group[name].push(move);
        return group;
      }, {});

      console.log(groupMoveByType);

      setMoveTypeAccess(moveTypes);

      console.log(damagingMoves);
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

  //const getMoveData = async (name) => await P.getMoveByName(name);

  const getSVMoves = (moves) =>
    moves
      .filter(
        (m) =>
          m.version_group_details.filter(
            (vgd) => vgd.version_group.name === "scarlet-violet"
          ).length > 0
      )
      .map((m) => m.move);

  const handleReset = (e) => {
    setTargetPokemon(null);
    setTeraType(null);
  };

  return (
    <Layout title="Tera raid helper">
      <h1 className="text-4xl mb-8 text-center">Tera raid helper</h1>
      <section className="p-4 rounded-md bg-slate-200 mb-4">
        <AutoComplete
          label="Which Pokemon is the raid for?"
          defaultItems={svPokedex}
          onSelectionChange={handleSelectionChange}
        >
          {(item) => <Item>{item.name}</Item>}
        </AutoComplete>
      </section>
      {targetPokemon && (
        <section className="p-4 rounded-md bg-slate-200">
          <p className="font-bold mb-2">
            What tera type is the Pokemon you&apos;re attacking?
          </p>
          <ul className="grid grid-cols-6">
            {types.map((type) => {
              return (
                <li key={type.name} className="inline-block">
                  <Button onPress={() => handleClick(type)}>
                    <Image
                      src={`/img/${type.name}_tera.png`}
                      alt={type.name}
                      width="48"
                      height="48"
                    />
                    <span className="text-sm">{type.name}</span>
                  </Button>
                </li>
              );
            })}
          </ul>
        </section>
      )}
      {teraType && targetPokemon && (
        <section className="bg-slate-200 p-4 mt-4 rounded-md flex flex-col gap-2">
          <p className="font-bold w-full text-center">
            You&apos;re attacking {teraType.name} {targetPokemon.name}
          </p>
          <div className="flex flex-row justify-center items-center">
            <Image
              src={`/img/${teraType.name}_tera.png`}
              alt={teraType.name}
              width="60"
              height="60"
            />
            <Image
              src={targetPokemon.image}
              alt={targetPokemon.name}
              width="96"
              height="96"
            />
          </div>
          <Button
            className="bg-blue-600 text-white font-bold hover:bg-blue-200"
            onClick={handleReset}
          >
            Reset
          </Button>
        </section>
      )}
      {teraType && targetPokemon && (
        <div>
          <section className="bg-slate-200 mt-4 p-4 rounded-md">
            <div className="">
              <p className="font-bold mb-4">
                Make sure you do supereffective damage against the tera type
              </p>
            </div>
            <section className="grid grid-cols-3">
              <section className="bg-white p-2 mr-2 rounded-md">
                <h2 className="font-bold">Super-effective</h2>
                <p className="text-sm mb-4">Attacks do double damage</p>
                <ul>
                  {teraType.damage_relations.double_damage_from.map((x) => (
                    <li key={x.name} className="pb-1">
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
              <section className="bg-white mr-2 p-2 rounded-md">
                <h2 className="font-bold">Not effective</h2>
                <p className="text-sm mb-4">Attacks do half damage</p>
                <ul>
                  {teraType.damage_relations.half_damage_from.map((x) => (
                    <li key={x.name} className="pb-1">
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
              {
                <section className="bg-white p-2 rounded-md">
                  <h2 className="font-bold">Immune</h2>
                  <p className="text-sm mb-4">Attacks do no damage</p>
                  <ul>
                    {teraType.damage_relations.no_damage_from.length > 0 ? (
                      teraType.damage_relations.no_damage_from.map((x) => (
                        <li key={x.name} className="pb-1">
                          <Image
                            src={`/img/${x.name}_type_banner.png`}
                            alt={x.name}
                            width="100"
                            height="24"
                          />
                        </li>
                      ))
                    ) : (
                      <p className="text-sm">Nothing</p>
                    )}
                  </ul>
                </section>
              }
            </section>
            <p className="text-sm mt-4">
              When attacking a tera raid, the Pokemon will ONLY have the
              weaknesses of it&apos;s Tera type not the Pokemon&apos;s original
              type(s).
            </p>
          </section>
          {targetPokemon && (
            <section className="bg-slate-200 p-4 mt-4 rounded-md">
              <p className="font-bold mb-4">Pokemon evaluator</p>
              <section className="flex">
                <div>
                  <Image
                    src={targetPokemon.image}
                    alt={targetPokemon.name}
                    width="128"
                    height="128"
                  />
                </div>
                <div>
                  <ul className="text-sm">
                    <li key="types" className="inline-block">
                      {targetPokemon.types.map((t) => (
                        <Image
                          key={"type_banner_" + t.type.name}
                          src={`/img/${t.type.name}_type_banner.png`}
                          alt={t.type.name}
                          width="100"
                          height="24"
                          className="inline-block"
                        />
                      ))}
                    </li>
                    <li key="hp">
                      HP:
                      <span className="h-8">{statAnalysis.hp}</span>
                    </li>
                    <p className="font-bold">Attack</p>
                    <li key="attack">
                      Attack:
                      <span className="h-8">{statAnalysis.attack}</span>
                    </li>
                    <li key="special-attack">
                      Special Attack:
                      <span className="h-8">
                        {statAnalysis["special-attack"]}
                      </span>
                    </li>
                    <p className="font-bold">Defense</p>
                    <li key="attack">
                      Defense:
                      <span className="h-8">{statAnalysis.defense}</span>
                    </li>
                    <li key="special-attack">
                      Special Defense:
                      <span className="h-8">
                        {statAnalysis["special-defense"]}
                      </span>
                    </li>
                  </ul>
                </div>
              </section>
              <section>
                <p className="font-bold my-4">
                  Make sure you aren&apos;t weak to the Pokemon&apos;s available
                  attacks.
                </p>
                {/* <article className="bg-white rounded-md flex flex-col items-center p-2 mr-4">
                  <p>Will STAB with</p>
                  <ul></ul>
                </article> */}
                <article className="bg-white rounded-md flex flex-col items-center p-2">
                  <p>Has access to:</p>
                  <ul>
                    {moveTypeAccess.map((type) => (
                      <li key={type}>
                        <Image
                          src={`/img/${type}_type_banner.png`}
                          alt={type}
                          width="100"
                          height="24"
                        />
                        <ul>
                          {validMoves
                            .filter((m) => m.type.name === type)
                            .map((m) => (
                              <li className="text-sm" key={m.name}>
                                {m.name}
                              </li>
                            ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </article>
              </section>
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
