import "@/styles/globals.css";
import { SSRProvider } from "react-aria";

export default function App({ Component, pageProps }) {
  return (
    // Can't use SSR provider at the moment due to react.spectrum issue here:
    // https://github.com/adobe/react-spectrum/issues/3787
    // It means you get a bunch of console warnings about ID consistency between server and client
    // because ids for the autocomplete SHOULD be static due to hard coded data, it's probably fine :shrug:
    //<SSRProvider>
    <Component {...pageProps} />
    //</SSRProvider>
  );
}
