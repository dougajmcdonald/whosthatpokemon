import Head from 'next/head'
import Nav from './nav'

const Layout = ({ title, children }) => {
  return (
    <div className="bg-slate-900">
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <main className="container mx-auto max-w-xl pt-8 min-h-screen text-slate-50 p-4">
        {children}
      </main>
    </div>
  )
}

export default Layout
