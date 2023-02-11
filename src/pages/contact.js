import ContactForm from "@/components/contact_form"
import Layout from "@/components/layout"

export default function Contact() {
  return (
    <Layout title="Who's that Pokemon">
      <h1 className="text-4xl mb-8 text-center">Who&apos;s that Pokemon</h1>
      <section className="mb-4 text-sm text-slate-400">
        <p className="">
          We&apos;d love to hear from your if this has been helpful or you have
          any ideas on how we could improve the site and tools for you.
        </p>
      </section>
      <section>
        <ContactForm />
      </section>
    </Layout>
  )
}
