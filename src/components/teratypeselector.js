import React from 'react'
import Button from '../components/button'
import Image from 'next/image'

const TeraTypeSelector = ({ types, handleClick }) => (
  <section className="flex flex-col flex-grow">
    <p className="block font-bold text-left mb-2">
      What is the raid Tera type?
    </p>
    <ul className="grid w-full grid-cols-6">
      {types.map((type) => {
        return (
          <li key={type.name} className="flex items-center justify-center">
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
