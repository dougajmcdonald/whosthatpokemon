import { svPokedexFinalEvolutions } from './sv_pokemon'

export const filterNameToValidPokemon = (name) =>
  svPokedexFinalEvolutions.map((pdx) => pdx.name).includes(name)
