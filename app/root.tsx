import { useEffect, useMemo, useState } from "react";
import {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
  json,
} from "@netlify/remix-runtime";
import { cssBundleHref } from "@remix-run/css-bundle";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { Footer } from "@/components/Footer";
import {
  BirthdateContext,
  BirthdateContextValue,
} from "@/contexts/BirthdateContext";
import { SessionContext } from "@/contexts/SessionContext";
import { Database } from "@/deno/postgres";
import { GuessData } from "./deno/postgres/types";
import { BIRTHDATE } from "@/utils/constants";
import { ONE_MINUTE, dateObject, lockDate } from "@/utils/day";
import { destroySession, getSession } from "@/utils/session";

import pkg from "../package.json";

import "@/styles/_typography.css";
import "@/styles/_base.css";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("cookie"));

  const db = new Database(process.env.POSTGRES_CONNECTION_STRING);

  const birthdate: GuessData | null = await db
    .getDate(BIRTHDATE)
    .catch(() => null);

  const values = {
    ENV: {
      CALCULATED_BIRTHDATE: process.env.CALCULATED_BIRTHDATE,
    },
    birthdate,
  };

  if (!session.has("name")) {
    return json(values, {
      headers: {
        "set-cookie": await destroySession(session),
      },
    });
  }

  const { data } = session;

  return { session: data, ...values };
};

export const meta: MetaFunction = () => [
  { title: pkg.short_name },
  { name: "description", content: pkg.description },
];

export default function App() {
  const data = useLoaderData<typeof loader>();
  const [isLockDateReached, setIsLockDateReached] = useState(
    dateObject(new Date().toISOString()) >
      lockDate(data.ENV.CALCULATED_BIRTHDATE)
  );

  useEffect(() => {
    const interval = setInterval(
      () =>
        setIsLockDateReached(
          dateObject(new Date().toISOString()) >
            lockDate(data.ENV.CALCULATED_BIRTHDATE)
        ),
      ONE_MINUTE * 10
    );

    return () => {
      clearInterval(interval);
    };
  }, [data.ENV.CALCULATED_BIRTHDATE]);

  const value: BirthdateContextValue = useMemo(
    () => ({
      ...(data.birthdate?.date
        ? {
            birthdate: dateObject(data.birthdate.date),
            isGameOver: true,
            sex: data.birthdate.sex,
          }
        : { isGameOver: false }),
      calculatedBirthdate: dateObject(data.ENV.CALCULATED_BIRTHDATE),
      isLockDateReached,
      lockDate: lockDate(data.ENV.CALCULATED_BIRTHDATE),
    }),
    [data, isLockDateReached]
  );

  return (
    <html lang="de">
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
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#00667a" />
        <meta name="msapplication-TileColor" content={pkg.color} />
        <meta name="theme-color" content={pkg.color} />
        <Meta />
        <Links />
      </head>
      <body>
        <SessionContext.Provider value={data?.session ?? null}>
          <BirthdateContext.Provider value={value}>
            <Outlet />
            <Footer />
          </BirthdateContext.Provider>
        </SessionContext.Provider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
