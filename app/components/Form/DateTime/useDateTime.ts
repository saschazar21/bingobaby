import { applyTimezone, dateObject } from "@/utils/day";
import { FieldProps, useField } from "informed";
import { ChangeEventHandler, useCallback, useMemo } from "react";

export interface UserProps {
  className?: string;
  id: string;
  label: string;
  placeholder?: string;
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
  const { error, showError, value } = fieldState;

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const parsedDate = applyTimezone(dateObject(e.target.value)).utc()
        .toISOString();
      setValue(parsedDate, e);
    },
    [setValue],
  );

  const parsedValue = useMemo(() => {
    const dateTime = applyTimezone(dateObject(value as string)).format(
      "YYYY-MM-DDTHH:mm",
    );
    return dateTime;
  }, [value]);

  return {
    error,
    handleChange,
    isErrorShown: showError,
    render,
    userProps,
    value: parsedValue,
  };
};
