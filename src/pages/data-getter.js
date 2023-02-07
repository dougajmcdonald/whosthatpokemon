import React from "react";
import Pokedex from "pokedex-promise-v2";
import { filterNameToValidPokemon } from "../data/filters";
import { svPokedexFinalEvolutions } from "../data/sv_pokemon";
import { raidPokemon } from "../data/raid_pokemon";

import Layout from "../components/layout";

const fsPromises = require("fs").promises;

export default function DataGetter({ types }) {
  const P = new Pokedex();

  const superEffectiveDamageTypes = (type, teraType) => {
    // check the type against those which will supereffectively dmg the
    // tera type of the raid
    const filteredResult = teraType.damage_relations.double_damage_from
      .map((y) => y.name)
      .includes(type.name);
    // console.log(
    //   "Tera type: ",
    //   teraType.name,
    //   "Does it take SE dmg from",
    //   type.name,
    //   filteredResult
    // );
    return filteredResult;
  };

  const weakToStabTypes = (type) => {
    // check the type against the selected pokemon stab types
    // we can assume it has access to moves of this type and they will hurt most!

    const filterResult = !type.damage_relations.double_damage_from
      .map((x) => x.name)
      .some((x) => targetPokemon.types.map((t) => t.type.name).includes(x));
    // console.log(
    //   "input type",
    //   type,
    //   "types to exclude",
    //   targetPokemon.types.map((t) => t.type.name),
    //   filterResult
    // );
    return filterResult;
  };

  const getAcceptableTypes = async (type) => {
    const acceptableCandidates = types
      .filter((t) => superEffectiveDamageTypes(t, type))
      .filter(weakToStabTypes)
      .map((x) =>
        x.pokemon.map((z) => z.pokemon.name).filter(filterNameToValidPokemon)
      )
      .flat();

    //remove dupes
    const uniqueAcceptableCandidates = [...new Set(acceptableCandidates)];
    //console.log("names", uniqueAcceptableCandidates);

    // long wait
    if (uniqueAcceptableCandidates.length > 0) {
      const candidateData = await P.getPokemonByName(
        uniqueAcceptableCandidates
      );
      //console.log("data", candidateData);

      const validMons = candidateData.filter((x) =>
        x.types
          .map((t) => t.type.name)
          .every(
            (x) => !targetPokemon.types.map((t) => t.type.name).includes(x)
          )
      );
      //console.log(validMons);
      setRecommendedPokemon(validMons);
    }
  };

  // const physicalSpecialAnalysis = (pokemon) => {
  //   const stats = pokemon.stats.map((s) => ({
  //     key: s.stat.name,
  //     base: s.base_stat,
  //   }));

  //   const statMap = stats.map((s) => ({ [s.key]: s.base }));

  //   const statObj = Object.assign({}, ...statMap);

  //   const statAnalysis = {
  //     strongestAttackStat:
  //       statObj.attack > statObj["special-attack"] ? "physical" : "special",
  //     weakestDefenseStat:
  //       statObj.defense < statObj["special-defense"] ? "physical" : "special",
  //     ...statObj,
  //   };

  //   //console.log(statAnalysis);
  //   setStatAnalysis(statAnalysis);
  // };

  // const handleSelectionChange = async (pokemonName) => {
  //   setMoveTypeAccess(null);
  //   setTargetPokemon(null);
  //   if (pokemonName) {
  //     const selectedPokemon = await P.getPokemonByName(pokemonName);
  //     //console.log("SelectedPokemon", selectedPokemon);

  //     const pokemonWithImage = {
  //       ...selectedPokemon,
  //       image: pokemonImageUrl(selectedPokemon.id),
  //     };

  //     setTargetPokemon(pokemonWithImage);

  //     physicalSpecialAnalysis(pokemonWithImage);

  //     //moves
  //     //console.log("valid moves", getSVMoves(selectedPokemon.moves));
  //     const validMoves = getSVMoves(selectedPokemon.moves);

  //     const moveData = await P.getMoveByName(validMoves.map((m) => m.name));

  //     const damagingMoves = moveData.filter(
  //       (m) => m.damage_class.name !== "status"
  //     );

  //     setValidMoves(damagingMoves);

  //     const moveTypes = damagingMoves
  //       .map((m) => m.type.name)
  //       .filter((item, index, arr) => arr.indexOf(item) === index);

  //     // const groupMoveByType = damagingMoves.reduce((group, move) => {
  //     //   const {
  //     //     type: { name },
  //     //   } = move;
  //     //   group[name] = group[name] ?? [];
  //     //   group[name].push(move);
  //     //   return group;
  //     // }, {});

  //     //console.log(groupMoveByType);

  //     setMoveTypeAccess(moveTypes);
  //     //console.log(moveTypes);

  //     //console.log(damagingMoves);
  //   }
  // };

  // const pokemonImageUrl = (id) => {
  //   let paddedId;

  //   if (id.toString().length > 3) {
  //     paddedId = ("0" + id).slice(-4);
  //   } else {
  //     paddedId = ("00" + id).slice(-3);
  //   }

  //   return `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${paddedId}.png`;
  // };

  //const getMoveData = async (name) => await P.getMoveByName(name);

  return (
    <Layout title="Data getter">
      <h1 className="text-4xl mb-8 text-center">Data getter</h1>
      <p>
        This is an internal page which gets json from the pokeapi.co site and
        saves it to file
      </p>
    </Layout>
  );
}

const saveJsonToFile = async (data, filename) => {
  console.log("save", filename);
  // save to file
  await fsPromises
    .writeFile(filename, JSON.stringify(data))
    .then(() => {
      console.log(`${filename} saved`);
    })
    .catch((er) => {
      console.log(er);
    });
};

const mapPokemonStats = (stats) => {
  const mapped = stats.map((s) => ({
    key: s.stat.name,
    base: s.base_stat,
  }));

  const statMap = mapped.map((s) => ({ [s.key]: s.base }));

  return Object.assign({}, ...statMap);
};

const scarletVioletMoves = (moves) => {
  // TODO: This filter doesn't seem to work
  //console.log("moves", moves.length);
  const moveValidForScarletViolet = moves
    .filter(
      (m) =>
        m.version_group_details.filter(
          (vgd) => vgd.version_group.name === "scarlet-violet"
        ).length > 0
    )
    .map((m) => m.move.name);

  //console.log("valid moves", moveValidForScarletViolet.length);

  return {
    moves: moveValidForScarletViolet,
  };
};

const getTypesFromApi = async () => {
  const P = new Pokedex();

  // const { results: typeList } = await P.getTypesList();

  // console.log("typeList", typeList);

  // console.log(
  //   "list input",
  //   typeList
  //     .filter((type) => type.name !== "unknown" && type.name !== "shadow")
  //     .map((t) => t.name)
  // );
  // // get the valid types
  // const typenameArray = typeList
  //   .filter((type) => type.name !== "unknown" && type.name !== "shadow")
  //   .map((t) => t.name);

  // const { results } = await P.getTypeByName(typenameArray);

  // console.log(results);

  // const formattedTypeData = results.map((type) => {
  //   type.name, type.damage_relations;
  // });

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
          //pokemon: typeInfo.pokemon,
        };
      })
  );

  return typeData;
};

const getAllPokemonFromApi = async () => {
  const P = new Pokedex();
  // console.log("all sv pokemon", svPokedexFinalEvolutions);
  const pokemon = await P.getPokemonByName(
    svPokedexFinalEvolutions.map((p) => p.name)
  );
  // console.log("all pokemon results", pokemon);
  return pokemon.map(mapPokeApiToSomethingFuckingSane);
};

const getRaidPokemonFromApi = async () => {
  const P = new Pokedex();
  // console.log(
  //   "6* raid pokemon",
  //   raidPokemon.map((p) => p.name)
  // );
  const pokemon = await P.getPokemonByName(raidPokemon.map((p) => p.name));
  console.log("raid pokemon results", pokemon[0]);
  const pm = pokemon.map(mapPokeApiToSomethingFuckingSane);
  const ret = pm.forEach(async (x) => await P.getMoveByName(x.raidMoves));
};

const mapPokeApiToSomethingFuckingSane = (pokemon) => ({
  id: pokemon.id,
  name: pokemon.name,
  stats: mapPokemonStats(pokemon.stats),
  raidMoves: raidPokemon.find((p) => p.name === pokemon.name)?.moves,
  types: pokemon.types.map((t) => t.type.name),
  //abilities: pokemon.abilities,
});

export const getStaticProps = async () => {
  // get type data
  const typeJson = await getTypesFromApi();
  await saveJsonToFile(typeJson, "types.json");

  // get all pokemon data
  const allPokemonJson = await getAllPokemonFromApi();
  await saveJsonToFile(allPokemonJson, "all_pokemon.json");

  // get 6* raid pokemon data
  const sixStarRaidPokemonJson = await getRaidPokemonFromApi();
  await saveJsonToFile(sixStarRaidPokemonJson, "six_star_raid_pokemon.json");

  return {
    props: {},
  };
};
