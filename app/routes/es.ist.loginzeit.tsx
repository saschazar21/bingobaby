import { ADMIN_COOKIE_EXPIRE_DURATION, redirectCookie } from "@/utils/cookie";
import { adminSession } from "@/utils/session";
import { useLoaderData } from "@remix-run/react";
import {
  ActionFunction,
  LoaderFunction,
  json,
  redirect,
} from "@remix-run/server-runtime";
import { FC, useId } from "react";

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

  return redirect(redirectTo ?? FALLBACK_REDIRECT_URL, {
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
          await redirectCookie.serialize("", {
            expires: new Date(0),
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
  const passwordId = useId();

  return (
    <main>
      <h1>Admin Login</h1>
      <p>Einloggen, um in den Sicherheitsbereich zu kommen.</p>
      <form id="login" method="POST" action={pathname}>
        <label htmlFor={passwordId} data-sr-only>
          Passwort eingeben:
        </label>
        <input
          id={passwordId}
          type="password"
          name="password"
          placeholder="Passwort"
        />
        <div>
          <button type="reset">Zurücksetzen</button>
          <button type="submit">Einloggen</button>
        </div>
      </form>
    </main>
  );
};

export default LoginZeit;
