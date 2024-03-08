import { createCookie } from "@netlify/remix-runtime";
import { ONE_HOUR, ONE_WEEK } from "./day";

export const REDIRECT_COOKIE_EXPIRE_DURATION = ONE_HOUR;
export const SESSION_COOKIE_EXPIRE_DURATION = ONE_WEEK;

export const redirectCookie = createCookie("redirect_to", {
  httpOnly: true,
  maxAge: Math.floor(REDIRECT_COOKIE_EXPIRE_DURATION * 0.001),
  path: "/",
  sameSite: "lax",
  secure: true,
});

export const sessionCookie = createCookie("session", {
  httpOnly: true,
  maxAge: Math.floor(SESSION_COOKIE_EXPIRE_DURATION * 0.001),
  path: "/",
  sameSite: true,
  secrets: [process.env.COOKIE_SIGNATURE_PASSWORD],
  secure: true,
});
