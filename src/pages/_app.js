import "@/styles/globals.css"
import { GoogleAnalytics } from "nextjs-google-analytics"
//import { SSRProvider } from "react-aria"

// export function reportWebVitals({ id, name, label, value }) {
//   event(name, {
//     category: label === "web-vital" ? "Web Vitals" : "Next.js custom metric",
//     value: Math.round(name === "CLS" ? value * 1000 : value), // values must be integers
//     label: id, // id unique to current page load
//     nonInteraction: true, // avoids affecting bounce rate.
//   })
// }

export default function App({ Component, pageProps }) {
  return (
    //<SSRProvider>
    <>
      <GoogleAnalytics trackPageViews />
      <Component {...pageProps} />
    </>
    //</SSRProvider>
  )
  // Can't use SSR provider at the moment due to react.spectrum issue here:
  // https://github.com/adobe/react-spectrum/issues/3787
  // It means you get a bunch of console warnings about ID consistency between server and client
  // because ids for the autocomplete SHOULD be static due to hard coded data, it's probably fine :shrug:
}
