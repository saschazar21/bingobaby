import {
  ActionFunction,
  createSession,
  LoaderFunction,
  redirect,
} from "@remix-run/deno";
import { Database } from "@/deno/postgres";
import { parseBrowserDetails } from "@/utils/browser";
import { SESSION_COOKIE_EXPIRE_DURATION } from "@/utils/cookie";
import { commitSession, SessionData, SessionFlashData } from "@/utils/session";

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: {
        allow: "POST",
      },
    });
  }

  const browser = parseBrowserDetails(
    request.headers.get("user-agent") as string,
  );

  const body = await request.formData();

  try {
    if (!body.has("name") || !(body.get("name") as string).length) {
      throw new Error("Das Loginfeld muss ausgefüllt sein.");
    }

    const db = new Database(process.env.POSTGRES_CONNECTION_STRING);

    const result = await db.createSession(body.get("name") as string, browser);

    if (!result?.id?.length) {
      throw new Error("Der Loginversuch ist fehlgeschlagen.");
    }

    const session = createSession<SessionData>(result);

    return redirect("/", {
      headers: {
        "set-cookie": await commitSession(session, {
          expires: new Date(Date.now() + SESSION_COOKIE_EXPIRE_DURATION),
        }),
      },
    });
  } catch (e) {
    const session = createSession<never, SessionFlashData>();
    session.flash("error", (e as Error).message);

    return redirect("/", {
      headers: { "set-cookie": await commitSession(session) },
    });
  }
};

export const loader: LoaderFunction = () => {
  return new Response("Method Not Allowed", {
    status: 405,
    headers: {
      allow: "POST",
    },
  });
};
