import { FieldProps } from "informed";
import { FC } from "react";
import { UserProps, useDateTime } from "./useDateTime";

import styles from "./DateTime.module.css";

export interface DateTimeProps extends FieldProps<UserProps> {}

export const DateTime: FC<DateTimeProps> = (props) => {
  const { error, render, handleChange, isErrorShown, userProps, value } =
    useDateTime(props);

  const { label, ...rest } = userProps;

  return render(
    <label className={styles.wrapper} htmlFor={props.id}>
      <span>{label}</span>
      <input
        className={styles.input}
        {...rest}
        value={value as string}
        onChange={handleChange}
      />
      {isErrorShown && !!error && <small role="alert">{error as string}</small>}
      <small className={styles.info}>
        Hinweis: ein Klick auf das Kalendersymbol öffnet die Kalendervorschau.
      </small>
    </label>
  );
};
