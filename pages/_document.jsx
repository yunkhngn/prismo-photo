import { Html, Head, Main, NextScript } from "next/document";
import clsx from "clsx";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased"
        )}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

