// src/pages/_app.tsx
import '../styles/globals.css';  // ① Tailwind core + resets
import '../styles/home.css';     // ② Your Home components & utilities

import type { AppProps } from 'next/app';
export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
