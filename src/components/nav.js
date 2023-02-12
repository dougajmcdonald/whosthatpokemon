import React from "react"
import Link from "next/link"
import Image from "next/image"

const Nav = () => (
  <section className="flex flex-row h-16 bg-slate-800 w-full text-slate-50">
    <section className="flex items-center px-4 flex-grow">
      <Image
        src="/img/logo v1.svg"
        alt="Who's that Pokemon logo"
        height="64"
        width="122"
      />
    </section>
    <nav className="flex flex-row">
      <Link
        className="flex items-center px-4 hover:bg-slate-900 hover:text-yellow-300"
        href="/"
      >
        Home
      </Link>
      <Link
        className="flex items-center px-4 hover:bg-slate-900 hover:text-yellow-300"
        href="/contact"
      >
        Contact us
      </Link>
    </nav>
  </section>
)

export default Nav
