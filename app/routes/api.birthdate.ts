import { Database } from "@/deno/postgres";
import { GuessData } from "@/deno/postgres/types";
import { ServerError } from "@/utils/error";
import { validateBasicAuth } from "@/utils/login";
import {
  ActionFunction,
  json,
  LoaderFunction,
} from "@remix-run/server-runtime";

export const ADMIN = "admin";
export const BIRTHDATE = "birthdate";

const parseBody = async (request: Request): Promise<GuessData> => {
  const body = await request.formData();

  if (!body.has("date") || !body.has("sex")) {
    throw json(
      { error: "Schätzung muss ein Datum & Geschlecht beinhalten." },
      { status: 400 },
    );
  }

  return {
    ...Object.fromEntries(body) as Pick<GuessData, "date" | "sex">,
    id: BIRTHDATE,
  };
};

const createBirthdate = async (request: Request) => {
  const data = await parseBody(request);

  try {
    const db = new Database(process.env.POSTGRES_CONNECTION_STRING);

    const result = await db.createDate(data);

    return json({ data: result });
  } catch (e) {
    console.error(e);

    throw json({ error: (e as Error).message }, {
      status: (e as ServerError).status ?? 500,
    });
  }
};

const updateBirthdate = async (request: Request) => {
  const data = await parseBody(request);

  try {
    const db = new Database(process.env.POSTGRES_CONNECTION_STRING);

    const result = await db.updateDate(data);

    return json({ data: result });
  } catch (e) {
    console.error(e);

    throw json({ error: (e as Error).message }, {
      status: (e as ServerError).status ?? 500,
    });
  }
};

const deleteBirthdate = async () => {
  try {
    const db = new Database(process.env.POSTGRES_CONNECTION_STRING);

    const result = await db.deleteDate(BIRTHDATE);

    return json({ data: result });
  } catch (e) {
    console.error(e);

    throw json({ error: (e as Error).message }, {
      status: (e as ServerError).status ?? 500,
    });
  }
};

export const action: ActionFunction = async ({ request }) => {
  validateBasicAuth(
    request,
    process.env.MASTER_PASSWORD,
    ADMIN,
  );

  switch (request.method) {
    case "POST":
      return createBirthdate(request);
    case "PUT":
      return updateBirthdate(request);
    case "DELETE":
      return deleteBirthdate();
    default:
      throw json({ error: "Method Not Allowed" }, {
        status: 405,
        headers: { allow: ["GET", "POST", "PUT", "DELETE", "HEAD"].join(", ") },
      });
  }
};

export const loader: LoaderFunction = async () => {
  const db = new Database(process.env.POSTGRES_CONNECTION_STRING);

  const guess = await db.getDate(BIRTHDATE);

  return json({ data: guess });
};
