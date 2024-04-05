import "../styles/globals.css";
import "../styles/Edgecity.module.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
