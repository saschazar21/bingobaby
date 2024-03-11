import { Database } from "@/deno/postgres";
import { ServerError } from "@/utils/error";
import { json, LoaderFunction } from "@netlify/remix-runtime";

export const loader: LoaderFunction = async () => {
  try {
    const db = new Database(process.env.POSTGRES_CONNECTION_STRING);

    const data = await db.getAllValidGuesses();

    return json({ data });
  } catch (e) {
    console.error(e);

    throw json({ error: (e as Error).message }, {
      status: (e as ServerError).status ?? 500,
    });
  }
};
