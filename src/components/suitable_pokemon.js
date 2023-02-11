import React from "react"
import Image from "next/image"

import svPokemon from "../../all_pokemon.json"

import HeadedCard from "./headed_card"

const getSuperEffective = relations => relations.double_damage_from

const pokemonImageUrl = id => {
  let paddedId

  if (id.toString().length > 3) {
    paddedId = ("0" + id).slice(-4)
  } else {
    paddedId = ("00" + id).slice(-3)
  }

  return `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${paddedId}.png`
}

const getSuitablePokemon = (moves, types, teraType) => {
  // types that the target pokemn hits for super effective dmg
  const data = moves.map(m =>
    types
      .find(t => t.name === m.type)
      ?.damage_relations.double_damage_to.map(ddt => ddt.name)
  )

  const uniqueTypes = [...new Set(data.flat())]

  // pokemon who can't be hit for super effective dmg
  const suitable = svPokemon.filter(
    p => !p.types.some(t => uniqueTypes.includes(t))
  )

  // pokemon who have access to moves with super effective dmg against the target
  const superEffectiveTypes = getSuperEffective(teraType.damage_relations)
  //console.log(superEffectiveTypes)
  const superEffective = suitable
    .filter(p => {
      //console.log(p.moveInfo.map(t => t.type))
      return p.moveInfo
        .filter(m => m.class !== "status")
        .some(m => superEffectiveTypes.map(t => t.name).includes(m.type))
    })
    .map(p => ({
      ...p,
      seMoves: p.moveInfo.filter(
        m =>
          superEffectiveTypes.map(t => t.name).includes(m.type) &&
          m.class !== "status"
      ),
      seStabMoves: p.moveInfo.filter(
        m =>
          superEffectiveTypes.map(t => t.name).includes(m.type) &&
          m.class !== "status" &&
          p.types.includes(m.type)
      ),
    }))

  const superEffectiveStab = superEffective.filter(
    p => p.seStabMoves.length > 0
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

const SuitablePokemon = ({ pokemon, types, teraType }) => (
  <HeadedCard headerText="Who should you pick?">
    <section className="p-4">
      <section className="pb-4">
        <p>Enemy is level 90, make sure your Pokemon is over level 90.</p>
        <p>
          The list below are Pokemon who aren&apos;t vulnerable to the raid
          attacks.
        </p>
        <p>
          The moves listed will deal Super-effective damage to the raid Pokemon.
        </p>
      </section>
      <ul className="grid grid-cols-2">
        {getSuitablePokemon(pokemon.moveInfo, types, teraType).map(p => (
          <article
            key={p.id + p.name}
            className="flex flex-col border border-gray-500 rounded-md p-2 mr-2 mb-2 w-auto"
          >
            <p className="font-bold text-sm capitalize mb-2">{p.name}</p>
            <div className="flex flex-col">
              <section className="flex mb-2">
                <Image
                  src={pokemonImageUrl(p.id)}
                  alt={p.name}
                  width="64"
                  height="64"
                />
                <ul>
                  {p.types.map(t => (
                    <li key={p.id + t} className="py-1">
                      <Image
                        src={`/img/${t}_banner.png`}
                        alt={t}
                        width="66"
                        height="16"
                      />
                    </li>
                  ))}
                </ul>
              </section>

              <section className="ml-2">
                <ul>
                  {p.seStabMoves.map(move => (
                    <li key={move.name} className="flex flex-row mb-1">
                      <Image
                        src={`/img/${move.type}_type.png`}
                        alt={move.type}
                        width="24"
                        height="24"
                        className="mr-2"
                      />
                      <p className="capitalize text-sm">
                        {move.name.replace("-", " ")}
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
