import { Error } from "@/components/Error";
import { useSessionContext } from "@/contexts/SessionContext";
import { ADMIN_COOKIE_EXPIRE_DURATION, redirectCookie } from "@/utils/cookie";
import { adminSession } from "@/utils/session";
import { useLoaderData } from "@remix-run/react";
import {
  ActionFunction,
  LoaderFunction,
  json,
  redirect,
} from "@remix-run/server-runtime";
import {
  ChangeEventHandler,
  FC,
  FocusEventHandler,
  MouseEventHandler,
  useCallback,
  useDeferredValue,
  useId,
  useState,
} from "react";
import classNames from "clsx";

import styles from "./styles/es.ist.loginzeit.module.css";

const FALLBACK_REDIRECT_URL = "/es/ist/da";

export const action: ActionFunction = async ({ request }) => {
  const { pathname } = new URL(request.url);
  const session = await adminSession.getSession(request.headers.get("cookie"));
  const redirectTo = await redirectCookie.parse(request.headers.get("cookie"));

  if (request.method !== "POST") {
    throw json(
      { error: "Method Not Allowed." },
      { status: 405, headers: { allow: "GET, POST, HEAD" } }
    );
  }

  let password = "";

  try {
    const body = await request.formData();

    password = body.get("password") as string;
  } catch (e) {
    console.error(e);

    throw json({ error: "Failed to parse form body." }, { status: 400 });
  }

  if (password !== process.env.MASTER_PASSWORD) {
    session.unset("isAdmin");
    session.flash("error", "Falsches Passwort eingegeben.");

    throw redirect(pathname, {
      status: 302,
      headers: [
        [
          "set-cookie",
          await adminSession.commitSession(session, {
            expires: new Date(Date.now() + ADMIN_COOKIE_EXPIRE_DURATION),
          }),
        ],
      ],
    });
  }

  session.set("isAdmin", true);

  return redirect(
    redirectTo && redirectTo !== pathname ? redirectTo : FALLBACK_REDIRECT_URL,
    {
      status: 302,
      headers: [
        [
          "set-cookie",
          await adminSession.commitSession(session, {
            expires: new Date(Date.now() + ADMIN_COOKIE_EXPIRE_DURATION),
          }),
        ],
        [
          "set-cookie",
          await redirectCookie.serialize(null, {
            expires: new Date(0),
            maxAge: 0,
          }),
        ],
      ],
    }
  );
};

export const loader: LoaderFunction = async ({ request }) => {
  const { pathname } = new URL(request.url);
  const session = await adminSession.getSession(request.headers.get("cookie"));
  const redirectTo = await redirectCookie.parse(request.headers.get("cookie"));

  if (session.has("isAdmin") && redirectTo) {
    return redirect(redirectTo, {
      status: 302,
      headers: [
        [
          "set-cookie",
          await adminSession.commitSession(session, {
            expires: new Date(Date.now() + ADMIN_COOKIE_EXPIRE_DURATION),
          }),
        ],
        [
          "set-cookie",
          await redirectCookie.serialize(null, {
            expires: new Date(0),
            maxAge: 0,
          }),
        ],
      ],
    });
  }

  return json(
    { pathname },
    { headers: [["set-cookie", await adminSession.destroySession(session)]] }
  );
};

const LoginZeit: FC = () => {
  const { pathname } = useLoaderData<typeof loader>();
  const session = useSessionContext();
  const passwordId = useId();

  const [isErrorShown, setIsErrorShown] = useState(true);
  const [value, setValue] = useState("");

  const deferredValue = useDeferredValue(value);

  const handleBlur: FocusEventHandler<HTMLInputElement> = useCallback(() => {
    !deferredValue?.length && setIsErrorShown(true);
  }, [deferredValue?.length]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => setValue(e.target.value),
    []
  );

  const handleFocus: FocusEventHandler<HTMLInputElement> = useCallback(() => {
    setIsErrorShown(false);
  }, []);

  const handleClose: MouseEventHandler<HTMLButtonElement> = useCallback(() => {
    setIsErrorShown(false);
  }, []);

  const className = classNames(styles.container, "container");

  return (
    <main>
      <h1>Admin Login</h1>
      <p>Einloggen, um den Sicherheitsbereich zu betreten.</p>
      <div data-full-bleed>
        <div className={className}>
          <form
            className={styles.form}
            id="login"
            method="POST"
            action={pathname}
          >
            <label htmlFor={passwordId} data-sr-only>
              Passwort eingeben:
            </label>
            <input
              id={passwordId}
              type="password"
              name="password"
              placeholder="Passwort"
              onBlur={handleBlur}
              onChange={handleChange}
              onFocus={handleFocus}
              value={value}
              required
            />
            <div className={styles.buttons}>
              <button type="reset">Zurücksetzen</button>
              <button type="submit" disabled={!deferredValue?.length}>
                Einloggen
              </button>
            </div>
            {session?.error && isErrorShown ? (
              <Error onClose={handleClose}>{session.error}</Error>
            ) : null}
          </form>
        </div>
      </div>
    </main>
  );
};

export default LoginZeit;
