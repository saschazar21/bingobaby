import { dateObject } from "@/utils/day";
import { FieldProps, useField } from "informed";
import { ChangeEventHandler, useCallback, useId, useMemo } from "react";

export interface UserProps {
  className?: string;
  label: string;
  placeholder?: string;
}

export const useDateTime = (props: FieldProps<UserProps>) => {
  const id = useId();

  const config = useMemo(() => ({
    type: "datetime-local",
    id,
    initialValue: "",
    ...props,
  }), [id, props]);

  const { fieldApi, fieldState, render, userProps } = useField<
    UserProps,
    string
  >(config);

  const { setValue } = fieldApi;
  const { error, showError, value } = fieldState;

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const parsedDate = dateObject(e.target.value).utc()
        .toISOString();
      setValue(parsedDate, e);
    },
    [setValue],
  );

  const parsedValue = useMemo(() => {
    const dateTime = dateObject(value as string).format(
      "YYYY-MM-DDTHH:mm",
    );
    return dateTime;
  }, [value]);

  return {
    error,
    handleChange,
    id,
    isErrorShown: showError,
    render,
    userProps,
    value: parsedValue,
  };
};
