import { Form } from "informed";
import { FC } from "react";
import {
  PiCheckBold,
  PiGenderFemaleBold,
  PiGenderMaleBold,
} from "react-icons/pi";
import { Error } from "@/components/Error";
import { DateTime } from "@/components/Form/DateTime";
import { Hidden } from "@/components/Form/Hidden";
import { Radio } from "@/components/Form/Radio";
import { RadioGroup } from "@/components/Form/RadioGroup";
import { GuessFormProps, useGuessForm } from "./useGuessForm";

import styles from "./GuessForm.module.css";

export const GuessForm: FC<GuessFormProps> = () => {
  const {
    action,
    formError,
    guess,
    handleErrorClose,
    handleSubmit,
    handleSubmitFailure,
    method,
    ref,
    validateDate,
  } = useGuessForm();

  return (
    <Form
      className={styles.wrapper}
      formApiRef={ref}
      onSubmit={handleSubmit}
      onSubmitFailure={
        handleSubmitFailure as (formState: Record<string, unknown>) => void
      }
      method={method}
      action={action}
      errorMessage={{
        required: "Dieses Feld muss ausgefüllt werden.",
      }}
    >
      {formError ? <Error onClose={handleErrorClose}>{formError}</Error> : null}
      <div className={styles.inputs}>
        <RadioGroup name="sex" label="Was wird es?">
          <Radio className={styles.radio} name="sex" value="female" required>
            <span>ein Mädchen</span>
            <PiGenderFemaleBold />
          </Radio>
          <Radio className={styles.radio} name="sex" value="male" required>
            <span>ein Bub</span>
            <PiGenderMaleBold />
          </Radio>
        </RadioGroup>
        <DateTime
          label="Wann kommt es auf die Welt?"
          name="date"
          placeholder="Geburtszeitpunkt eingeben"
          validate={validateDate}
          required
        />
      </div>
      {guess?.id ? <Hidden name="id" value={guess.id} /> : null}
      <button className={styles.submit} type="submit">
        <span>Abschicken</span> <PiCheckBold role="presentation" />
      </button>
    </Form>
  );
};
