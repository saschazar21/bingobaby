import { Form } from "informed";
import { FC, useMemo } from "react";
import { Bidirectional } from "@/components/Form/Bidirectional";
import { PiGenderFemaleBold, PiGenderMaleBold } from "react-icons/pi";
import { Guess } from "@/deno/postgres/types";

export interface GuessFormProps {
  guess?: Guess;
}

export const GuessForm: FC<GuessFormProps> = (props) => {
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

  const [method, action] = useMemo(
    () =>
      props.guess
        ? ["PUT", `/api/guesses/${props.guess.id}`]
        : ["POST", "/api/guesses"],
    [props.guess]
  );

  return (
    <Form method={method} action={action}>
      <Bidirectional
        label="Geschlecht auswählen"
        id="gender-input"
        name="sex"
        min={min}
        max={max}
        required
      />
    </Form>
  );
};
