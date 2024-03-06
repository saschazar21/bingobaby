import { createCookie } from "@remix-run/deno";
import { ONE_WEEK } from "./day";

export const SESSION_COOKIE_EXPIRE_DURATION = ONE_WEEK;

export const sessionCookie = createCookie("session", {
  httpOnly: true,
  maxAge: Math.floor(SESSION_COOKIE_EXPIRE_DURATION * 0.001),
  path: "/",
  sameSite: true,
  secrets: [process.env.COOKIE_SIGNATURE_PASSWORD],
  secure: true,
});
