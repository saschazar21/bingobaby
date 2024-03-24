import { useEffect, useRef } from "react";

const RESULTS_HAVE_BEEN_SHOWN = "results have been shown";

export const useResultsModal = () => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const hasBeenShown = localStorage.getItem(RESULTS_HAVE_BEEN_SHOWN);
    if (hasBeenShown !== "true") {
      ref.current?.showModal();
      localStorage.setItem(RESULTS_HAVE_BEEN_SHOWN, "true");
    }
  }, []);

  return { ref };
};
