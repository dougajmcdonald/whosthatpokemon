import React from 'react'
import Head from 'next/head'
import Select from 'react-select'
import { Inter } from '@next/font/google'

import types from '../../types.json'
import raidPokemon5 from '../../five_star_raid_pokemon.json'
import raidPokemon6 from '../../six_star_raid_pokemon.json'

const inter = Inter({ subsets: ['latin'] })

import Layout from '../components/layout'
import TeraTypeSelector from '../components/teratypeselector'
import PokemonAnalysis from '../components/pokemon_analysis'
import AttackAnalysis from '../components/attack_analysis'
import SuitablePokemon from '../components/suitable_pokemon'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Home({ types, allRaidPokemon }) {
  const router = useRouter()

  const [targetPokemon, setTargetPokemon] = React.useState()

  // // get the route values
  const pokemonName = router.query.pokemon
  const teraTypeName = router.query.tera

  // TODO: move this to data getter
  const pokemonImageUrl = (id) => {
    let paddedId

    if (id.toString().length > 3) {
      paddedId = ('0' + id).slice(-4)
    } else {
      paddedId = ('00' + id).slice(-3)
    }

    return `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${paddedId}.png`
  }

  const getPokemon = (pokemonName) => {
    const p = allRaidPokemon.find((x) => x.name === pokemonName)
    if (p) {
      const pokemonWithImage = {
        ...p,
        image: pokemonImageUrl(p.id),
      }
      setTargetPokemon(pokemonWithImage)
    }
  }

  // if we have route values, populate the page state
  if (pokemonName && !targetPokemon) {
    getPokemon(pokemonName)
  }

  const handleSelectionChange = (selectedItem, type) => {
    if (type.action === 'clear') {
      router.push({
        pathname: '/',
        query: null,
      })
      setTargetPokemon(null)
    } else {
      getPokemon(selectedItem.label)
      router.push(`/?pokemon=${selectedItem.label}`, undefined, {
        shallow: true,
      })
    }
  }

  function handleClick(type) {
    router.push(`/?pokemon=${pokemonName}&tera=${type.name}`, undefined, {
      shallow: true,
    })
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
    control: (state) => 'bg-slate-800 p-3 rounded-md',
    option: (state) => 'bg-slate-800 text-slate-50 p-3 pl-5 hover:bg-slate-700',
    container: (state) =>
      state.isFocussed
        ? 'rounded-md border-2 border-pink-300'
        : 'rounded-md border-2 border-yellow-300',
    singleValue: (state) => 'text-slate-50 rounded-md',
    groupHeading: (state) => 'p-2 bg-slate-700 font-bold',
  }

  const prepGroupedRaidMons = () => {
    const options = [
      {
        label: 'Five Star Raids',
        options: raidPokemon5
          .sort(sortNameDesc)
          .map((p) => ({ id: p.id, label: p.name })),
      },
      {
        label: 'Six Star Raids',
        options: raidPokemon6
          .sort(sortNameDesc)
          .map((p) => ({ id: p.id, label: p.name })),
      },
    ]
    return options
  }

  return (
    <Layout
      title={
        pokemonName
          ? teraTypeName
            ? `Who's that Pokemon - Raid counters for ${pokemonName} with ${teraTypeName} tera`
            : `Who's that Pokemon - Raid counters for ${pokemonName}`
          : `Who's that Pokemon - Find raid counters for Scarlet & Violet raids`
      }
      description={
        pokemonName
          ? teraTypeName
            ? `Raid counters for ${pokemonName} with ${teraTypeName} tera`
            : `Raid counters for ${pokemonName}`
          : 'Find raid counters for Scarlet & Violet raids'
      }
    >
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
          options={prepGroupedRaidMons()}
        />
      </section>
      {targetPokemon && (
        <TeraTypeSelector types={types} handleClick={handleClick} />
      )}

      {targetPokemon && teraTypeName && (
        <div>
          <PokemonAnalysis
            pokemon={targetPokemon}
            teraTypeName={teraTypeName}
          />
          {/* <AttackAnalysis teraType={teraType} /> */}
          <SuitablePokemon
            pokemon={targetPokemon}
            types={types}
            teraTypeName={teraTypeName}
          />
        </div>
      )}
      <footer className="mt-8 text-sm"></footer>
    </Layout>
  )
}

export const getStaticProps = async () => {
  return {
    props: {
      types,
      raidPokemon5,
      raidPokemon6,
      allRaidPokemon: raidPokemon5.concat(raidPokemon6),
    },
  }
}
