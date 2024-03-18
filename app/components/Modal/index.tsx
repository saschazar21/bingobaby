import {
  ForwardRefRenderFunction,
  ReactNode,
  RefObject,
  forwardRef,
} from "react";
import { PiXBold } from "react-icons/pi";
import { DialogContext } from "@/contexts/DialogContext";

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
  const { handleClick, handleClose, handleDialogClose, handleKeyUp } = useModal(
    ref as RefObject<HTMLDialogElement>
  );

  return (
    <DialogContext.Provider value={ref as RefObject<HTMLDialogElement>}>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <dialog
        onClick={handleClick}
        onClose={handleDialogClose}
        onKeyUp={handleKeyUp}
        ref={ref}
        className={styles.dialog}
        open={open ?? undefined}
        data-no-print
      >
        <div className={styles.header}>
          <h2 className={styles.heading}>{heading}</h2>
          <button onClick={handleClose} className="icon-button" type="button">
            <PiXBold />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </dialog>
    </DialogContext.Provider>
  );
};

export const Modal = forwardRef(ModalContent);
