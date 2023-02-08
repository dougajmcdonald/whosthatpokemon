import React from "react";

import HeadedCard from "./headed_card";

const getMoveData = () => {
  // get the moves from the 6* raid list for the pokemon
  // get the move data so we know the type of the attack, and also the attack type (att/sp att)
  // for all the attack types, find the pokemon types which take double dmg from the attack types
  // filter the pokemon to those which are SV appropriate and NOT vulnerable to ANY of the attacks of the types
};

export default ({ pokemon }) => (
  <HeadedCard headerText="Who should you pick?">
    <section>
      {pokemon.moveInfo.map((m) => (
        <div key={m.name}>
          {m.name}
          {m.type}
        </div>
      ))}
    </section>
  </HeadedCard>
);
