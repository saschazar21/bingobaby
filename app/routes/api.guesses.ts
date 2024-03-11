import { Database } from "@/deno/postgres";
import { Guess } from "@/deno/postgres/types";
import { ServerError } from "@/utils/error";
import { getUser } from "@/utils/login";
import { ActionFunction, json, LoaderFunction } from "@netlify/remix-runtime";

export const action: ActionFunction = async ({ request }) => {
  const name = await getUser(request);

  if (request.method !== "POST") {
    throw json({ error: "Method Not Allowed." }, {
      status: 405,
      headers: {
        "allow": "GET, POST, HEAD",
      },
    });
  }

  const body = await request.formData();

  if (!body.has("date") || !body.has("sex")) {
    throw json(
      { error: "Schätzung muss ein Datum & Geschlecht beinhalten." },
      { status: 400 },
    );
  }

  const db = new Database(process.env.POSTGRES_CONNECTION_STRING);

  try {
    const guess = await db.createGuess({
      ...Object.fromEntries(body) as Pick<Guess, "date" | "sex">,
      name,
    });

    return json({ data: guess });
  } catch (e) {
    console.error(e);

    throw json({ error: (e as Error).message }, {
      status: (e as ServerError).status ?? 500,
    });
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);

  const db = new Database(process.env.POSTGRES_CONNECTION_STRING);

  const guesses = await db.getGuessesByName(user);

  return json({ data: guesses });
};
