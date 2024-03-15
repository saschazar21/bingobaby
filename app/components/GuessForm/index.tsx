import { Form, Input } from "informed";
import { FC } from "react";
import {
  PiCheckBold,
  PiGenderFemaleBold,
  PiGenderMaleBold,
} from "react-icons/pi";
import { DateTime } from "@/components/Form/DateTime";
import { Hidden } from "@/components/Form/Hidden";
import { Radio } from "@/components/Form/Radio";
import { GuessFormProps, useGuessForm } from "./useGuessForm";

import styles from "./GuessForm.module.css";

export const GuessForm: FC<GuessFormProps> = (props) => {
  const { action, guess, handleSubmit, handleSubmitFailure, method, ref } =
    useGuessForm(props);

  return (
    <Form
      className={styles.wrapper}
      formApiRef={ref}
      onSubmit={handleSubmit}
      onSubmitFailure={handleSubmitFailure}
      method={method}
      action={action}
    >
      <div className={styles.inputs}>
        <fieldset className={styles.gender}>
          <legend>Was wird es?</legend>
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
        </fieldset>
        <DateTime
          label="Wann kommt es auf die Welt?"
          id="date-input"
          name="date"
          placeholder="Geburtszeitpunkt eingeben"
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
