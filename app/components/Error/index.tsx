import { FC, MouseEventHandler, ReactNode } from "react";
import classNames from "clsx";
import { PiXBold } from "react-icons/pi";

import styles from "./Error.module.css";

export const DEFAULT_ERROR_LIFETIME = 5000;

export interface ErrorProps {
  children: ReactNode | ReactNode[];
  onClose?: MouseEventHandler<HTMLButtonElement>;
}

export const Error: FC<ErrorProps> = ({ children, onClose }) => {
  const className = classNames("icon-button", styles.close);

  return (
    <small className={styles.error} role="alert">
      <span>{children}</span>
      <button onClick={onClose} className={className} type="button">
        <PiXBold title="Schließen" />
      </button>
    </small>
  );
};
