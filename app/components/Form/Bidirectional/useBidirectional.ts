import { FieldProps, useField } from "informed";
import { ChangeEventHandler, ReactNode, useCallback, useMemo } from "react";

export interface BidirectionalValue {
  el: ReactNode;
  value: string;
}

export interface UserProps {
  className?: string;
  id: string;
  label: string;
  min: BidirectionalValue;
  max: BidirectionalValue;
}

export const useBidirectional = (props: FieldProps<UserProps>) => {
  const config: FieldProps<UserProps> = {
    type: "range",
    initialValue: "2",
    onChange: console.log,
    ...props,
  };

  const { fieldApi, fieldState, render, userProps } = useField<
    UserProps,
    number
  >(config);

  const { pristine: isPristine, value } = fieldState;
  const { setValue } = fieldApi;

  const parsedValue = useMemo(() => {
    if (isPristine) {
      return value;
    }
    return value === props.min.value ? "1" : "3";
  }, [
    value,
  ]);

  const validator = useCallback((value: string) => {
    if (config.required && value === "2") {
      return "Dieses Feld muss ausgefüllt werden.";
    }
  }, [config.required]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      switch (e.target.value) {
        case "1":
          return setValue(props.min.value, e);
        case "3":
          return setValue(props.max.value, e);
        default:
          return setValue(
            value === props.min.value ? props.max.value : props.min.value,
            e,
          );
      }
    },
    [value, setValue],
  );

  return {
    handleChange,
    render,
    userProps,
    value: parsedValue,
  };
};
