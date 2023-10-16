import React from 'react'
import Image from 'next/image'

import svPokemon from '../../all_pokemon.json'

import HeadedCard from './headed_card'

const getSuperEffective = (relations) => relations.double_damage_from

const pokemonImageUrl = (id) => {
  let paddedId

  if (id.toString().length > 3) {
    paddedId = ('0' + id).slice(-4)
  } else {
    paddedId = ('00' + id).slice(-3)
  }

  return `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${paddedId}.png`
}

const getSuitablePokemon = (targetPokemon, types, teraTypeName) => {
  console.log(targetPokemon)
  const bestAttackType =
    targetPokemon.stats.defense > targetPokemon.stats.special_defense
      ? 'special'
      : targetPokemon.stats.defense === targetPokemon.stats.special_defense
      ? 'equal'
      : 'physical'
  // types that the target pokemn hits for super effective dmg
  const data = targetPokemon.moveInfo.map((m) =>
    types
      .find((t) => t.name === m.type)
      ?.damage_relations.double_damage_to.map((ddt) => ddt.name)
  )

  const uniqueTypes = [...new Set(data.flat())]

  // pokemon who can't be hit for super effective dmg
  const suitable = svPokemon.filter(
    (p) => !p.types.some((t) => uniqueTypes.includes(t))
  )

  // pokemon who have at least one setup move that boosts attack or special attack
  const suitableWithSetupMapped = suitable.map((p) => {
    const setupMoves = p.moveInfo.filter(
      (mi) =>
        mi.class === 'status' &&
        mi.stat_changes &&
        mi.stat_changes.length > 0 &&
        mi.stat_changes.some(
          (sc) =>
            (sc.stat.name === 'attack' || sc.stat.name === 'special-attack') &&
            parseInt(sc.change, 10) > 0
        )
    )

    return {
      ...p,
      setupMoves,
    }
  })

  const suitableWithSetup = suitableWithSetupMapped.filter(
    (x) => x.setupMoves.length > 0
  )

  // pokemon who have access to moves with super effective dmg against the target
  const superEffectiveTypes = getSuperEffective(
    types.find((t) => t.name === teraTypeName).damage_relations
  )

  const superEffective = suitableWithSetup
    .filter((p) => {
      return p.moveInfo
        .filter((m) => m.class !== 'status')
        .filter((m) => m.class === bestAttackType || bestAttackType === 'equal')
        .some((m) => superEffectiveTypes.map((t) => t.name).includes(m.type))
    })
    .map((p) => ({
      ...p,
      seMoves: p.moveInfo.filter(
        (m) =>
          superEffectiveTypes.map((t) => t.name).includes(m.type) &&
          m.power > 80 &&
          m.class !== 'status'
      ),
      seStabMoves: p.moveInfo.filter(
        (m) =>
          superEffectiveTypes.map((t) => t.name).includes(m.type) &&
          m.class !== 'status' &&
          m.power > 80 &&
          p.types.includes(m.type)
      ),
    }))

  const superEffectiveStab = superEffective.filter(
    (p) => p.seStabMoves.length > 0
  )

  // list the dmging moves you want
  // const seMoves = superEffective
  //   .map(m => superEffectiveTypes.map(t => t.name).includes(m.type))
  //   .map(p => p.moveInfo.map(i => i.name))
  // console.log("se moves", seMoves)

  // prioritise the moves that are super effective and hit against the weakest defence type of the target pokemon
  return superEffectiveStab.sort(sortNameDesc)
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

const sortPowerDesc = (a, b) => {
  if (a.power > b.power) {
    return -1
  }
  if (a.power < b.power) {
    return 1
  }
  return 0
}
//TODO: prioritise defenders that have a good match up defensively to the class of the attacker.
const SuitablePokemon = ({ pokemon, types, teraTypeName }) => (
  <HeadedCard headerText="Who should you pick?">
    <section className="p-4">
      <section className="pb-4 text-sm text-slate-300">
        <p className="pb-2">
          The list below are Pokemon who aren&apos;t vulnerable to the raid
          attacks so you shouldn&apos;t get squished.
        </p>
        <p className="pb-2">
          The moves listed will deal Super-effective damage to the raid Pokemon
          and focus on attacks which exploit the target Pokemon&apos;s weakest
          defence. so make sure you have some of these in your build.
        </p>
        <p>
          Pokemon without any setup moves are excluded. For 6* raids, not having
          any setup moves makes things really hard work.
        </p>
      </section>
      <ul className="grid grid-cols-2 gap-1 lg:grid-cols-4 lg:gap-4">
        {getSuitablePokemon(pokemon, types, teraTypeName).map((p) => (
          <article
            key={p.id + p.name}
            className="flex flex-col border border-gray-500 rounded-md p-2 mb-1 w-auto"
          >
            <p className="font-bold capitalize mb-4">{p.name}</p>
            <div className="flex flex-col">
              <section className="flex mb-4 border border-r-0 border-l-0 border-t-0 pb-2">
                <div className="flex-grow">
                  <Image
                    src={pokemonImageUrl(p.id)}
                    alt={p.name}
                    width="64"
                    height="64"
                  />
                </div>
                <ul className="ml-1">
                  {p.types.map((t) => (
                    <li key={p.id + t} className="py-1">
                      <Image
                        src={`/img/${t}_banner.png`}
                        alt={t}
                        width="100"
                        height="24"
                      />
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mb-4">
                <p className="text-xs font-bold">Super-effective Attacks</p>
                <ul className="mt-4">
                  {p.seStabMoves.sort(sortPowerDesc).map((move) => (
                    <li key={move.name} className="flex flex-row mb-1">
                      <div>
                        <Image
                          src={`/img/${move.type}_type.png`}
                          alt={move.type}
                          width={24}
                          height={24}
                          className="mr-2"
                        />
                      </div>
                      <p className="capitalize text-sm break-words">
                        {move.name.replace('-', ' ')}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
              <hr />
              <section className="mt-4">
                <p className="text-xs font-bold">Setup moves</p>
                <ul className="mt-4">
                  {p.setupMoves.map((move) => (
                    <li key={move.name} className="flex flex-row mb-1">
                      <div>
                        <Image
                          src={`/img/${move.type}_type.png`}
                          alt={move.type}
                          width={24}
                          height={24}
                          className="mr-2"
                        />
                      </div>
                      <p className="capitalize text-sm break-words">
                        {move.name.replace('-', ' ')}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </article>
        ))}
      </ul>
    </section>
  </HeadedCard>
)

export default SuitablePokemon
