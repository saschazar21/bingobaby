import { Guess } from "@/deno/postgres/types";
import { dateObject } from "@/utils/day";
import { Dispatch, useReducer } from "react";

export enum GUESS_ACTIONS {
  RESET = "RESET",
  ADD_GUESS = "ADD_GUESS",
  UPDATE_GUESS = "UPDATE_GUESS",
}

export interface GuessState {
  guesses: Guess[];
}

export interface GuessAction {
  payload: Guess;
  type: GUESS_ACTIONS;
}

export interface GuessContextValue {
  dispatch: Dispatch<GuessAction>;
  maxGuesses: number;
  state: GuessState;
}

export const initialState = {
  guesses: [],
};

const reducer = (state: GuessState, action: GuessAction) => {
  switch (action.type) {
    case GUESS_ACTIONS.RESET:
      return initialState;
    case GUESS_ACTIONS.ADD_GUESS:
      return {
        ...state,
        guesses: [
          ...state.guesses,
          action.payload,
        ].sort(({ date: aDate }, { date: bDate }) =>
          dateObject(aDate).valueOf() - dateObject(bDate).valueOf()
        ),
      };
    case GUESS_ACTIONS.UPDATE_GUESS:
      return {
        ...state,
        guesses: [
          ...state.guesses.map((guess) =>
            guess.id === action.payload.id ? action.payload : guess
          ),
        ].sort(({ date: aDate }, { date: bDate }) =>
          dateObject(aDate).valueOf() - dateObject(bDate).valueOf()
        ),
      };
    default:
      return state;
  }
};

export const useGuesses = (guesses: Guess[] = []) => {
  const [state, dispatch] = useReducer(reducer, { guesses });

  return {
    dispatch,
    state,
  };
};
