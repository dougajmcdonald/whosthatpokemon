import React from "react"
import Button from "../components/button"
import Image from "next/image"

const TeraTypeSelector = ({ types, handleClick }) => (
  <section className="flex flex-row justify-center items-center flex-grow">
    <ul className="grid grid-cols-6">
      {types.map(type => {
        return (
          <li key={type.name} className="inline-block">
            <Button onPress={() => handleClick(type)}>
              <Image
                src={`/img/${type.name}_type.png`}
                alt={type.name}
                width="48"
                height="48"
              />
            </Button>
          </li>
        )
      })}
    </ul>
  </section>
)

export default TeraTypeSelector
