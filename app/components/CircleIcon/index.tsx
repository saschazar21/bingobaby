import classNames from "clsx";
import { FC, ReactNode } from "react";

import styles from "./CircleIcon.module.css";

export interface CircleIconProps {
  children: ReactNode;
  className?: string;
}

export const CircleIcon: FC<CircleIconProps> = ({
  children,
  className: customClassName,
}) => {
  const className = classNames(customClassName, styles.circle);

  return <div className={className}>{children}</div>;
};
