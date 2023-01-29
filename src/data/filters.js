import { scarletVioletPokedex } from "./sv_pokemon";

export const filterArrayToValidPokemon = (array) => {
  console.log("input", array);
  return array.filter((i) => scarletVioletPokemon.includes(i.name));
};

export const filterNameToValidPokemon = (name) =>
  scarletVioletPokedex.includes(name);
