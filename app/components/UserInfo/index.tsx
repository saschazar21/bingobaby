import { useSessionContext } from "@/contexts/SessionContext";
import { Link } from "@remix-run/react";
import { FC } from "react";

import styles from "./UserInfo.module.css";

export interface UserInfoProps {}

export const UserInfo: FC<UserInfoProps> = () => {
  const session = useSessionContext() as { name: string };

  return (
    <span className={styles.info}>
      <span>
        Eingeloggt als <b>{session.name}</b>.
      </span>{" "}
      <Link className={styles.logout} to="/logout">
        Ausloggen?
      </Link>
    </span>
  );
};
