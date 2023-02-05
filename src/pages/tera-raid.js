import React, { useEffect } from "react";
import useSwr from "swr";
import Image from "next/image";
import { Inter } from "@next/font/google";
import Pokedex from "pokedex-promise-v2";
import { filterNameToValidPokemon } from "../data/filters";
import { svPokedex } from "../data/sv_pokemon";

const inter = Inter({ subsets: ["latin"] });

import Layout from "../components/layout";
import Button from "../components/button";
import { AutoComplete } from "../components/autocomplete";
import { Item, Section } from "../components/combobox";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function TeraRaid() {
  const { data, error, isLoading } = useSwr("/api/types", fetcher);

  if (error) return <div>Failed to load users</div>;
  if (isLoading) return <div>Loading...</div>;
  // console.log(types);
  if (!data) return null;
  // console.log(types);

  return (
    <Layout title="Tera raid helper">
      <h1 className="text-4xl mb-8 text-center">Tera raid helper</h1>
      <ul>
        {data.map((t) => (
          <li key={t.name}>{t.name}</li>
        ))}
      </ul>
    </Layout>
  );
}

export const getStaticProps = async () => {
  return {
    props: {},
  };
};
