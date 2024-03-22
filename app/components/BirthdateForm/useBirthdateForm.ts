import { useBirthdateEditContext } from "@/contexts/BirthdateEditContext";
import { GuessData } from "@/deno/postgres/types";
import { useLazyApi } from "@/hooks/useApi";
import { BIRTHDATE } from "@/routes/api.birthdate";
import { validateAgainstFutureDate } from "@/utils/validators";
import { FormApi, FormState } from "informed";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface BirthdateFormProps {}

export const useBirthdateForm = () => {
  const ref = useRef<FormApi>(null);
  const [birthdate, setBirthdate = (_value: GuessData) => undefined, auth] =
    useBirthdateEditContext() ?? [];
  const [formError, setFormError] = useState<string | null>(null);

  const [method, action] = useMemo(
    () =>
      birthdate ? ["PUT", `/api/${BIRTHDATE}`] : ["POST", `/api/${BIRTHDATE}`],
    [birthdate],
  );

  const { error: _, isLoading: __, submit } = useLazyApi(
    action,
    method as "PUT" | "POST",
  );

  const resetForm = useCallback(() => {
    setFormError(null);
    ref.current?.reset();
  }, []);

  useEffect(() => {
    if (birthdate) {
      ref.current?.setValues({
        id: birthdate.id,
        date: birthdate.date,
        sex: birthdate.sex,
      });
    } else {
      resetForm();
    }
  }, [birthdate, resetForm]);

  const handleErrorClose = useCallback(() => {
    setFormError(null);
  }, []);

  const handleSubmit = useCallback(async (formState: FormState) => {
    const { errors: _, maskedValues, valid: isValid } = formState;
    if (birthdate) {
      if (
        birthdate.sex === maskedValues.sex &&
        birthdate.date === maskedValues.date
      ) {
        return null;
      }
    }

    if (isValid) {
      const res = await submit(
        maskedValues as GuessData,
        auth ? { authorization: `Basic ${auth}` } : undefined,
      );
      if (res.error) {
        setFormError(res.error);
      } else {
        setBirthdate({
          ...maskedValues,
          id: BIRTHDATE,
        } as GuessData);
      }
    }
  }, [auth, birthdate, setBirthdate, submit]);

  const handleSubmitFailure = useCallback((_formState: FormState) => {
    setFormError(
      "Es sind Fehler aufgetreten. Schätzung konnte nicht abgeschickt werden.",
    );
  }, []);

  const validateDate = useCallback(
    (value: unknown) => {
      try {
        validateAgainstFutureDate(value as string);
      } catch (e) {
        return (e as Error).message;
      }
    },
    [],
  );

  return {
    action,
    formError,
    data: birthdate,
    handleErrorClose,
    handleSubmit,
    handleSubmitFailure,
    method,
    ref,
    validateDate,
  };
};
