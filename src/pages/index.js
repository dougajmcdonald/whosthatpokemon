import React from "react"
import { Inter } from "@next/font/google"
import types from "../../types.json"
import raidPokemon from "../../six_star_raid_pokemon.json"

const inter = Inter({ subsets: ["latin"] })

import Layout from "../components/layout"
import { AutoComplete } from "../components/autocomplete"
import { Item, Section } from "../components/combobox"
import TeraTypeSelector from "../components/teratypeselector"
import PokemonAnalysis from "../components/pokemon_analysis"
import AttackAnalysis from "../components/attack_analysis"
import SuitablePokemon from "../components/suitable_pokemon"
import Link from "next/link"

export default function Home({ types, raidPokemon }) {
  const [targetPokemon, setTargetPokemon] = React.useState()
  const [teraType, setTeraType] = React.useState()

  const handleSelectionChange = id => {
    const p = raidPokemon.find(x => x.id === id)
    if (p) {
      const pokemonWithImage = {
        ...p,
        image: pokemonImageUrl(p.id),
      }
      setTargetPokemon(pokemonWithImage)
    }
  }

  function handleClick(type) {
    setTeraType(type)
  }

  // TODO: move this to data getter
  const pokemonImageUrl = id => {
    let paddedId

    if (id.toString().length > 3) {
      paddedId = ("0" + id).slice(-4)
    } else {
      paddedId = ("00" + id).slice(-3)
    }

    return `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${paddedId}.png`
  }

  return (
    <Layout title="Who's that Pokemon">
      <h1 className="text-4xl mb-8 text-center">Who&apos;s that Pokemon</h1>
      <section className="mb-4 text-sm text-slate-400 relative">
        <p className="inline-block">
          Who&apos;s that Pokemon helps your find the right pokemon for raids so
          you can spend your time battling, not reloading.
        </p>
        <p className="inline-block">
          (This is a Beta version that only lists 6* raid Pokemon, if you&apos;d
          like to see more)
        </p>
      </section>
      <section className="rounded-md mb-4 relative">
        <AutoComplete
          label="Which Pokemon are you fighting?"
          defaultItems={raidPokemon}
          onSelectionChange={handleSelectionChange}
        >
          {item => <Item className="capitalize">{item.name}</Item>}
        </AutoComplete>
      </section>
      {targetPokemon && (
        <TeraTypeSelector types={types} handleClick={handleClick} />
      )}

      {targetPokemon && teraType && (
        <div>
          <PokemonAnalysis pokemon={targetPokemon} teraType={teraType} />
          {/* <AttackAnalysis teraType={teraType} /> */}
          <SuitablePokemon
            pokemon={targetPokemon}
            types={types}
            teraType={teraType}
          />
        </div>
      )}
    </Layout>
  )
}

export const getStaticProps = async () => {
  return {
    props: { types: types, raidPokemon: raidPokemon },
  }
}
