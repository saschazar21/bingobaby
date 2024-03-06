import { createCookieSessionStorage } from "@remix-run/deno";
import { sessionCookie } from "./cookie";
import { Browser } from "./browser";

export interface SessionData extends Browser {
  id: string;
}

export interface SessionFlashData {
  error: string;
}

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: sessionCookie,
  });
