import { FC, ReactNode } from "react";
import { useFieldState } from "informed";

import styles from "./RadioGroup.module.css";

export interface RadioGroupProps {
  children: ReactNode | ReactNode[];
  label: string;
  name: string;
}

export const RadioGroup: FC<RadioGroupProps> = (props) => {
  const { error, showError: isErrorShown } = useFieldState(props.name);

  return (
    <fieldset className={styles.wrapper}>
      <legend className={styles.label}>{props.label}</legend>
      {props.children}
      {isErrorShown && !!error ? (
        <small role="alert">{error as string}</small>
      ) : null}
    </fieldset>
  );
};
