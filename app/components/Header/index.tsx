import { DetailedHTMLProps, FC, ReactElement } from "react";
import classNames from "clsx";
import { BabyIcon } from "@/components/BabyIcon";
import { LoginForm } from "@/components/LoginForm";
import { UserInfo } from "@/components/UserInfo";
import { useSessionContext } from "@/contexts/SessionContext";

import styles from "./Header.module.css";

export interface HeaderProps {
  children: ReactElement<
    DetailedHTMLProps<
      React.VideoHTMLAttributes<HTMLVideoElement>,
      HTMLVideoElement
    >
  >;
}

export const Header: FC<HeaderProps> = ({ children }) => {
  const session = useSessionContext();
  const className = classNames("container", styles.container);

  return (
    <header data-full-bleed>
      <div className={className}>
        <div>{children}</div>
        <div className={styles.content}>
          <BabyIcon className={styles.baby} />
          {session?.name ? <UserInfo /> : <LoginForm prefix="top" />}
        </div>
      </div>
    </header>
  );
};
