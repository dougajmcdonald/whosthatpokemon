//const Pokedex = require("pokedex-promise-v2")
import Pokedex from "pokedex-promise-v2"
import { svPokedexFinalEvolutions } from "./src/data/sv_pokemon"
import { raidPokemon } from "./src/data/raid_pokemon"

const fsPromises = require("fs").promises

const saveJsonToFile = async (data, filename) => {
  console.log("save", filename)
  // save to file
  await fsPromises
    .writeFile(filename, JSON.stringify(data))
    .then(() => {
      console.log(`${filename} saved`)
    })
    .catch(er => {
      console.log(er)
    })
}

const mapPokemonStats = stats => {
  const mapped = stats.map(s => ({
    key: s.stat.name,
    base: s.base_stat,
  }))

  const statMap = mapped.map(s => ({ [s.key]: s.base }))

  return Object.assign({}, ...statMap)
}

const scarletVioletMoves = moves => {
  // TODO: This filter doesn't seem to work
  //console.log("moves", moves.length);
  const moveValidForScarletViolet = moves
    .filter(
      m =>
        m.version_group_details.filter(
          vgd => vgd.version_group.name === "scarlet-violet"
        ).length > 0
    )
    .map(m => m.move.name)

  //console.log("valid moves", moveValidForScarletViolet.length);

  return moveValidForScarletViolet
}

const getTypesFromApi = async () => {
  const P = new Pokedex()

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

  const { results } = await P.getTypesList()
  const typeData = await Promise.all(
    results
      .filter(type => type.name !== "unknown" && type.name !== "shadow")
      .map(async r => {
        //console.log(r);
        const typeInfo = await P.getTypeByName(r.name)
        //console.log(typeInfo.damage_relations);
        return {
          name: r.name,
          damage_relations: typeInfo.damage_relations,
          //pokemon: typeInfo.pokemon,
        }
      })
  )

  return typeData
}

const getAllPokemonFromApi = async () => {
  const P = new Pokedex()
  // console.log("all sv pokemon", svPokedexFinalEvolutions);
  const pokemon = await P.getPokemonByName(
    svPokedexFinalEvolutions.map(p => p.name)
  )
  //console.log("all pokemon results", pokemon[0].moves[0]);
  const pm = pokemon.map(mapPokeApiToSomethingFuckingSane)
  //console.log("mapped pokemon results", pm[0]);
  const ret = await appendMoveData(pm, "moves")
  console.log(ret[0])
  return ret
}

const moveDataPerPokemon = async moves => {
  const P = new Pokedex()

  //console.log("moves", moves);

  const mv = await P.getMoveByName(moves)

  //console.log("bleg", bleg);

  const moveData = mv.map(m => ({
    name: m.name,
    power: m.power,
    type: m.type.name,
    class: m.damage_class.name,
  }))

  console.log("mv", moveData)

  return moveData
}

const appendMoveData = async (pokemon, movesProperty) => {
  const ret = pokemon.map(async x => ({
    ...x,
    moveInfo: await moveDataPerPokemon(x[movesProperty]),
  }))

  const awaited = Promise.all(ret)

  console.log("w00t", awaited[0])

  return awaited
}

const getRaidPokemonFromApi = async () => {
  const P = new Pokedex()
  // console.log(
  //   "6* raid pokemon",
  //   raidPokemon.map((p) => p.name)
  // );

  // slower, but who cares it's a one off (ish)

  // const pokemon = raidPokemon.map(p => {
  //   pokemon: await P.getPokemonByName(p.name),
  //   move
  // })

  const pokemon = await P.getPokemonByName(raidPokemon.map(p => p.name))
  //console.log("raid pokemon results", pokemon[0]);
  const pm = pokemon.map(mapPokeApiToSomethingFuckingSane)
  const ret = await appendMoveData(pm, "raidMoves")
  // const ret = await Promise.all(
  //   pm.map(async (x) => ({
  //     ...x,
  //     moveInfo: await (
  //       await P.getMoveByName(x.raidMoves)
  //     ).map((m) => ({
  //       name: m.name,
  //       power: m.power,
  //       type: m.type.name,
  //       class: m.damage_class.name,
  //     })),
  //   }))
  // );
  console.log("this thing", ret[0])
  return ret
}

const mapPokeApiToSomethingFuckingSane = pokemon => ({
  id: pokemon.id,
  name: pokemon.name,
  stats: mapPokemonStats(pokemon.stats),
  moves: scarletVioletMoves(pokemon.moves),
  raidMoves: raidPokemon.find(p => p.name === pokemon.name)?.moves,
  types: pokemon.types.map(t => t.type.name),
  //abilities: pokemon.abilities,
})

async function main() {
  //get type data
  const typeJson = await getTypesFromApi()
  await saveJsonToFile(typeJson, "types.json")

  // get all pokemon data
  const allPokemonJson = await getAllPokemonFromApi()
  await saveJsonToFile(allPokemonJson, "all_pokemon.json")

  // get 6* raid pokemon data
  // const sixStarRaidPokemonJson = await getRaidPokemonFromApi();
  // await saveJsonToFile(sixStarRaidPokemonJson, "six_star_raid_pokemon.json");
}

// // somefile.js
// import blah from "some module"
// import fs from "fs"

// const getSomitFroAPI = async () => {
//   const data = await blah.getThings()
//   return data
// }

// const writeToFile = (stuff) => {
//   fs.writeFile(stuff)
// }

// const doIt async () {
//   await(writeFile(getSomitFroAPI()))
// }

// module.export = doIt

// // package.json
// scripts: {
//   "makeMeHappy": "node somefle.js doIt()"
// }

module.exports = main
