import { useGuessContext } from "@/contexts/GuessContext";
import { FC, useMemo } from "react";

export interface SexDistributionProps {}

const DONUT_THICKNESS = 50;

export const SexDistribution: FC<SexDistributionProps> = () => {
  const data = useGuessContext();

  const distribution = useMemo(
    () =>
      data?.state.guesses.reduce(
        (obj, guess) => {
          return {
            female: guess.sex === "female" ? obj.female + 1 : obj.female,
            male: guess.sex === "male" ? obj.male + 1 : obj.male,
          };
        },
        { female: 0, male: 0 }
      ),
    [data?.state.guesses]
  );

  return <div />;
};
