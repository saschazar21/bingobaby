import { useSessionContext } from "@/contexts/SessionContext";
import { formatValue } from "@/utils/login";
import {
  ChangeEventHandler,
  FocusEventHandler,
  useCallback,
  useDeferredValue,
  useEffect,
  useReducer,
} from "react";

export interface LoginFormHook {
  handleBlur: FocusEventHandler<HTMLInputElement>;
  handleChange: ChangeEventHandler<HTMLInputElement>;
  handleFocus: FocusEventHandler<HTMLInputElement>;
  state: LoginFormState;
}

export enum LOGINFORM_ACTION {
  SET_ERROR = "SET_ERROR",
  SET_IS_ERROR_SHOWN = "SET_IS_ERROR_SHOWN",
  SET_IS_VALID = "SET_IS_VALID",
  SET_IS_PRISTINE = "SET_IS_PRISTINE",
  SET_VALUE = "SET_VALUE",
  RESET = "RESET",
}

export interface LoginFormState {
  error?: string;
  isErrorShown?: boolean;
  isValid: boolean;
  isPristine: boolean;
  value: string;
}

export interface LoginFormAction {
  payload: Partial<LoginFormState>;
  type: LOGINFORM_ACTION;
}

const initialState: LoginFormState = {
  isErrorShown: true,
  isValid: false,
  isPristine: true,
  value: "",
};

const reducer = (state: LoginFormState, action: LoginFormAction) => {
  switch (action.type) {
    case LOGINFORM_ACTION.RESET:
      return initialState;
    case LOGINFORM_ACTION.SET_IS_ERROR_SHOWN:
      return {
        ...state,
        isErrorShown: action.payload.isErrorShown as boolean,
      };
    case LOGINFORM_ACTION.SET_IS_PRISTINE:
      return {
        ...state,
        isPristine: action.payload.isPristine as boolean,
      };
    case LOGINFORM_ACTION.SET_IS_VALID:
      return {
        ...state,
        isValid: action.payload.isValid as boolean,
      };
    case LOGINFORM_ACTION.SET_ERROR:
      return {
        ...state,
        error: action.payload.error,
        isValid: false,
      };
    case LOGINFORM_ACTION.SET_VALUE:
      return {
        ...state,
        error: undefined,
        isErrorShown: false,
        isPristine: false,
        value: action.payload.value as string,
        ...(action.payload.isValid ? { isValid: action.payload.isValid } : {}),
      };
    default:
      return state;
  }
};

export const useLoginForm = () => {
  const session = useSessionContext();

  const [state, dispatch] = useReducer(
    reducer,
    {
      ...initialState,
      ...(session?.error ? { error: session.error } : {}),
    },
  );
  const deferredValue = useDeferredValue(state.value);

  useEffect(() => {
    if (!state.isPristine) {
      try {
        const formattedValue = formatValue(deferredValue ?? "");
        dispatch({
          type: LOGINFORM_ACTION.SET_VALUE,
          payload: { isValid: true, value: formattedValue },
        });
      } catch (e) {
        dispatch({
          type: LOGINFORM_ACTION.SET_ERROR,
          payload: { error: (e as Error).message },
        });
      }
    }
  }, [deferredValue, state.isPristine]);

  const handleBlur: FocusEventHandler<HTMLInputElement> = useCallback(
    () => {
      dispatch({
        type: LOGINFORM_ACTION.SET_IS_PRISTINE,
        payload: { isPristine: false },
      });
      dispatch({
        type: LOGINFORM_ACTION.SET_IS_ERROR_SHOWN,
        payload: { isErrorShown: true },
      });
    },
    [dispatch],
  );

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      dispatch({
        type: LOGINFORM_ACTION.SET_VALUE,
        payload: { value: event.target.value },
      });
    },
    [dispatch],
  );

  const handleFocus: FocusEventHandler<HTMLInputElement> = useCallback(() => {
    dispatch({
      type: LOGINFORM_ACTION.SET_IS_ERROR_SHOWN,
      payload: { isErrorShown: false },
    });
  }, [dispatch]);

  return {
    handleBlur,
    handleChange,
    handleFocus,
    state,
  };
};
