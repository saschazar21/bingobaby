import { Form } from "informed";
import { FC } from "react";
import {
  PiCheckBold,
  PiGenderFemaleBold,
  PiGenderMaleBold,
} from "react-icons/pi";
import { DateTime } from "@/components/Form/DateTime";
import { Hidden } from "@/components/Form/Hidden";
import { Radio } from "@/components/Form/Radio";
import { RadioGroup } from "@/components/Form/RadioGroup";
import { GuessFormProps, useGuessForm } from "./useGuessForm";

import styles from "./GuessForm.module.css";

export const GuessForm: FC<GuessFormProps> = (props) => {
  const {
    action,
    guess,
    handleSubmit,
    handleSubmitFailure,
    method,
    ref,
    validateDate,
  } = useGuessForm(props);

  return (
    <Form
      className={styles.wrapper}
      formApiRef={ref}
      onSubmit={handleSubmit}
      onSubmitFailure={
        handleSubmitFailure as (formState: Record<string, any>) => void
      }
      method={method}
      action={action}
      errorMessage={{
        required: "Dieses Feld muss ausgefüllt werden.",
      }}
    >
      <div className={styles.inputs}>
        <RadioGroup name="sex" label="Was wird es?">
          <Radio
            className={styles.radio}
            id="female-radio"
            name="sex"
            value="female"
            required
          >
            <span>ein Mädchen</span>
            <PiGenderFemaleBold />
          </Radio>
          <Radio
            className={styles.radio}
            id="male-radio"
            name="sex"
            value="male"
            required
          >
            <span>ein Bub</span>
            <PiGenderMaleBold />
          </Radio>
        </RadioGroup>
        <DateTime
          label="Wann kommt es auf die Welt?"
          id="date-input"
          name="date"
          placeholder="Geburtszeitpunkt eingeben"
          validate={validateDate}
          required
        />
      </div>
      {guess?.id ? <Hidden id="guess-id" name="id" value={guess.id} /> : null}
      <button className={styles.submit} type="submit">
        <span>Abschicken</span> <PiCheckBold role="presentation" />
      </button>
    </Form>
  );
};
