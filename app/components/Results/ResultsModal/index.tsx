import { FC } from "react";
import { ResultsTable } from "@/components/Results/ResultsTable";
import { Modal } from "@/components/Modal";
import { useResultsModal } from "./useResultsModal";

export interface ResultsModalProps {}

export const ResultsModal: FC = () => {
  const { ref } = useResultsModal();

  return (
    <Modal heading="So sehen Sieger aus!" ref={ref}>
      <ResultsTable />
    </Modal>
  );
};
