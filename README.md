# Whosthatpokemon

This is a website designed to help people find the best raid pokemon for Tera raids in Pokemon Scarlet/Violet.

It knows about all the 5* and 6* raids in the game and looks at the types and moves of those pokemon to suggest a list of pokemon you could use to avoid taking supereffective damage and to deal supereffective damage in return.

## Getting Started

How to get a list of valid raid pokemon

- Use serebii.net to find the 5star and 6star pokemon:
  - https://serebii.net/scarletviolet/teraraidbattles/5star.shtm
  - https://serebii.net/scarletviolet/teraraidbattles/6star.shtml
- Copy the name and the moves of the pokemon into the `raid_pokemon_5.js` and `raid_pokemon_6.js` files. These are effectively the source values which we need to lookup.
- run the site locally with `npm run dev`
- access the data getter page `http://localhost:3000/data-getter` this will go and get all the data for the moves and pokemon from the source values, and dump the outputs into `five_star_raid_pokemon.json` and `six_star_raid_pokemon.json` respectively - these need to be comitted to source control as they are the data source for the api calls once hosted (this was far quicker than trying to access and process the data from the third party API on the fly)
- (Optional) - Configure the `data-getter.js` to get data for all pokemon (this can take a while). I think you'd need to do this when pokemon are updated.

## Problem solving

### Getting the pokemon

If you get 404's trying to get the pokemon from any of the data-getter methods, it's likely that pokeapi.io expects a different name to the "common" name provided. Where there are different variants (e.g. Gender) you have to be really specific (which is REALLY annoying!)

Here's how to solve it:

1. Make a request to pokeapi with the name you think is right - https://pokeapi.co/api/v2/pokemon/giratina confirm you get a 404/not found.
2. Go to something which can do a lookup to pokedex number, e.g https://www.pokemon.com/uk/pokedex and search for the pokedex entry
3. Requery https://pokeapi.co/api/v2/pokemon/487 with the pokedex number. Look at the network response for the correct name.

(TODO: Perhaps we should query by pokedex number anyway?)

If you get other 404's here's what to check:

- Case sensitivity (all the API names are lowercase)
- Spaces (all the multi word API calls are hyphentated e.g. "hydro-pump")
