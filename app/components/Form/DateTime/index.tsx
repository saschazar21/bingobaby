import { FieldProps } from "informed";
import { UserProps, useDateTime } from "./useDateTime";
import { FC } from "react";

import styles from "./DateTime.module.css";

export interface DateTimeProps extends FieldProps<UserProps> {}

export const DateTime: FC<DateTimeProps> = (props) => {
  const { render, handleChange, userProps, value } = useDateTime(props);

  return render(
    <div className={styles.wrapper}>
      <label htmlFor={props.id}>{props.label}</label>
      <input {...userProps} value={value as string} onChange={handleChange} />
    </div>
  );
};
