import Image from "next/image";
import Link from "next/link";
import { Inter } from "@next/font/google";
import Pokedex from "pokedex-promise-v2";

const inter = Inter({ subsets: ["latin"] });

import Layout from "../components/layout";
import { version } from "react";

export default function Home({ pokemon }) {
  return (
    <Layout title="Who's that Pokemon">
      <h1 className="text-4xl mb-8 text-center">Who&apos;s that Pokemon</h1>
      <ul>
        {pokemon.map((mon) => {
          return (
            <li key={mon.id}>
              <Link href={`/pokemon/${mon.id}`}>
                <div className="border p-4 border-grey my-2 flex items-center text-lg bg-gray-200 rounded-md">
                  <section className="w-20 h-20 mr-3 relative">
                    <Image src={mon.image} alt={mon.name} fill="true" />
                  </section>
                  <span className="mr-2 font-bold">{mon.id}.</span>
                  {mon.name}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </Layout>
  );
}

export const getStaticProps = async () => {
  const scarletVioletPokedex = [
    "sprigatito",
    "floragato",
    "meowscarada",
    "fuecoco",
    "crocalor",
    "skeledirge",
    "quaxly",
    "quaxwell",
    "quaquaval",
    "lechonk",
    "oinkologne",
    "tarountula",
    "spidops",
    "nymble",
    "lokix",
    "hoppip",
    "skiploom",
    "jumpluff",
    "fletchling",
    "fletchinder",
    "talonflame",
    "pawmi",
    "pawmo",
    "pawmot",
    "houndour",
    "houndoom",
    "yungoos",
    "gumshoos",
    "skwovet",
    "greedent",
    "sunkern",
    "sunflora",
    "kricketot",
    "kricketune",
    "scatterbug",
    "spewpa",
    "vivillon",
    "combee",
    "vespiquen",
    "rookidee",
    "corvisquire",
    "corviknight",
    "happiny",
    "chansey",
    "blissey",
    "azurill",
    "marill",
    "azumarill",
    "surskit",
    "masquerain",
    "buizel",
    "floatzel",
    "wooper",
    "clodsire",
    "psyduck",
    "golduck",
    "chewtle",
    "drednaw",
    "igglybuff",
    "jigglypuff",
    "wigglytuff",
    "ralts",
    "kirlia",
    "gardevoir",
    "gallade",
    "drowzee",
    "hypno",
    "gastly",
    "haunter",
    "gengar",
    "tandemaus",
    "maushold",
    "pichu",
    "pikachu",
    "raichu",
    "fidough",
    "dachsbun",
    "slakoth",
    "vigoroth",
    "slaking",
    "bounsweet",
    "steenee",
    "tsareena",
    "smoliv",
    "dolliv",
    "arboliva",
    "bonsly",
    "sudowoodo",
    "rockruff",
    //"lycanroc",
    "rolycoly",
    "carkol",
    "coalossal",
    "shinx",
    "luxio",
    "luxray",
    "starly",
    "staravia",
    "staraptor",
    //"oricorio",
    "mareep",
    "flaaffy",
    "ampharos",
    "petilil",
    "lilligant",
    "shroomish",
    "breloom",
    "applin",
    "flapple",
    "appletun",
    "spoink",
    "grumpig",
    "squawkabilly",
    "misdreavus",
    "mismagius",
    "makuhita",
    "hariyama",
    "crabrawler",
    "crabominable",
    "salandit",
    "salazzle",
    "phanpy",
    "donphan",
    "cufant",
    "copperajah",
    "gible",
    "gabite",
    "garchomp",
    "nacli",
    "naclstack",
    "garganacl",
    "wingull",
    "pelipper",
    "magikarp",
    "gyarados",
    "arrokuda",
    "barraskewda",
    //"basculin",
    "gulpin",
    "swalot",
    "meowth",
    "persian",
    "drifloon",
    "drifblim",
    "flabebe",
    "floette",
    "florges",
    "diglett",
    "dugtrio",
    "torkoal",
    "numel",
    "camerupt",
    "bronzor",
    "bronzong",
    "axew",
    "fraxure",
    "haxorus",
    "mankey",
    "primeape",
    "annihilape",
    "meditite",
    "medicham",
    "riolu",
    "lucario",
    "charcadet",
    "armarouge",
    "ceruledge",
    "barboach",
    "whiscash",
    "tadbulb",
    "bellibolt",
    "goomy",
    "sliggoo",
    "goodra",
    "croagunk",
    "toxicroak",
    "wattrel",
    "kilowattrel",
    "eevee",
    "vaporeon",
    "jolteon",
    "flareon",
    "espeon",
    "umbreon",
    "leafeon",
    "glaceon",
    "sylveon",
    "dunsparce",
    "dudunsparce",
    "deerling",
    "sawsbuck",
    "girafarig",
    "farigiraf",
    "grimer",
    "muk",
    "maschiff",
    "mabosstiff",
    "toxel",
    "toxtricity-amped",
    "dedenne",
    "pachirisu",
    "shroodle",
    "grafaiai",
    "stantler",
    "foongus",
    "amoonguss",
    "voltorb",
    "electrode",
    "magnemite",
    "magneton",
    "magnezone",
    "ditto",
    "growlithe",
    "arcanine",
    "teddiursa",
    "ursaring",
    "zangoose",
    "seviper",
    "swablu",
    "altaria",
    "skiddo",
    "gogoat",
    "tauros",
    "litleo",
    "pyroar",
    "stunky",
    "skuntank",
    "zorua",
    "zoroark",
    "sneasel",
    "weavile",
    "murkrow",
    "honchkrow",
    "gothita",
    "gothorita",
    "gothitelle",
    "sinistea",
    "polteageist",
    "mimikyu-disguised",
    "klefki",
    "indeedee-male",
    //"indeedee-f",
    "bramblin",
    "brambleghast",
    "toedscool",
    "toedscruel",
    "tropius",
    "fomantis",
    "lurantis",
    "klawf",
    "capsakid",
    "scovillain",
    "cacnea",
    "cacturne",
    "rellor",
    "rabsca",
    "venonat",
    "venomoth",
    "pineco",
    "forretress",
    "scyther",
    "scizor",
    "heracross",
    "flittle",
    "espathra",
    "hippopotas",
    "hippowdon",
    "sandile",
    "krokorok",
    "krookodile",
    "silicobra",
    "sandaconda",
    "mudbray",
    "mudsdale",
    "larvesta",
    "volcarona",
    "bagon",
    "shelgon",
    "salamence",
    "tinkatink",
    "tinkatuff",
    "tinkaton",
    "hatenna",
    "hattrem",
    "hatterene",
    "impidimp",
    "morgrem",
    "grimmsnarl",
    "wiglett",
    "wugtrio",
    "bombirdier",
    "finizen",
    "palafin",
    "varoom",
    "revavroom",
    "cyclizar",
    "orthworm",
    "sableye",
    "shuppet",
    "banette",
    "falinks",
    "hawlucha",
    "spiritomb",
    "noibat",
    "noivern",
    "dreepy",
    "drakloak",
    "dragapult",
    "glimmet",
    "glimmora",
    "rotom",
    "greavard",
    "houndstone",
    "oranguru",
    "passimian",
    "komala",
    "larvitar",
    "pupitar",
    "tyranitar",
    "stonjourner",
    "eiscue-ice",
    "pincurchin",
    "sandygast",
    "palossand",
    "slowpoke",
    "slowbro",
    "slowking",
    "shellos",
    "gastrodon",
    "shellder",
    "cloyster",
    "qwilfish",
    "luvdisc",
    "finneon",
    "lumineon",
    "bruxish",
    "alomomola",
    "skrelp",
    "dragalge",
    "clauncher",
    "clawitzer",
    "tynamo",
    "eelektrik",
    "eelektross",
    "mareanie",
    "toxapex",
    "flamigo",
    "dratini",
    "dragonair",
    "dragonite",
    "snom",
    "frosmoth",
    "snover",
    "abomasnow",
    "delibird",
    "cubchoo",
    "beartic",
    "snorunt",
    "glalie",
    "froslass",
    "cryogonal",
    "cetoddle",
    "cetitan",
    "bergmite",
    "avalugg",
    "rufflet",
    "braviary",
    "pawniard",
    "bisharp",
    "kingambit",
    "deino",
    "zweilous",
    "hydreigon",
    "veluza",
    "dondozo",
    "tatsugiri",
    "great-tusk",
    "scream-tail",
    "brute-bonnet",
    "flutter-mane",
    "slither-wing",
    "sandy-shocks",
    "iron-treads",
    "iron-bundle",
    "iron-hands",
    "iron-jugulis",
    "iron-moth",
    "iron-thorns",
    "frigibax",
    "arctibax",
    "baxcalibur",
    "gimmighoul",
    "gholdengo",
    "wo-chien",
    "chien-pao",
    "ting-lu",
    "chi-yu",
    "roaring-moon",
    "iron-valiant",
    "koraidon",
    "miraidon",
  ];

  const P = new Pokedex();

  const pokemonList = await P.getPokemonByName(scarletVioletPokedex);

  // console.log(data);

  //const f = async () => {
  //const response = await P.getPokemonByName("sprigatito");
  //const data = response.json();

  //console.log(response);
  //};
  //f();

  //const pbn = async () => {
  // scarletVioletPokedex.forEach(async (name) => {
  //   const result = await P.getPokemonByName(name);
  //   console.log(result);
  //   //pokemonData.push(result);
  // });
  //};

  //const newSVPokemonMin = 906;
  //const newSVPokemonMax = 1008;

  //const res = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=1008");
  //const { results } = await res.json();
  //const svPokemon = results.map((p) => p.name);
  //console.log(svPokemon);

  // results.forEach(async (pokemon, i) => {
  // let url = pokemon.url;
  //console.log(url);
  // const pokemonData = await fetch(
  //   "https://pokeapi.co/api/v2/pokemon/sprigatito"
  // );
  // const kk = await pokemonData.json();
  //console.log(kk);
  //console.log(kk.game_indices.map((gi) => gi.version.url));
  //if (
  //kk.game_indices.filter(
  //(g) => g.version.url === "https://pokeapi.co/api/v2/version/41/"
  //);
  //)//{
  //  svPokemon.push(pokemonData);
  //}
  //});

  const pokemon = pokemonList.map((pokemon) => {
    //console.log(pokemon);

    let paddedId;

    if (pokemon.id.toString().length > 3) {
      paddedId = ("0" + pokemon.id).slice(-4);
    } else {
      paddedId = ("00" + pokemon.id).slice(-3);
    }

    //const
    const image = `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${paddedId}.png`;
    return { ...pokemon, image };
  });
  return {
    props: { pokemon },
  };
};
