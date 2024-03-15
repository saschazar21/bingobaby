import {
  ForwardRefRenderFunction,
  ReactNode,
  RefObject,
  forwardRef,
} from "react";
import { PiXBold } from "react-icons/pi";
import { DialogContext } from "@/contexts/DialogContext";
import { usePubSubContext } from "@/contexts/PubSubContext";
import { DIALOG_ACTIONS } from "@/utils/pubsub";

import styles from "./Modal.module.css";
import { useModal } from "./useModal";

export interface ModalProps {
  children: ReactNode | ReactNode[];
  heading: string;
  open?: boolean;
}

const ModalContent: ForwardRefRenderFunction<HTMLDialogElement, ModalProps> = (
  { children, heading, open },
  ref
) => {
  const { handleClick, handleClose, handleDialogClose } = useModal(
    ref as RefObject<HTMLDialogElement>
  );

  return (
    <DialogContext.Provider value={ref as RefObject<HTMLDialogElement>}>
      <dialog
        onClick={handleClick}
        onClose={handleDialogClose}
        ref={ref}
        className={styles.dialog}
        open={open || undefined}
      >
        <div className={styles.header}>
          <h2 className={styles.heading}>{heading}</h2>
          <button
            autoFocus
            onClick={handleClose}
            className={styles.close}
            type="button"
          >
            <PiXBold />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </dialog>
    </DialogContext.Provider>
  );
};

export const Modal = forwardRef(ModalContent);
