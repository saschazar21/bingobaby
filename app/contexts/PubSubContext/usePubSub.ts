import { RefObject, useCallback, useReducer } from "react";
import { uid } from "uid";

export enum PUB_SUB_ACTIONS {
  RESET = "RESET",
  SUBSCRIBE = "SUBSCRIBE",
  UNSUBSCRIBE = "UNSUBSCRIBE",
}

export interface PubSub {
  publish: (value?: string) => void;
  subscribe: (fn: (value?: string) => void) => () => void;
}

export type PubSubState = Map<string, () => void>;

export interface PubSubPayload {
  id: string;
  fn: (value?: string) => void;
}

export interface PubSubAction {
  payload: Partial<PubSubPayload>;
  type: PUB_SUB_ACTIONS;
}

const reducer = (state: PubSubState, action: PubSubAction) => {
  switch (action.type) {
    case PUB_SUB_ACTIONS.RESET:
      return new Map<string, (value?: string) => void>();
    case PUB_SUB_ACTIONS.SUBSCRIBE:
      state.set(
        action.payload.id as string,
        action.payload.fn as (value?: string) => void,
      );
      return state;
    case PUB_SUB_ACTIONS.UNSUBSCRIBE:
      state.delete(action.payload.id as string);
      return state;
    default:
      return state;
  }
};

export const usePubSub = (): PubSub => {
  const [subscribers, dispatch] = useReducer(
    reducer,
    new Map<string, (value?: string) => void>(),
  );

  const publish = useCallback((value?: string) => {
    console.log(value);
    for (const fn of subscribers.values()) {
      fn(value);
    }
  }, [subscribers]);

  const subscribe = useCallback((fn: (value?: string) => void) => {
    let id = uid(8);
    while (subscribers.has(id)) {
      id = uid(8);
    }

    dispatch({
      payload: {
        id,
        fn,
      },
      type: PUB_SUB_ACTIONS.SUBSCRIBE,
    });

    return () =>
      dispatch({ payload: { id }, type: PUB_SUB_ACTIONS.UNSUBSCRIBE });
  }, [dispatch, subscribers]);

  return { publish, subscribe };
};
