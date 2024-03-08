import { Header } from "@/components/Header";
import { UserInfo } from "@/components/UserInfo";
import { Database } from "@/deno/postgres";
import { ensureLoggedIn } from "@/utils/login";
import { LoaderFunction, json } from "@netlify/remix-runtime";
import { useLoaderData } from "@remix-run/react";
import { FC } from "react";

export const loader: LoaderFunction = async ({ request }) => {
  const name = await ensureLoggedIn(request);

  try {
    const db = new Database(process.env.POSTGRES_CONNECTION_STRING);

    const guesses = await db.getGuessesByName(name);

    return json({ guesses });
  } catch (e) {
    console.error(e);
  }

  return null;
};

const Mitspielen: FC = () => {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <Header video="not-the-mama">
        <UserInfo />
      </Header>
      <main>
        <h1>Deine Schätzungen</h1>
      </main>
    </>
  );
};

export default Mitspielen;
