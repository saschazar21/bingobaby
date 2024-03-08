import { Database } from "@/deno/postgres";
import { Guess } from "@/deno/postgres/types";
import { getUser } from "@/utils/login";
import { ActionFunction, json, LoaderFunction } from "@netlify/remix-runtime";

const updateGuess = async (
  request: Request,
  data: Pick<Guess, "id" | "name">,
) => {
  const body = await request.formData();

  if (!body.has("date") && !body.has("sex")) {
    throw json({
      error:
        "Entweder Datum oder Geschlecht müssen für eine Änderung der Schätzung angegeben werden.",
    }, { status: 400 });
  }

  try {
    const update = { ...Object.fromEntries(body), ...data };

    const db = new Database(process.env.POSTGRES_CONNECTION_STRING);

    const result = await db.updateGuess(update);

    return json({ data: result });
  } catch (e) {
    console.error(e);

    throw json({ error: (e as Error).message }, { status: 400 });
  }
};

const deleteGuess = async (data: Pick<Guess, "id" | "name">) => {
  try {
    const db = new Database(process.env.POSTGRES_CONNECTION_STRING);

    const result = await db.deleteGuess(data);

    return json({ data: result });
  } catch (e) {
    console.error(e);

    throw json({ error: (e as Error).message }, { status: 400 });
  }
};

export const action: ActionFunction = async ({ request, params }) => {
  if (params.id?.length) {
    throw json({ error: "ID der Schätzung muss angegeben werden." }, {
      status: 400,
    });
  }

  const name = await getUser(request);

  switch (request.method) {
    case "PUT":
      return updateGuess(request, { id: params.id as string, name });
    case "DELETE":
      return deleteGuess({ id: params.id as string, name });
    default:
      throw json({ error: "Method Not Allowed." }, {
        status: 405,
        headers: { allow: "GET, PUT, DELETE, HEAD" },
      });
  }
};

export const loader: LoaderFunction = async ({ params }) => {
  if (!params.id?.length) {
    throw json({ error: "ID der Schätzung muss angegeben werden." }, {
      status: 400,
    });
  }

  const db = new Database(process.env.POSTGRES_CONNECTION_STRING);

  const guess = await db.getGuess(params.id);

  if (!guess) {
    throw json({ error: "Not Found." }, { status: 404 });
  }

  return json({ data: guess });
};
