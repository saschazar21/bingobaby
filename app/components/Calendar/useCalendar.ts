import { useReducer } from "react";

export enum CALENDAR_ACTIONS {
  RESET = "RESET",
  SET_DAY = "SET_DATE",
  SET_MONTH = "SET_MONTH",
  SET_YEAR = "SET_YEAR",
}

export interface CalendarState {
  day?: number;
  month: number;
  year: number;
}

export interface CalendarAction {
  payload: Partial<CalendarState>;
  type: CALENDAR_ACTIONS;
}

const initialState = {
  month: new Date().getMonth(),
  year: new Date().getFullYear(),
};

const reducer = (state: CalendarState, action: CalendarAction) => {
  switch (action.type) {
    case CALENDAR_ACTIONS.RESET:
      return initialState;
    case CALENDAR_ACTIONS.SET_DAY:
      return {
        ...state,
        day: action.payload.day as number,
      };
    case CALENDAR_ACTIONS.SET_MONTH:
      return {
        ...state,
        month: action.payload.month as number,
      };
    case CALENDAR_ACTIONS.SET_YEAR:
      return {
        ...state,
        year: action.payload.year as number,
      };
    default:
      return state;
  }
};

export const useCalendar = (init: Partial<CalendarState>) => {
  const [state, dispatch] = useReducer(reducer, { ...initialState, ...init });

  return {
    dispatch,
    state,
  };
};
