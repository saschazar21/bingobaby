import { FieldProps, useField } from "informed";
import { FC } from "react";
import { UserProps, useBidirectional } from "./useBidirectional";

import styles from "./Bidirectional.module.css";

export interface BidirectionalProps extends FieldProps<UserProps> {}

export const Bidirectional: FC<BidirectionalProps> = (props) => {
  const { handleChange, render, type, value } = useBidirectional(props);

  return render(
    <div className={styles.wrapper}>
      {props.min.el}
      <div className={styles.container}>
        <label htmlFor={props.id} data-sr-only>
          {props.label}
        </label>
        <input
          className={styles.input}
          type={type}
          name={props.name}
          id={props.id}
          min="1"
          max="3"
          step="1"
          value={value as string}
          onChange={handleChange}
        />
      </div>
      {props.max.el}
    </div>
  );
};
