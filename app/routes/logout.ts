import { Database } from "@/deno/postgres";
import { destroySession, getSession } from "@/utils/session";
import { LoaderFunction, redirect } from "@remix-run/deno";

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("cookie");
  const session = await getSession(cookieHeader);

  try {
    if (session?.id) {
      const db = new Database(process.env.POSTGRES_CONNECTION_STRING);

      await db.expireSession(session.id);
    }
  } catch (e) {
    console.error(e);
  } finally {
    return redirect("/", {
      headers: {
        "set-cookie": await destroySession(session),
      },
    });
  }
};
