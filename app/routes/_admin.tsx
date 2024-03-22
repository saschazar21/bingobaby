import { adminSession } from "@/utils/session";
import { Outlet, useLoaderData } from "@remix-run/react";
import { LoaderFunction, json } from "@remix-run/server-runtime";
import { FC } from "react";
import { ADMIN } from "./api.birthdate";
import { SessionContext } from "@/contexts/SessionContext";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await adminSession.getSession(request.headers.get("cookie"));

  return json({
    session: {
      name: session.has("isAdmin") ? ADMIN : null,
      error: session.get("error"),
    },
  });
};

export const AdminLayout: FC = () => {
  const { session } = useLoaderData<typeof loader>();

  return (
    <SessionContext.Provider value={session}>
      <Outlet />
    </SessionContext.Provider>
  );
};

export default AdminLayout;
