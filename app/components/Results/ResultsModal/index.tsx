import { FC } from "react";
import { ResultsTable } from "@/components/Results/ResultsTable";
import { Modal } from "@/components/Modal";
import { useResultsModal } from "./useResultsModal";

export interface ResultsModalProps {}

export const ResultsModal: FC = () => {
  const { canvas, isCanvasShown, ref } = useResultsModal();

  return (
    <Modal heading="So sehen Sieger aus!" ref={ref}>
      <ResultsTable />
      {isCanvasShown && (
        <canvas
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 2,
          }}
          ref={canvas}
        />
      )}
    </Modal>
  );
};
