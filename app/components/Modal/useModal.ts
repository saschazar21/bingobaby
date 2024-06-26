import { usePubSubContext } from "@/contexts/PubSubContext";
import { DIALOG_ACTIONS } from "@/utils/pubsub";
import {
  KeyboardEventHandler,
  MouseEventHandler,
  ReactEventHandler,
  RefObject,
  useCallback,
  useEffect,
} from "react";

export const useModal = (ref: RefObject<HTMLDialogElement>) => {
  const pubSub = usePubSubContext();

  const handleOpen = useCallback((value?: string) => {
    switch (value) {
      case DIALOG_ACTIONS.OPEN:
        !ref.current?.open && ref.current?.showModal();
        break;
      case DIALOG_ACTIONS.CLOSE:
        ref.current?.open && ref.current?.close();
        break;
    }
  }, [ref]);

  useEffect(() => {
    let unsubscribe: () => void;
    if (pubSub?.subscribe) {
      unsubscribe = pubSub.subscribe(handleOpen);
    }

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [handleOpen, pubSub, pubSub?.subscribe]);

  const handleClose: MouseEventHandler<HTMLButtonElement> = useCallback(
    (_e) => {
      (ref as RefObject<HTMLDialogElement>).current?.close();
    },
    [ref],
  );

  const handleClick: MouseEventHandler<HTMLDialogElement> = useCallback((e) => {
    const target = e.target;

    const { top, left, height, width } = (
      target as HTMLDialogElement
    ).getBoundingClientRect();
    const isInBounds = top <= e.clientY &&
      e.clientY <= top + height &&
      left <= e.clientX &&
      e.clientX <= left + width;

    if (
      !isInBounds &&
      typeof (target as HTMLDialogElement).close === "function"
    ) {
      (target as HTMLDialogElement).close();
    }
  }, []);

  const handleDialogClose: ReactEventHandler<HTMLDialogElement> = useCallback(
    () => {
      pubSub?.publish(DIALOG_ACTIONS.CLOSE);
    },
    [pubSub],
  );

  const handleKeyUp: KeyboardEventHandler<HTMLDialogElement> = useCallback(
    (e) => {
      if (e.key === "Escape") {
        (e.target as HTMLDialogElement).close();
      }
    },
    [],
  );

  return {
    handleClose,
    handleClick,
    handleDialogClose,
    handleKeyUp,
  };
};
