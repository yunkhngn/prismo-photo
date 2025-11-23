import { Html, Head, Main, NextScript } from "next/document";
import clsx from "clsx";
import MetaTagContent from "@/components/meta-tag-content";

export default function Document() {
  return (
    <Html lang="vi">
      <Head>
        <MetaTagContent />
      </Head>
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

