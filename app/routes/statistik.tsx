import { SexDistribution } from "@/components/Charts/SexDistribution";
import { Header } from "@/components/Header";
import { GuessContextProvider } from "@/contexts/GuessContext";
import { Database } from "@/deno/postgres";
import { Link, useLoaderData } from "@remix-run/react";
import { LoaderFunction, json } from "@remix-run/server-runtime";
import { FC } from "react";

export const loader: LoaderFunction = async () => {
  try {
    const db = new Database(process.env.POSTGRES_CONNECTION_STRING);

    const guesses = await db.getAllGuesses();

    return json({ guesses });
  } catch (e) {
    console.error(e);

    return json({ guesses: [] });
  }
};

const Statistik: FC = () => {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <Header video="baby-aim">
        <Link to="/">Zur Startseite</Link>
      </Header>
      <main>
        <h1>Statistik</h1>
        <GuessContextProvider guesses={data.guesses} maxGuesses={0}>
          <SexDistribution />
        </GuessContextProvider>
      </main>
    </>
  );
};

export default Statistik;
