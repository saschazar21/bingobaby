import { FC } from "react";

import styles from "./LoginForm.module.css";

export interface LoginFormProps {}

export const LoginForm: FC<LoginFormProps> = () => {
  return (
    <form className={styles.form} method="POST" action="/login">
      <h2 className={styles.heading}>Login</h2>
      <input name="name" autoFocus required placeholder="Vorname Nachname" />
      <button className={styles.submit} type="submit">
        Einloggen
      </button>
    </form>
  );
};
