import { Guess } from "@/deno/postgres/types";
import { Dispatch, useReducer } from "react";

export enum GUESS_ACTIONS {
  RESET = "RESET",
  SET_GUESS = "SET_GUESS",
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
    case GUESS_ACTIONS.SET_GUESS:
      return {
        ...state,
        guesses: [
          ...state.guesses,
          action.payload,
        ],
      };
    case GUESS_ACTIONS.UPDATE_GUESS:
      const guesses = state.guesses.map((guess) => {
        return guess.id === action.payload.id
          ? {
            ...guess,
            ...action.payload,
            id: guess.id,
            updated_at: new Date().toISOString(),
          }
          : guess;
      });

      return {
        ...state,
        guesses,
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
