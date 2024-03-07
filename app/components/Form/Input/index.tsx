import { FieldProps, useField } from "informed";
import { FC } from "react";

import styles from "./Input.module.css";

export interface UserProps {
  autoFocus?: boolean;
  className?: string;
  id?: string;
  placeholder?: string;
}

export interface InputProps extends FieldProps<UserProps> {}

export const Input: FC<InputProps> = (props) => {
  const config = {
    type: "text",
    ...props,
  };

  const { render, informed } = useField<UserProps, string>(config);

  return render(
    <div className={styles.wrapper}>
      <input
        type={config.type}
        name={config.name}
        id={config.id}
        placeholder={config.placeholder}
        {...informed}
      />
    </div>
  );
};
