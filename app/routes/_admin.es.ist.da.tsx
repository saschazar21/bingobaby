import { BirthdateForm } from "@/components/BirthdateForm";
import { useBirthDateContext } from "@/contexts/BirthdateContext";
import {
  BirthdateEditContextProvider,
  useBirthdateEditContext,
} from "@/contexts/BirthdateEditContext";
import { useLazyApi } from "@/hooks/useApi";
import { redirectCookie } from "@/utils/cookie";
import { adminSession } from "@/utils/session";
import { useLoaderData } from "@remix-run/react";
import { LoaderFunction, json, redirect } from "@remix-run/server-runtime";
import { FC, MouseEventHandler, useCallback, useMemo } from "react";
import classNames from "clsx";
import { ADMIN, BIRTHDATE } from "./api.birthdate";

import styles from "./styles/es.ist.da.module.css";

const LOGIN_URL = "/es/ist/loginzeit";

const DeleteDate: FC = () => {
  const [birthdate, setBirthdate, auth] = useBirthdateEditContext() ?? [];
  const { submit } = useLazyApi("/api/birthdate", "DELETE");

  const handleClick: MouseEventHandler = useCallback(async () => {
    submit(null, { authorization: `Basic ${auth}` }).then(() => {
      typeof setBirthdate === "function" && setBirthdate(null);
    });
  }, [auth, setBirthdate, submit]);

  const className = classNames(styles.container, "container");

  return (
    birthdate && (
      <div className={className} data-alert>
        <div className={styles.wrapper}>
          <span>
            <strong>Eintrag löschen?</strong> Damit wird das Geburtsdatum wieder
            aus dem Spiel entfernt.
          </span>
          <button type="button" onClick={handleClick}>
            Löschen
          </button>
        </div>
      </div>
    )
  );
};

export const loader: LoaderFunction = async ({ request }) => {
  const { pathname } = new URL(request.url);
  const session = await adminSession.getSession(request.headers.get("cookie"));

  if (!session.has("isAdmin")) {
    session.flash("error", "Bitte gib das Admin-Passwort ein.");

    throw redirect(LOGIN_URL, {
      status: 302,
      headers: [
        ["set-cookie", await adminSession.commitSession(session)],
        ["set-cookie", await redirectCookie.serialize(pathname)],
      ],
    });
  }

  return json({ auth: btoa(`${ADMIN}:${process.env.MASTER_PASSWORD}`) });
};

const BirthdatePage: FC = () => {
  const { auth } = useLoaderData<typeof loader>();
  const data = useBirthDateContext();

  const birthdate = useMemo(
    () =>
      data?.birthdate
        ? {
            id: BIRTHDATE,
            date: data?.birthdate.toISOString(),
            sex: data?.sex as "female" | "male",
          }
        : null,
    [data?.birthdate, data?.sex]
  );

  const className = classNames(styles.container, "container");

  return (
    <main>
      <h1>Es ist da!</h1>
      <p>
        Setze das Geschlecht und das Geburtsdatum im Formular, um das Spiel zu
        beenden und den Gewinner zu ermitteln.
      </p>
      <BirthdateEditContextProvider birthdate={birthdate} auth={auth}>
        <div data-full-bleed>
          <DeleteDate />
          <div className={className}>
            <div className={styles.wrapper}>
              <BirthdateForm />
            </div>
          </div>
        </div>
      </BirthdateEditContextProvider>
    </main>
  );
};

export default BirthdatePage;
