import { json, redirect } from "@netlify/remix-runtime";
import { parseBrowserDetails } from "./browser";
import { commitSession, getSession } from "./session";
import {
  REDIRECT_COOKIE_EXPIRE_DURATION,
  redirectCookie,
  SESSION_COOKIE_EXPIRE_DURATION,
} from "./cookie";
import { validateLength, validateSegments } from "./validators";

const activeValidators = [validateLength, validateSegments];

export const formatValue = (name: string) => {
  const trimmed = name.trim();

  activeValidators.forEach((validator) => validator(trimmed));

  return trimmed.split(" ").map((segment) =>
    segment.charAt(0).toUpperCase() + segment.slice(1)
  ).join(" ");
};

export const ensureLoggedIn = async (request: Request) => {
  const { pathname } = new URL(request.url);
  const session = await getSession(request.headers.get("cookie"));
  const browser = parseBrowserDetails(
    request.headers.get("user-agent") as string,
  );

  if (!session.has("name")) {
    session.set("browser", browser);
    session.flash("error", "Bitte einloggen um mitzuspielen.");

    throw redirect("/", {
      headers: [
        [
          "set-cookie",
          await commitSession(session, {
            expires: new Date(Date.now() + SESSION_COOKIE_EXPIRE_DURATION),
          }),
        ],
        [
          "set-cookie",
          await redirectCookie.serialize(pathname, {
            expires: new Date(Date.now() + REDIRECT_COOKIE_EXPIRE_DURATION),
          }),
        ],
      ],
    });
  }

  return session.get("name") as string;
};

export const getUser = async (request: Request) => {
  const { pathname } = new URL(request.url);
  const session = await getSession(request.headers.get("cookie"));

  if (!session.has("name")) {
    throw json({ error: "No valid session found." }, {
      status: 401,
      headers: {
        "www-authenticate": `Basic realm=${pathname}, charset="UTF-8"`,
      },
    });
  }

  return session.get("name") as string;
};
