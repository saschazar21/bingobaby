import { FC, useCallback } from "react";
import { Error } from "@/components/Error";
import { useLoginContext } from "@/contexts/LoginContext";
import { LoginFormHook } from "@/contexts/LoginContext/useLoginForm";

import styles from "./LoginForm.module.css";

export interface LoginFormProps {
  autoFocus?: boolean;
  prefix: string;
}

export const LoginForm: FC<LoginFormProps> = (props) => {
  const { handleBlur, handleChange, handleFocus, state } =
    useLoginContext() as LoginFormHook;

  const getPrefixedId = useCallback(
    (id: string) => `${props.prefix}-${id}`,
    []
  );

  return (
    <form className={styles.form} method="POST" action="/login">
      <h2 className={styles.heading}>Login</h2>
      <div className={styles.wrapper}>
        <label htmlFor={getPrefixedId("name")} data-sr-only>
          Name
        </label>
        <input
          id={getPrefixedId("name")}
          name="name"
          required
          placeholder="Vorname Nachname"
          value={state.value}
          onBlur={handleBlur}
          onFocusCapture={handleFocus}
          onChange={handleChange}
        />
        {state.error && state.isErrorShown ? (
          <Error>{state.error}</Error>
        ) : null}
      </div>
      <button
        disabled={!state.isPristine && !state.isValid}
        className={styles.submit}
        type="submit"
      >
        Einloggen
      </button>
    </form>
  );
};
