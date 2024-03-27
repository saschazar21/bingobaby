import { GuessTable } from "@/components/Guesses/GuessTable";
import { Header } from "@/components/Header";
import { UserInfo } from "@/components/UserInfo";
import { BirthdateContext } from "@/contexts/BirthdateContext";
import { GuessContextProvider, useGuessContext } from "@/contexts/GuessContext";
import { GuessEditContextProvider } from "@/contexts/GuessEditContext";
import { Database } from "@/deno/postgres";
import { Guess } from "@/deno/postgres/types";
import { MAX_GUESSES } from "@/utils/constants";
import { ONE_HOUR } from "@/utils/day";
import { ensureLoggedIn } from "@/utils/login";
import { LoaderFunction, json } from "@netlify/remix-runtime";
import { useLoaderData } from "@remix-run/react";
import { FC, useContext, useEffect, useState } from "react";

import styles from "./styles/mitspielen.module.css";
import { ResultsBanner } from "@/components/Results/ResultsBanner";

export const loader: LoaderFunction = async ({ request }) => {
  const name = await ensureLoggedIn(request);

  const { searchParams } = new URL(request.url);
  const maxGuesses = MAX_GUESSES;

  const data = {
    id: searchParams.get("edit"),
    maxGuesses,
  };

  try {
    const db = new Database(process.env.POSTGRES_CONNECTION_STRING);

    const guesses: Guess[] = await db.getGuessesByName(name);

    return json({ ...data, guesses });
  } catch (e) {
    console.error(e);
  }

  return data;
};

const Info: FC = () => {
  const birthdateContext = useContext(BirthdateContext);
  const data = useGuessContext();
  const [relativeTime, setRelativeTime] = useState<string>();

  const { isGameOver, isLockDateReached, lockDate } = birthdateContext ?? {};
  const { state, maxGuesses = 0 } = data ?? {};

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (lockDate) {
      setRelativeTime(lockDate.format("D. MMMM YYYY"));

      interval = setInterval(() => {
        setRelativeTime(lockDate.format("D. MMMM YYYY"));
      }, ONE_HOUR);
    }

    return () => {
      clearInterval(interval);
    };
  }, [lockDate]);

  if (isGameOver) {
    return (
      <>
        <p className="lead">Das Spiel ist aus. Danke für deine Teilnahme!</p>
        <ResultsBanner />
        <p>
          Hier siehst du deine Schätzungen, die für die Wertung herangezogen
          wurden:
        </p>
      </>
    );
  }

  if (isLockDateReached) {
    return (
      <p>
        Die Zeit für Änderungen an deinen Schätzungen ist bereits abgelaufen.
        Folgende Schätzungen sind daher für die Auswertung gesetzt:
      </p>
    );
  }
  return (
    <>
      {(state?.guesses.length ?? 0) < maxGuesses ? (
        <p className="lead">
          Du hast noch <b>{maxGuesses - (state?.guesses.length ?? 0)}</b> von{" "}
          <b>{maxGuesses}</b> Schätzungen frei.{" "}
        </p>
      ) : (
        ""
      )}
      <p>
        Du bist nicht sicher? Du kannst deine Schätzungen bis zum{" "}
        <time dateTime={lockDate?.format()}>
          <strong>{relativeTime}</strong>
        </time>{" "}
        noch jederzeit ändern. Bereits abgelaufene Schätzungen können
        nachträglich jedoch <strong>nicht mehr geändert</strong> werden.
      </p>
    </>
  );
};

const Mitspielen: FC = () => {
  const data = useLoaderData<{
    guesses?: Guess[];
    id?: string;
    maxGuesses: number;
  }>();

  return (
    <GuessContextProvider guesses={data?.guesses} maxGuesses={data.maxGuesses}>
      <Header video="not-the-mama">
        <UserInfo />
      </Header>
      <main>
        <h1>Deine Schätzungen</h1>
        <Info />
        <div className={styles.container}>
          <GuessEditContextProvider id={data.id}>
            <GuessTable />
          </GuessEditContextProvider>
        </div>
      </main>
    </GuessContextProvider>
  );
};

export default Mitspielen;
