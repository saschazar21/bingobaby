import { Guess } from "@/deno/postgres/types";
import { Dispatch, useCallback, useReducer } from "react";

export enum GUESS_EDIT_ACTIONS {
  RESET = "RESET",
  SET_ERROR = "SET_ERROR",
  SET_IS_EDITING = "SET_IS_EDITING",
  UPDATE = "UPDATE",
}

export interface GuessEditState {
  error: string | null;
  guess: Partial<Guess>;
  isEditing: boolean;
}

export interface GuessEditAction {
  payload: Partial<GuessEditState>;
  type: GUESS_EDIT_ACTIONS;
}

export interface GuessEditContextValue {
  dispatch: Dispatch<GuessEditAction>;
  handleBeginEdit: (guess: Partial<Guess>) => void;
  handleEndEdit: () => void;
  state: GuessEditState;
}

const initialState: GuessEditState = {
  error: null,
  guess: {},
  isEditing: false,
};

const reducer = (state: GuessEditState, action: GuessEditAction) => {
  switch (action.type) {
    case GUESS_EDIT_ACTIONS.RESET:
      return initialState;
    case GUESS_EDIT_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload.error as string | null,
      };
    case GUESS_EDIT_ACTIONS.SET_IS_EDITING:
      return {
        ...state,
        isEditing: !!action.payload.isEditing,
      };
    case GUESS_EDIT_ACTIONS.UPDATE:
      return {
        ...state,
        error: null,
        guess: action.payload.guess as Partial<Guess>,
        isEditing: true,
      };
    default:
      return state;
  }
};

export const useGuessEdit = (init?: Partial<GuessEditState>) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    ...(init ? init : {}),
  });

  const handleBeginEdit = useCallback((guess: Partial<Guess>) => {
    dispatch({
      type: GUESS_EDIT_ACTIONS.UPDATE,
      payload: { guess },
    });
  }, [dispatch]);

  const handleEndEdit = useCallback(() => {
    dispatch({
      type: GUESS_EDIT_ACTIONS.SET_IS_EDITING,
      payload: { isEditing: false },
    });
  }, [dispatch]);

  return {
    dispatch,
    handleBeginEdit,
    handleEndEdit,
    state,
  };
};
