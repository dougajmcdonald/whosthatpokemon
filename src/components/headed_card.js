import Head from 'next/head'
import React from 'react'

const HeadedCard = ({ headerText, children }) => (
  <section className="bg-slate-800 rounded-md mt-6 pb-4">
    <header className="bg-yellow-300 text-slate-800 font-bold py-2 pl-3 capitalize rounded-t-md">
      {headerText}
    </header>
    {children}
  </section>
)

export default HeadedCard
