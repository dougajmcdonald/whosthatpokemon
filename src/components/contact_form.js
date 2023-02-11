export default function ContactForm() {
  return (
    <form
      name="contact"
      method="POST"
      action="/success"
      data-netlify="true"
      className="w-full flex flex-col"
    >
      <input
        type="hidden"
        className="hidden"
        name="form-name"
        value="contact"
      />
      <p className="flex flex-col">
        <label htmlFor="yourname" className="mb-2">
          Your Name
        </label>
        <input
          className="w-full outline-none px-3 py-3 appearance-none bg-transparent border-2 border-yellow-300 mb-4 rounded-md"
          type="text"
          name="name"
          id="yourname"
        />
      </p>
      <p className="flex flex-col">
        <label htmlFor="youremail" className="mb-2">
          Your Email
        </label>
        <input
          className="w-full outline-none px-3 py-3 appearance-none bg-transparent border-2 border-yellow-300 mb-4 rounded-md"
          type="email"
          name="email"
          id="youremail"
        />
      </p>
      <p className="flex flex-col">
        <label htmlFor="yourmessage" className="mb-2">
          Message
        </label>
        <textarea
          className="w-full outline-none px-3 py-3 appearance-none bg-transparent border-2 border-yellow-300 mb-4 rounded-md"
          name="message"
          id="yourmessage"
        ></textarea>
      </p>
      <p className="flex flex-row">
        <button
          className="bg-yellow-300 rounded-md text-slate-800 p-4 font-bold"
          type="submit"
        >
          Send
        </button>
      </p>
    </form>
  )
}
