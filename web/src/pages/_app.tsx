import type { AppProps } from "next/app";

import "../../tailwind.config";
import "../styles/generated.css";
import "../styles/global.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
