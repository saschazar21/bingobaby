import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Pie, SizeContext } from "./Pie";

import styles from "./SexDistribution.module.css";

export interface SexDistributionProps {}

export const SexDistribution: FC<SexDistributionProps> = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ height: 256, width: 256 });

  const resize = useCallback(() => {
    if (ref) {
      const { width, height } = ref.current?.getBoundingClientRect() ?? {
        height: 256,
        width: 256,
      };
      setSize({ height, width });
    }
  }, []);

  useEffect(() => {
    typeof window !== "undefined" && window.addEventListener("resize", resize);
    resize();
    return () => {
      typeof window !== "undefined" &&
        window.removeEventListener("resize", resize);
    };
  }, [resize]);

  return (
    <SizeContext.Provider value={size}>
      <div className={styles.container} ref={ref}>
        <svg height={size.height} width={size.width}>
          <Pie />
        </svg>
      </div>
    </SizeContext.Provider>
  );
};
