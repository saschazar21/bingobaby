import { FieldProps, useField } from "informed";
import { FC, useId, useMemo } from "react";

export interface UserProps {}

export interface HiddenProps extends FieldProps<UserProps> {
  value: string;
}

export const Hidden: FC<HiddenProps> = ({ value, ...props }) => {
  const id = useId();

  const config = useMemo(
    () => ({
      defaultValue: value,
      id,
      ...props,
      type: "hidden",
    }),
    [id, props, value]
  );

  const { render, userProps } = useField<UserProps, string>(config);

  return render(<input value={value} {...userProps} />);
};
