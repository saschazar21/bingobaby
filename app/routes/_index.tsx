import { LoaderFunction, json } from "@netlify/remix-runtime";
import { useLoaderData } from "@remix-run/react";
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
import { BabyIcon } from "@/components/BabyIcon";
import { useBirthDateContext } from "@/contexts/BirthdateContext";
import { LoginContextProvider } from "@/contexts/LoginContext";
import { SessionContext } from "@/contexts/SessionContext";
import { destroySession, getSession } from "@/utils/session";

import pkg from "../../package.json";

import styles from "./styles/_index.module.css";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("cookie"));

  if (!session.has("name")) {
    return json(
      {},
      {
        headers: {
          "set-cookie": await destroySession(session),
        },
      }
    );
  }

  const { data } = session;

  return { session: data };
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const className = classNames("container", styles.container);
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
    <SessionContext.Provider value={data?.session ?? null}>
      <LoginContextProvider>
        <aside data-full-bleed>
          <div className={className} data-header>
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
            </div>
            <div className={styles.login}>
              <BabyIcon className={styles.baby} />
              <LoginForm prefix="top" />
            </div>
          </div>
        </aside>
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
        <aside className={styles.bottomContainer} data-full-bleed>
          <div className={className}>
            <LoginForm prefix="bottom" />
          </div>
        </aside>
      </LoginContextProvider>
    </SessionContext.Provider>
  );
}
