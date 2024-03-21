import { adminSession } from "@/utils/session";
import { useLoaderData } from "@remix-run/react";
import { LoaderFunction, json } from "@remix-run/server-runtime";
import { FC } from "react";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await adminSession.getSession(request.headers.get("cookie"));

  return json({ session });
};

const BirthdatePage: FC = () => {
  const { session } = useLoaderData<typeof loader>();

  return JSON.stringify(session);
};

export default BirthdatePage;
