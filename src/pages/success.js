import Layout from '@/components/layout'
import Link from 'next/link'

export default function Success() {
  return (
    <Layout title="Who's that Pokemon">
      <h1 className="text-4xl mb-8 text-center">Who&apos;s that Pokemon</h1>
      <section className="mb-4 text-sm text-slate-400">
        <p className="">
          Thanks for your feedback, we truly appreciate your time and interest.
        </p>
        <Link href="/" className="text-yellow-300 font-bold">
          Home
        </Link>
      </section>
    </Layout>
  )
}
