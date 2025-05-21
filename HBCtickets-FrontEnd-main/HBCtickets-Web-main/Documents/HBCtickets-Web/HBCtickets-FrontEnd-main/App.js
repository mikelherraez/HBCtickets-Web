import '../styles/globals.css'
// …el resto de tu _app…
export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
