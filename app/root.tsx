import { useMemo } from "react";
import { LoaderFunction, MetaFunction } from "@remix-run/deno";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { Footer } from "@/components/Footer";
import { BirthdateContext } from "@/contexts/BirthdateContext";
import { dateObject } from "@/utils/day";

import pkg from "../package.json";

import "@/styles/_typography.css";
import "@/styles/_base.css";

export const loader: LoaderFunction = () => ({
  ENV: { CALCULATED_BIRTHDATE: process.env.CALCULATED_BIRTHDATE },
});

export const meta: MetaFunction = () => [
  { title: pkg.short_name },
  { name: "description", content: pkg.description },
];

export default function App() {
  const data = useLoaderData<typeof loader>();

  const date = useMemo(() => dateObject(data.ENV.CALCULATED_BIRTHDATE), [data]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
        <link
          rel="preload"
          href="/fonts/Inter-Light.ttf"
          as="font"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Inter-SemiBold.ttf"
          as="font"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://esm.sh/gardevoir@1.0.0/dist/index.min.css"
          as="style"
        />
        <link
          rel="stylesheet"
          href="https://esm.sh/gardevoir@1.0.0/dist/index.min.css"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <BirthdateContext.Provider value={date}>
          <Outlet />
          <Footer />
        </BirthdateContext.Provider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
