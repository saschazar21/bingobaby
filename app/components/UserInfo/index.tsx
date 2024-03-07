import { useSessionContext } from "@/contexts/SessionContext";
import { FC } from "react";
import classNames from "clsx";

import styles from "./UserInfo.module.css";
import { PiArrowRightBold } from "react-icons/pi";

export interface UserInfoProps {}

export const UserInfo: FC<UserInfoProps> = () => {
  const session = useSessionContext() as { name: string };

  const className = classNames("button", styles.button);

  return (
    <div className={styles.wrapper}>
      <span className={styles.info}>
        <span>
          Eingeloggt als <b>{session.name}</b>.
        </span>{" "}
        <a className={styles.logout} href="/logout">
          Ausloggen?
        </a>
      </span>
      <a className={className} href="/mitspielen">
        <span>Jetzt mitspielen</span>
        <PiArrowRightBold />
      </a>
    </div>
  );
};
