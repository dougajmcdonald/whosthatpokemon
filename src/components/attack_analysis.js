import React from "react";
import HeadedCard from "./headed_card";
import Image from "next/image";

const getSuperEffective = (relations) => relations.double_damage_from;

const getNotEffective = (relations) => relations.half_damage_from;

const getImmune = (relations) => relations.no_damage_from;

const AttackAnalysis = ({ teraType }) => (
  <HeadedCard headerText="Attack analysis">
    <section className="flex flex-row justify-center items-start gap-4 p-4">
      <ul>
        <li className="mb-2">Supereffective</li>
        {getSuperEffective(teraType.damage_relations).map((type) => (
          <li key={type.name}>
            <Image
              key={"type_banner_" + type.name}
              src={`/img/${type.name}_banner.png`}
              alt={type.name}
              width="100"
              height="24"
              className="inline-block"
            />
          </li>
        ))}
      </ul>
      <ul>
        <li className="mb-2">Not effective</li>
        {getNotEffective(teraType.damage_relations).map((type) => (
          <li key={type.name}>
            <Image
              key={"type_banner_" + type.name}
              src={`/img/${type.name}_banner.png`}
              alt={type.name}
              width="100"
              height="24"
              className="inline-block"
            />
          </li>
        ))}
      </ul>
      <ul>
        <li className="mb-2">Immune</li>
        {getImmune(teraType.damage_relations).map((type) => (
          <li key={type.name}>
            <Image
              key={"type_banner_" + type.name}
              src={`/img/${type.name}_banner.png`}
              alt={type.name}
              width="100"
              height="24"
              className="inline-block"
            />
          </li>
        ))}
      </ul>
    </section>
  </HeadedCard>
);

export default AttackAnalysis;
