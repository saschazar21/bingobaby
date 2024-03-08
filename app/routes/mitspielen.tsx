import { Header } from "@/components/Header";
import { UserInfo } from "@/components/UserInfo";
import { ensureLoggedIn } from "@/utils/login";
import { LoaderFunction } from "@netlify/remix-runtime";
import { FC } from "react";

export const loader: LoaderFunction = async ({ request }) => {
  await ensureLoggedIn(request);

  return null;
};

const Mitspielen: FC = () => {
  return (
    <>
      <Header video="baby-egg">
        <UserInfo />
      </Header>
      <main>
        <h1>Deine Schätzungen</h1>
      </main>
    </>
  );
};

export default Mitspielen;
