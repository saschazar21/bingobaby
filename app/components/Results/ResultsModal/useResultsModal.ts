import { usePubSubContext } from "@/contexts/PubSubContext";
import { DIALOG_ACTIONS } from "@/utils/pubsub";
import confetti from "canvas-confetti";
import { useCallback, useEffect, useRef, useState } from "react";

const RESULTS_HAVE_BEEN_SHOWN = "results have been shown";

export const useResultsModal = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const ref = useRef<HTMLDialogElement>(null);
  const pubSub = usePubSubContext();
  const [isCanvasShown, setIsCanvasShown] = useState(true);

  const fireConfetti = useCallback(() => {
    if (canvas.current) {
      confetti.create(canvas.current, {
        disableForReducedMotion: true,
        useWorker: false,
      })({
        particleCount: 200,
        origin: {
          y: 1,
        },
      })?.then(() => setIsCanvasShown(false));
    }
  }, []);

  const renderCanvas = useCallback((value?: string) => {
    value === DIALOG_ACTIONS.OPEN && setIsCanvasShown(true);
  }, []);

  useEffect(() => {
    const modal = ref.current;
    const el = canvas.current;

    const [height, width] = [modal?.clientHeight, modal?.clientWidth];

    if (el && height && width) {
      el.height = height;
      el.width = width;
    }
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isCanvasShown) {
      timeout = setTimeout(fireConfetti, 300);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [fireConfetti, isCanvasShown]);

  useEffect(() => {
    const hasBeenShown = localStorage.getItem(RESULTS_HAVE_BEEN_SHOWN);
    if (hasBeenShown !== "false") {
      setIsCanvasShown(true);
      ref.current?.showModal();
      localStorage.setItem(RESULTS_HAVE_BEEN_SHOWN, "true");
    }
  }, []);

  useEffect(() => {
    const unsubscribe = pubSub?.subscribe(renderCanvas);

    return () => {
      typeof unsubscribe === "function" && unsubscribe();
    };
  }, [pubSub, renderCanvas]);

  return { canvas, isCanvasShown, ref };
};
