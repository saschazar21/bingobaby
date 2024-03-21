import { Database } from "@/deno/postgres";
import {
  createCookieSessionStorage,
  createSessionStorage,
} from "@netlify/remix-runtime";
import { adminCookie, sessionCookie } from "./cookie";
import { Browser } from "./browser";

export interface AdminSessionData {
  isAdmin: boolean;
}

export interface SessionData {
  browser: Browser;
  name?: string;
}

export interface SessionFlashData {
  error: string;
}

const createData = async (
  data: Partial<SessionData & { __flash_error__: string }>,
) => {
  const db = new Database(process.env.POSTGRES_CONNECTION_STRING);
  const { name, __flash_error__: error, browser } = data;

  try {
    const { id }: { id: string } = await db.createSession({
      browser: browser as Browser,
      error,
      name,
    });

    return id;
  } catch (e) {
    console.error(e);

    return db.createSession({
      browser: browser as Browser,
      error: (e as Error).message,
    }).then(({ id }) => id).catch(() => "");
  }
};

const readData = async (
  id: string,
): Promise<{ name?: string; error?: string } | null> => {
  try {
    const db = new Database(process.env.POSTGRES_CONNECTION_STRING);

    const session = await db.getSession(id);

    return session;
  } catch (e) {
    return null;
  }
};

const updateData = async (
  id: string,
  data: Partial<SessionData & { __flash_error__: string }>,
) => {
  const { name, __flash_error__: error, browser } = data;

  const db = new Database(process.env.POSTGRES_CONNECTION_STRING);

  return db.updateSession(id, { name, error, browser: browser?.user_agent })
    .catch(() => null);
};

const deleteData = async (id: string) => {
  const db = new Database(process.env.POSTGRES_CONNECTION_STRING);

  return db.expireSession(id).catch(() => {});
};

export const { getSession, commitSession, destroySession } =
  createSessionStorage<SessionData, SessionFlashData>({
    cookie: sessionCookie,
    createData,
    readData,
    updateData,
    deleteData,
  });

export const adminSession = createCookieSessionStorage<
  AdminSessionData,
  SessionFlashData
>({
  cookie: adminCookie,
});
