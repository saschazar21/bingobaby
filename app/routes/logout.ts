import { Database } from "@/deno/postgres";
import { destroySession, getSession } from "@/utils/session";
import { LoaderFunction, redirect } from "@netlify/remix-runtime";

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("cookie");
  const session = await getSession(cookieHeader);

  return redirect("/", {
    headers: {
      "set-cookie": await destroySession(session),
    },
  });
};
