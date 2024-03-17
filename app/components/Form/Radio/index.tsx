import { FieldProps } from "informed";
import classNames from "clsx";
import { FC } from "react";
import { UserProps, useRadio } from "./useRadio";

import styles from "./Radio.module.css";

export interface RadioProps extends FieldProps<UserProps> {
  value: string;
}

export const Radio: FC<RadioProps> = ({ value, ...props }) => {
  const {
    handleChange,
    render,
    userProps,
    value: currentValue,
  } = useRadio(props);

  const { children, className: customClassName, ...rest } = userProps;

  const className = classNames(customClassName, styles.label);

  return render(
    <label
      className={className}
      htmlFor={props.id}
      data-value={value}
      data-checked={value === currentValue}
    >
      {children}
      <input
        className={styles.input}
        {...rest}
        value={value}
        onChange={handleChange}
        checked={value === currentValue}
      />
    </label>
  );
};
