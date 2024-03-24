import { Link } from "@remix-run/react";
import classNames from "clsx";
import { FC, useMemo } from "react";
import {
  PiGenderIntersex,
  PiCalendar,
  PiTrophy,
  PiEqualsBold,
  PiPlusBold,
  PiArrowRightBold,
} from "react-icons/pi";
import { CircleIcon } from "@/components/CircleIcon";
import { Header } from "@/components/Header";
import { LoginForm } from "@/components/LoginForm";
import { ResultsBanner } from "@/components/Results/ResultsBanner";
import { UserInfo } from "@/components/UserInfo";
import { useBirthDateContext } from "@/contexts/BirthdateContext";
import { LoginContextProvider } from "@/contexts/LoginContext";
import { useSessionContext } from "@/contexts/SessionContext";

import pkg from "../../package.json";

import styles from "./styles/_index.module.css";

const Index: FC = () => {
  const session = useSessionContext();
  const date = useBirthDateContext();

  const birthdate = useMemo(
    () => date?.calculatedBirthdate.format("YYYY-MM-DD"),
    [date]
  );
  const closeDate = useMemo(() => date?.lockDate.format("YYYY-MM-DD"), [date]);

  const className = classNames("container", styles.container);
  const buttonClassName = classNames("button", styles.button);

  return (
    <LoginContextProvider>
      <Header video="baby-egg">
        {session?.name ? (
          <>
            <Link className={buttonClassName} to="/mitspielen">
              <span>Jetzt mitspielen</span>
              <PiArrowRightBold role="presentation" />
            </Link>
            <UserInfo />
          </>
        ) : (
          <LoginForm prefix="top" />
        )}
      </Header>
      <main>
        <h1>{pkg.short_name}</h1>
        <p className="lead">{pkg.description}</p>
        {date?.isGameOver && <ResultsBanner />}
        <p>
          Jede/r Teilnehmer/in kann <b>bis zu 3 Schätzungen</b> abgeben. Die
          Kombination aus erratenem Geschlecht und dem am nächsten kommenden
          Geburtszeitpunkt gewinnt.
        </p>
        <div className={styles.icons}>
          <CircleIcon>
            <PiGenderIntersex role="presentation" />
          </CircleIcon>
          <PiPlusBold role="presentation" />
          <CircleIcon>
            <PiCalendar role="presentation" />
          </CircleIcon>
          <PiEqualsBold role="presentation" />
          <CircleIcon>
            <PiTrophy role="presentation" />
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
        <aside data-full-bleed data-no-print>
          <div className={className}>
            <LoginForm prefix="bottom" />
          </div>
        </aside>
      ) : null}
    </LoginContextProvider>
  );
};

export default Index;
