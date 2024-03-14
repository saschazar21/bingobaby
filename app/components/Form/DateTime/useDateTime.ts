import { FieldProps, useField } from "informed";
import { ChangeEventHandler, useCallback } from "react";

export interface UserProps {
  className?: string;
  id: string;
  label: string;
}

export const useDateTime = (props: FieldProps<UserProps>) => {
  const config = {
    type: "datetime-local",
    initialValue: "",
    ...props,
  };

  const { fieldApi, fieldState, render, userProps } = useField<
    UserProps,
    string
  >(config);

  const { setValue } = fieldApi;
  const { value } = fieldState;

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      setValue(e.target.value, e);
    },
    [setValue],
  );

  console.log(value);

  return {
    handleChange,
    render,
    userProps,
    value,
  };
};
