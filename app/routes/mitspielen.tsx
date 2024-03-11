import { GuessTable } from "@/components/Guesses/GuessTable";
import { Header } from "@/components/Header";
import { UserInfo } from "@/components/UserInfo";
import { BirthdateContext } from "@/contexts/BirthdateContext";
import { GuessContextProvider } from "@/contexts/GuessContext";
import { GuessEditContextProvider } from "@/contexts/GuessEditContext";
import { Database } from "@/deno/postgres";
import { Guess } from "@/deno/postgres/types";
import { MAX_GUESSES } from "@/utils/constants";
import { ONE_HOUR } from "@/utils/day";
import { ensureLoggedIn } from "@/utils/login";
import { LoaderFunction, json } from "@netlify/remix-runtime";
import { useLoaderData } from "@remix-run/react";
import { FC, useContext, useEffect, useMemo, useState } from "react";

import styles from "./styles/mitspielen.module.css";

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

const Mitspielen: FC = () => {
  const data = useLoaderData<{
    guesses?: Guess[];
    id?: string;
    maxGuesses: number;
  }>();
  const birthdateContext = useContext(BirthdateContext);
  const [relativeTime, setRelativeTime] = useState<string>();

  const { isLockDateReached, lockDate } = birthdateContext ?? {};

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

  const info = useMemo(() => {
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
        {(data.guesses?.length ?? 0) < data.maxGuesses ? (
          <p>
            Du hast noch <b>{data.maxGuesses - (data.guesses?.length ?? 0)}</b>{" "}
            von <b>{data.maxGuesses}</b> Schätzungen frei.{" "}
          </p>
        ) : (
          ""
        )}
        <p>
          Du bist nicht sicher? Du kannst deine Schätzungen bis zum{" "}
          <time dateTime={lockDate?.format()}>
            <strong>{relativeTime}</strong>
          </time>{" "}
          noch jederzeit ändern.
        </p>
      </>
    );
  }, [
    data.guesses,
    data.maxGuesses,
    isLockDateReached,
    lockDate,
    relativeTime,
  ]);

  return (
    <GuessContextProvider guesses={data?.guesses} maxGuesses={data.maxGuesses}>
      <Header video="not-the-mama">
        <UserInfo />
      </Header>
      <main>
        <h1>Deine Schätzungen</h1>
        {info}
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
