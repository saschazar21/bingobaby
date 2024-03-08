import { FC, MouseEventHandler, ReactNode, useCallback } from "react";
import classNames from "clsx";
import { BabyIcon } from "@/components/BabyIcon";

import styles from "./Header.module.css";

export interface HeaderProps {
  children: ReactNode | ReactNode[];
  video: string;
}

export const Header: FC<HeaderProps> = ({ children, video }) => {
  const className = classNames("container", styles.container);

  const handleClick: MouseEventHandler<HTMLVideoElement> = useCallback(
    (event) => {
      const video = event.target as HTMLVideoElement;
      video.paused ? video.play() : video.pause();
    },
    []
  );

  return (
    <header data-full-bleed>
      <div className={className}>
        <div>
          <video
            autoPlay
            loop
            muted
            playsInline
            width="640"
            onClick={handleClick}
          >
            {/* ffmpeg -i INPUT -vf scale=960:720 -c:v libx265 -preset veryslow -tag:v hvc1 -crf 23 -pix_fmt yuv420p -movflags +faststart -r 30 -an OUTPUT */}
            <source
              src={`/videos/${video}_960_x265.mp4`}
              type="video/mp4; codecs=hvc1"
              media="(min-width: 480px)"
            />
            {/* ffmpeg -i INPUT -vf scale=960:720 -f webm -c:v libvpx-vp9 -r 30 -an OUTPUT */}
            <source
              src={`/videos/${video}_960.webm`}
              type="video/webm; codecs=vp9"
              media="(min-width: 480px)"
            />
            {/* ffmpeg -i INPUT -vf scale=960:720 -c:v libx264 -profile:v main -level 3.1 -crf 23 -pix_fmt yuv420p -movflags +faststart -r 30 -an  OUTPUT */}
            <source
              src={`/videos/${video}_960_x264.mp4`}
              type="video/mp4; codecs=avc1.4d001f"
              media="(min-width: 480px)"
            />
            <source
              src={`/videos/${video}_640_x265.mp4`}
              type="video/mp4; codecs=hvc1"
            />
            <source
              src={`/videos/${video}_640.webm`}
              type="video/webm; codecs=vp9"
            />
            <source
              src={`/videos/${video}_640_x264.mp4`}
              type="video/mp4; codecs=avc1.4d001f"
            />
          </video>
        </div>
        <div className={styles.content}>
          <BabyIcon className={styles.baby} />
          {children}
        </div>
      </div>
    </header>
  );
};
