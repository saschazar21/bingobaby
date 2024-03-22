import { FieldProps, useField } from "informed";
import {
  ChangeEventHandler,
  ReactNode,
  useCallback,
  useId,
  useMemo,
} from "react";

export interface UserProps {
  children: string | ReactNode | ReactNode[];
  className?: string;
}

export const useRadio = (props: FieldProps<UserProps>) => {
  const id = useId();

  const config = useMemo(() => ({
    type: "radio",
    id,
    ...props,
  }), [id, props]);

  const { fieldApi, fieldState, render, userProps } = useField<
    UserProps,
    string
  >(config);

  const { value } = fieldState;
  const { setValue } = fieldApi;

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      setValue(e.target.value, e);
    },
    [setValue],
  );

  return { handleChange, render, userProps, value };
};
