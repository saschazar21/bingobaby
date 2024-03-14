import { Form } from "informed";
import { FC, useMemo } from "react";
import {
  PiCheckBold,
  PiGenderFemaleBold,
  PiGenderMaleBold,
} from "react-icons/pi";
import { DateTime } from "@/components/Form/DateTime";
import { Radio } from "@/components/Form/Radio";
import { GuessFormProps, useGuessForm } from "./useGuessForm";

import styles from "./GuessForm.module.css";

export const GuessForm: FC<GuessFormProps> = (props) => {
  const { action, handleSubmit, handleSubmitFailure, method } =
    useGuessForm(props);

  const min = useMemo(
    () => ({
      el: <PiGenderMaleBold />,
      value: "male",
    }),
    []
  );

  const max = useMemo(
    () => ({
      el: <PiGenderFemaleBold />,
      value: "female",
    }),
    []
  );

  return (
    <Form
      className={styles.wrapper}
      onSubmit={handleSubmit}
      onSubmitFailure={handleSubmitFailure}
      method={method}
      action={action}
    >
      <div className={styles.inputs}>
        <div className={styles.gender}>
          <span>Was wird es?</span>
          <Radio
            className={styles.radio}
            id="female-radio"
            name="sex"
            value="female"
          >
            <span>ein Mädchen</span>
            <PiGenderFemaleBold />
          </Radio>
          <Radio
            className={styles.radio}
            id="male-radio"
            name="sex"
            value="male"
          >
            <span>ein Bub</span>
            <PiGenderMaleBold />
          </Radio>
        </div>
        <DateTime
          label="Wann kommt es auf die Welt?"
          id="date-input"
          name="date"
          required
        />
      </div>
      <button className={styles.submit} type="submit">
        <span>Abschicken</span> <PiCheckBold role="presentation" />
      </button>
    </Form>
  );
};
