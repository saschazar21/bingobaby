import {
  ActionFunction,
  createSession,
  LoaderFunction,
  redirect,
} from "@netlify/remix-runtime";
import { parseBrowserDetails } from "@/utils/browser";
import { redirectCookie, SESSION_COOKIE_EXPIRE_DURATION } from "@/utils/cookie";
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

  const redirectPath = await redirectCookie.parse(
    request.headers.get("cookie"),
  );

  const browser = parseBrowserDetails(
    request.headers.get("user-agent") as string,
  );

  const body = await request.formData();

  try {
    if (!body.has("name") || !(body.get("name") as string).length) {
      throw new Error("Das Loginfeld muss ausgefüllt sein.");
    }

    const session = createSession<Partial<SessionData>, SessionFlashData>({
      name: body.get("name") as string,
      browser,
    });

    return redirect(redirectPath ?? "/mitspielen", {
      headers: [
        [
          "set-cookie",
          await commitSession(session, {
            expires: new Date(Date.now() + SESSION_COOKIE_EXPIRE_DURATION),
          }),
        ],
        [
          "set-cookie",
          await redirectCookie.serialize("", {
            expires: new Date(0),
            maxAge: 0,
          }),
        ],
      ],
    });
  } catch (e) {
    console.error(e);

    const session = createSession<Partial<SessionData>, SessionFlashData>({
      browser,
    });
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
