import React from "react"
import Select from "react-select"
import { Inter } from "@next/font/google"
import types from "../../types.json"
import raidPokemon from "../../six_star_raid_pokemon.json"

const inter = Inter({ subsets: ["latin"] })

import Layout from "../components/layout"
import TeraTypeSelector from "../components/teratypeselector"
import PokemonAnalysis from "../components/pokemon_analysis"
import AttackAnalysis from "../components/attack_analysis"
import SuitablePokemon from "../components/suitable_pokemon"
import Link from "next/link"

export default function Home({ types, raidPokemon }) {
  const [targetPokemon, setTargetPokemon] = React.useState()
  const [teraType, setTeraType] = React.useState()

  const handleSelectionChange = selectedItem => {
    console.log(selectedItem)
    if (!selectedItem) {
      setTargetPokemon(null)
      setTeraType(null)
      return
    }
    //type ActionTypes = | 'clear' | 'create-option' | 'deselect-option' | 'pop-value' | 'remove-value' | 'select-option' | 'set-value'
    const p = raidPokemon.find(x => x.id === selectedItem.id)
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

  const sortNameDesc = (a, b) => {
    if (a.name < b.name) {
      return -1
    }
    if (a.name > b.name) {
      return 1
    }
    return 0
  }

  const classNames = {
    control: state => "bg-slate-800 p-3",
    option: state => "bg-slate-800 text-slate-50 p-3 hover:bg-slate-700",
    container: state =>
      state.isFocussed
        ? "rounded-md border-2 border-pink-300"
        : "rounded-md border-2 border-yellow-300",
    singleValue: state => "text-slate-50",
  }

  return (
    <Layout title="Who's that Pokemon">
      <h1 className="text-3xl mb-4">Raid helper</h1>
      <section className="my-4 text-sm text-slate-400">
        <p>
          Who&apos;s that Pokemon helps your find the right pokemon for raids so
          you can spend your time battling, not reloading.
        </p>
      </section>
      <section className="rounded-md mb-4 capitalize">
        <Select
          unstyled
          isClearable
          classNames={classNames}
          onChange={handleSelectionChange}
          options={raidPokemon
            .sort(sortNameDesc)
            .map(p => ({ id: p.id, label: p.name }))}
        />

        {/* <ComboBox
          label="What Pokemon is this raid for?"
          defaultItems={raidPokemon.sort(sortNameDesc)}
          onSelectionChange={handleSelectionChange}
        >
          {item => <Item>{item.name}</Item>}
        </ComboBox> */}
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
      <footer className="mt-8 text-sm">
        <p>
          (This is a Beta version that only lists 6* raid Pokemon,{" "}
          <Link href="/contact" className="text-yellow-300 font-bold inline">
            Contact us
          </Link>{" "}
          if you&apos;d like to see more)
        </p>
      </footer>
    </Layout>
  )
}

export const getStaticProps = async () => {
  return {
    props: { types: types, raidPokemon: raidPokemon },
  }
}
