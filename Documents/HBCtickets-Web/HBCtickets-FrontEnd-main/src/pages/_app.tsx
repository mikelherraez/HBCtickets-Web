import '../styles/globals.css'; // Tailwind base + utilidades
import '../styles/home.css';    // Clases personalizadas hbc-…

import type { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
