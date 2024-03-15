import { FieldProps } from "informed";
import { UserProps, useDateTime } from "./useDateTime";
import { FC } from "react";

import styles from "./DateTime.module.css";

export interface DateTimeProps extends FieldProps<UserProps> {}

export const DateTime: FC<DateTimeProps> = (props) => {
  const { render, handleChange, userProps, value } = useDateTime(props);

  const { label, ...rest } = userProps;

  return render(
    <label className={styles.wrapper} htmlFor={props.id}>
      <span>{label}</span>
      <input {...rest} value={value as string} onChange={handleChange} />
      <small>
        Hinweis: ein Klick auf das Kalendersymbol öffnet die Kalendervorschau.
      </small>
    </label>
  );
};
