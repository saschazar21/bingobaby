import { FieldProps, useField } from "informed";
import { FC } from "react";

export interface UserProps {
  autoFocus?: boolean;
  className?: string;
  id?: string;
  placeholder?: string;
}

export interface InputProps extends FieldProps<UserProps> {}

export const Input: FC<InputProps> = (props) => {
  const { render, informed } = useField<UserProps, string>({
    type: "text",
    ...props,
  });

  return render(<input {...informed} />);
};
