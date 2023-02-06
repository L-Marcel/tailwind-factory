import type { AppProps } from "next/app";

import "../../tailwind.config";
import "../styles/global.css";
import "tailwind-factory/styles.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
