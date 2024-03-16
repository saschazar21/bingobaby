import { FieldProps, useField } from "informed";
import { FC, useMemo } from "react";

export interface UserProps {
  id: string;
}

export interface HiddenProps extends FieldProps<UserProps> {
  value: string;
}

export const Hidden: FC<HiddenProps> = ({ value, ...props }) => {
  const config = useMemo(
    () => ({
      defaultValue: value,
      ...props,
      type: "hidden",
    }),
    [props, value]
  );

  const { render, userProps } = useField<UserProps, string>(config);

  return render(<input value={value} {...userProps} />);
};
