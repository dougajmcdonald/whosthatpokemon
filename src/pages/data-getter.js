import React from "react"
import Pokedex from "pokedex-promise-v2"
import { filterNameToValidPokemon } from "../data/filters"
import { svPokedexFinalEvolutions } from "../data/sv_pokemon"
import { raidPokemon6 } from "../data/raid_pokemon_6"

import Layout from "../components/layout"

const fsPromises = require("fs").promises

export default function DataGetter({ types }) {
  const superEffectiveDamageTypes = (type, teraType) => {
    // check the type against those which will supereffectively dmg the
    // tera type of the raid
    const filteredResult = teraType.damage_relations.double_damage_from
      .map(y => y.name)
      .includes(type.name)
    // console.log(
    //   "Tera type: ",
    //   teraType.name,
    //   "Does it take SE dmg from",
    //   type.name,
    //   filteredResult
    // );
    return filteredResult
  }

  const getAcceptableTypes = async type => {
    const acceptableCandidates = types
      .filter(t => superEffectiveDamageTypes(t, type))
      .filter(weakToStabTypes)
      .map(x =>
        x.pokemon.map(z => z.pokemon.name).filter(filterNameToValidPokemon)
      )
      .flat()

    //remove dupes
    const uniqueAcceptableCandidates = [...new Set(acceptableCandidates)]
    //console.log("names", uniqueAcceptableCandidates);

    // long wait
    if (uniqueAcceptableCandidates.length > 0) {
      const candidateData = await P.getPokemonByName(uniqueAcceptableCandidates)
      //console.log("data", candidateData);

      const validMons = candidateData.filter(x =>
        x.types
          .map(t => t.type.name)
          .every(x => !targetPokemon.types.map(t => t.type.name).includes(x))
      )
      //console.log(validMons);
      setRecommendedPokemon(validMons)
    }
  }

  const getMoveData = async name => await P.getMoveByName(name)

  return (
    <Layout title="Data getter">
      <h1 className="text-4xl mb-8 text-center">Data getter</h1>
      <p>
        This is an internal page which gets json from the pokeapi.co site and
        saves it to file
      </p>
    </Layout>
  )
}

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

  const { results } = await P.getTypesList()
  const typeData = await Promise.all(
    results
      .filter(type => type.name !== "unknown" && type.name !== "shadow")
      .map(async r => {
        const typeInfo = await P.getTypeByName(r.name)
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
  const options = {
    timeout: 30 * 1000, // 50s
  }
  const P = new Pokedex(options)

  const pokemon = await P.getPokemonByName(
    svPokedexFinalEvolutions.map(p => p.name)
  )

  const pm = pokemon.map(mapPokeApiToSomethingFuckingSane)

  return await appendMoveData(pm, "moves")
}

const appendMoveData = async (pokemon, movesProperty) => {
  const options = {
    timeout: 60 * 1000, // 50s
  }
  const P = new Pokedex(options)

  const pokemonWithMoves = []

  for (let index = 0; index < pokemon.length; index++) {
    const element = pokemon[index]
    console.log(index, ": getting data for ", element.name)
    const data = await P.getMoveByName(element[movesProperty])
    pokemonWithMoves.push({
      ...element,
      moveInfo: data.map(m => ({
        name: m.name,
        power: m.power,
        type: m.type.name,
        class: m.damage_class.name,
      })),
    })
    console.log(element.name, " done.")
  }

  // const ret = await Promise.all(
  //   pokemon.map(async x => {
  //     const data = await P.getMoveByName(x[movesProperty])
  //     //console.log("dataz", data)
  //     return {
  //       ...x,
  //       moveInfo: data.map(m => ({
  //         name: m.name,
  //         power: m.power,
  //         type: m.type.name,
  //         class: m.damage_class.name,
  //       })),
  //     }
  //   })
  // )

  //const awaited = Promise.all(ret)

  console.log("w00t", pokemonWithMoves[0])

  return pokemonWithMoves
}

const getraidPokemon6FromApi = async () => {
  const P = new Pokedex()

  const pokemon = await P.getPokemonByName(raidPokemon6.map(p => p.name))
  //console.log("raid pokemon results", pokemon[0]);
  const pm = pokemon.map(mapPokeApiToSomethingFuckingSane)
  const ret = await appendMoveData(pm, "raidMoves")
  return ret
}

const mapPokeApiToSomethingFuckingSane = pokemon => ({
  id: pokemon.id,
  name: pokemon.name,
  stats: mapPokemonStats(pokemon.stats),
  moves: scarletVioletMoves(pokemon.moves),
  raidMoves: raidPokemon6.find(p => p.name === pokemon.name)?.moves,
  types: pokemon.types.map(t => t.type.name),
  //abilities: pokemon.abilities,
})

export const getStaticProps = async () => {
  //get type data
  const typeJson = await getTypesFromApi()
  await saveJsonToFile(typeJson, "types.json")

  // get all pokemon data
  const allPokemonJson = await getAllPokemonFromApi()
  await saveJsonToFile(allPokemonJson, "all_pokemon.json")

  // get 6* raid pokemon data
  const sixStarraidPokemon6Json = await getraidPokemon6FromApi()
  await saveJsonToFile(sixStarraidPokemon6Json, "six_star_raid_pokemon.json")

  return {
    props: {},
  }
}
