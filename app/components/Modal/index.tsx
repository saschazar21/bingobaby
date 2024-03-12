import { FC, MouseEventHandler, ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { PiXBold } from "react-icons/pi";

import styles from "./Modal.module.css";

export interface ModalProps {
  children: ReactNode | ReactNode[];
  heading: string;
  onClose: MouseEventHandler;
}

const ModalContent: FC<ModalProps> = ({ children, heading, onClose }) => {
  useEffect(() => {
    document.body.style.overflowY = "hidden";

    return () => {
      document.body.style.overflowY = "initial";
    };
  }, []);

  return (
    <>
      <div className={styles.backdrop} />
      <section className={styles.wrapper}>
        <div className={styles.header}>
          <h2 className={styles.heading}>{heading}</h2>
          <button onClick={onClose} className={styles.close} type="button">
            <PiXBold />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </section>
    </>
  );
};

export const Modal: FC<ModalProps> = (props) =>
  createPortal(
    <ModalContent {...props} />,
    document.querySelector("#modal") as HTMLDivElement
  );
