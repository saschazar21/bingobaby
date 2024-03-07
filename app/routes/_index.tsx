import classNames from "clsx";
import { MouseEventHandler, useCallback, useMemo } from "react";
import {
  PiGenderIntersex,
  PiCalendar,
  PiTrophy,
  PiEqualsBold,
  PiPlusBold,
} from "react-icons/pi";
import { CircleIcon } from "@/components/CircleIcon";
import { LoginForm } from "@/components/LoginForm";
import { useBirthDateContext } from "@/contexts/BirthdateContext";
import { LoginContextProvider } from "@/contexts/LoginContext";
import { useSessionContext } from "@/contexts/SessionContext";

import pkg from "../../package.json";

import styles from "./styles/_index.module.css";
import { Header } from "@/components/Header";

export default function Index() {
  const className = classNames("container", styles.container);
  const session = useSessionContext();
  const date = useBirthDateContext();

  const birthdate = useMemo(() => date?.format("YYYY-MM-DD"), [date]);
  const closeDate = useMemo(
    () => date?.subtract(3, "weeks").format("YYYY-MM-DD"),
    [date]
  );

  const handleClick: MouseEventHandler<HTMLVideoElement> = useCallback(
    (event) => {
      const video = event.target as HTMLVideoElement;
      video.paused ? video.play() : video.pause();
    },
    []
  );

  return (
    <LoginContextProvider>
      <Header>
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
            src="/videos/baby-egg_960_x265.mp4"
            type="video/mp4; codecs=hvc1"
            media="(min-width: 480px)"
          />
          {/* ffmpeg -i INPUT -vf scale=960:720 -f webm -c:v libvpx-vp9 -r 30 -an OUTPUT */}
          <source
            src="/videos/baby-egg_960.webm"
            type="video/webm; codecs=vp9"
            media="(min-width: 480px)"
          />
          {/* ffmpeg -i INPUT -vf scale=960:720 -c:v libx264 -profile:v main -level 3.1 -crf 23 -pix_fmt yuv420p -movflags +faststart -r 30 -an  OUTPUT */}
          <source
            src="/videos/baby-egg_960_x264.mp4"
            type="video/mp4; codecs=avc1.4d001f"
            media="(min-width: 480px)"
          />
          <source
            src="/videos/baby-egg_640_x265.mp4"
            type="video/mp4; codecs=hvc1"
          />
          <source
            src="/videos/baby-egg_640.webm"
            type="video/webm; codecs=vp9"
          />
          <source
            src="/videos/baby-egg_640_x264.mp4"
            type="video/mp4; codecs=avc1.4d001f"
          />
        </video>
      </Header>
      <main>
        <h1>{pkg.short_name}</h1>
        <p className="lead">{pkg.description}</p>
        <p>
          Jede/r Teilnehmer/in kann <b>bis zu 3 Schätzungen</b> abgeben. Die
          Kombination aus erratenem Geschlecht und dem am nächsten kommenden
          Geburtszeitpunkt gewinnt.
        </p>
        <div className={styles.icons}>
          <CircleIcon>
            <PiGenderIntersex />
          </CircleIcon>
          <PiPlusBold />
          <CircleIcon>
            <PiCalendar />
          </CircleIcon>
          <PiEqualsBold />
          <CircleIcon>
            <PiTrophy />
          </CircleIcon>
        </div>
        <p>
          Änderungen an den abgegebenen Schätzungen sind{" "}
          <strong>
            bis <time dateTime={closeDate}>3 Wochen</time> vor dem errechneten{" "}
            <time dateTime={birthdate}>Geburtstermin</time>
          </strong>{" "}
          möglich. Sollte das Baby früher zur Welt kommen, endet die Frist mit
          dem tatsächlichen Geburtsdatum.
        </p>
      </main>
      {!session?.name ? (
        <aside className={styles.bottomContainer} data-full-bleed>
          <div className={className}>
            <LoginForm prefix="bottom" />
          </div>
        </aside>
      ) : null}
    </LoginContextProvider>
  );
}
