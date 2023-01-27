import Image from "next/image";
import Link from "next/link";
import { Inter } from "@next/font/google";

const inter = Inter({ subsets: ["latin"] });

import Layout from "../components/Layout";
export default function Home({ pokemon }) {
  return (
    <Layout title="Who's that Pokemon">
      <h1 className="text-4xl mb-8 text-center">Who&apos;s that Pokemon</h1>
      <ul>
        {pokemon.map((item, index) => {
          return (
            <li key={index}>
              <Link href={`/pokemon/${index + 1}`}>
                <div className="border p-4 border-grey my-2 flex items-center text-lg bg-gray-200 rounded-md">
                  <section className="w-20 h-20 mr-3 relative">
                    <Image src={item.image} alt={item.name} fill="true" />
                  </section>
                  <span className="mr-2 font-bold">{index + 1}.</span>
                  {item.name}
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
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=150");
  const { results } = await res.json();
  const pokemon = results.map((pokemon, index) => {
    const paddedId = ("00" + (index + 1)).slice(-3);
    const image = `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${paddedId}.png`;
    return { ...pokemon, image };
  });
  return {
    props: { pokemon },
  };
};
