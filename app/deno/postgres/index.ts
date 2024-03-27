import { generate } from "https://deno.land/std@0.218.2/uuid/v1.ts";
import { Client } from "https://deno.land/x/postgres@v0.19.2/mod.ts";
import { CREATE_BROWSER } from "./queries/browsers.ts";
import {
  ALL_DATES,
  CREATE_DATE,
  DATE_BY_ID,
  DELETE_DATE_BY_ID,
  UPDATE_DATE_BY_ID,
} from "./queries/dates.ts";
import {
  CLOSEST_GUESSES_BY_SEX,
  CREATE_GUESS,
  DELETE_GUESS_BY_ID,
  GUESS_BY_ID,
  GUESSES_BY_NAME,
  UPDATE_GUESS_BY_ID,
  VALID_GUESSES,
} from "./queries/guesses.ts";
import {
  CREATE_SESSION,
  DELETE_SESSION_BY_ID,
  EXPIRE_SESSION_BY_ID,
  SESSION_BY_ID,
  UPDATE_SESSION_BY_ID,
} from "./queries/sessions.ts";
import {
  Guess,
  GuessAnonymous,
  GuessData,
  GuessInput,
  Session,
} from "./types.d.ts";
import { dateObject, LOCK_DATE } from "./utils.ts";
import { Browser } from "../../utils/browser.ts";
import { MAX_GUESSES } from "../../utils/constants.ts";
import { SERVER_ERROR, ServerError } from "../../utils/error.ts";
import { BIRTHDATE } from "../../utils/types.ts";

export class Database {
  private client: Client;

  static generateUUID() {
    return generate();
  }

  constructor(connection: string) {
    this.client = new Client(connection);
  }

  /*
   * Guess section
   * --------------------------------------------------------------------------
   */
  async getGuess(id: string) {
    try {
      await this.client.connect();

      const { rows } = await this.client.queryObject<
        Pick<Guess, "date" | "sex">
      >(GUESS_BY_ID, [id]);

      return rows[0] ?? null;
    } catch (e) {
      console.error(e);

      throw new ServerError("Fehler beim Abrufen der Schätzung.");
    } finally {
      await this.client.end();
    }
  }

  async getAllValidGuesses() {
    try {
      await this.client.connect();

      const { rows } = await this.client.queryObject<
        Pick<Guess, "date" | "sex">
      >(VALID_GUESSES);

      return rows;
    } catch (e) {
      console.error(e);

      throw (e.name === SERVER_ERROR)
        ? e
        : new ServerError("Fehler beim Abrufen der Schätzungen.");
    } finally {
      await this.client.end();
    }
  }

  async getWinningGuesses() {
    try {
      await this.client.connect();

      const { rows: datesRow } = await this.client.queryObject<GuessData>(
        DATE_BY_ID,
        [BIRTHDATE],
      );

      if (!datesRow[0]?.date) {
        throw new ServerError(
          "Kein Geburtsdatum verfügbar, dadurch keine Auswertung möglich.",
        );
      }

      const { date, sex } = datesRow[0];

      const { rows } = await this.client.queryObject<
        Pick<Guess, "name" | "date">
      >(CLOSEST_GUESSES_BY_SEX, [date, sex]);

      return rows;
    } catch (e) {
      console.error(e);

      throw (e.name === SERVER_ERROR)
        ? e
        : new ServerError("Fehler beim Abrufen der Auswertung.");
    } finally {
      await this.client.end();
    }
  }

  async getGuessesByName(name: string) {
    try {
      await this.client.connect();

      const { rows } = await this.client.queryObject(GUESSES_BY_NAME, [name]);

      return rows;
    } catch (e) {
      console.error(e);

      throw (e.name === SERVER_ERROR) ? e : new ServerError(
        "Deine Schätzungen konnten nicht geladen werden.",
      );
    } finally {
      await this.client.end();
    }
  }

  async createGuess(data: GuessInput) {
    if (dateObject(new Date().toISOString()) > LOCK_DATE) {
      throw new ServerError(
        `Seit ${
          LOCK_DATE.format("D. MMMM YYYY, HH:mm Uhr")
        } werden keine neuen Schätzungen mehr akzeptiert.`,
        400,
      );
    }

    if (
      data.date && dateObject(data.date) < dateObject(new Date().toISOString())
    ) {
      throw new ServerError(
        "Das Datum der Schätzung kann nicht in der Vergangenheit liegen.",
        400,
      );
    }

    try {
      await this.client.connect();

      const transaction = this.client.createTransaction("create_guess");

      await transaction.begin();

      const { rows: dateRows } = await transaction.queryObject<
        Pick<Guess, "id" | "date">
      >(DATE_BY_ID, ["birthdate"]);

      if (
        dateRows[0]?.date &&
        dateObject(new Date().toISOString()) > dateObject(dateRows[0].date)
      ) {
        await transaction.rollback();

        throw new ServerError(
          "Das Spiel ist bereits beendet. Danke für deine Teilnahme!",
          400,
        );
      }

      const { rows: guesses } = await transaction.queryObject<Guess>(
        GUESSES_BY_NAME,
        [data.name],
      );

      if (guesses.length >= MAX_GUESSES) {
        await transaction.rollback();

        throw new ServerError(
          "Maximale Anzahl der erlaubten Schätzungen ist bereits erreicht.",
          400,
        );
      }

      const { rows } = await transaction.queryObject<
        Omit<GuessAnonymous, "created_at">
      >(
        CREATE_GUESS,
        [Database.generateUUID(), data.name, data.date, data.sex],
      );

      if (!rows[0]?.id) {
        await transaction.rollback();

        throw new ServerError("Schätzung konnte nicht angelegt werden.");
      }

      await transaction.commit();

      return rows[0];
    } catch (e) {
      console.error(e);

      throw (e.name === SERVER_ERROR)
        ? e
        : new ServerError("Schätzung konnte nicht angelegt werden.");
    } finally {
      await this.client.end();
    }
  }

  async updateGuess(data: Partial<GuessData> & Pick<Guess, "id" | "name">) {
    if (dateObject(new Date().toISOString()) > LOCK_DATE) {
      throw new ServerError(
        `Seit ${
          LOCK_DATE.format("D. MMMM YYYY HH:mm")
        } Uhr werden keine Änderungen mehr akzeptiert.`,
        400,
      );
    }

    if (
      data.date && dateObject(data.date) < dateObject(new Date().toISOString())
    ) {
      throw new ServerError(
        "Das Datum der Schätzung kann nicht in der Vergangenheit liegen.",
        400,
      );
    }

    try {
      await this.client.connect();

      const transaction = this.client.createTransaction("create_guess");

      await transaction.begin();

      const { rows: dateRows } = await transaction.queryObject<
        Pick<GuessData, "id" | "date">
      >(DATE_BY_ID, ["birthdate"]);

      if (
        dateRows[0]?.date &&
        dateObject(new Date().toISOString()) > dateObject(dateRows[0].date)
      ) {
        await transaction.rollback();

        throw new ServerError(
          "Das Spiel ist bereits beendet. Danke für deine Teilnahme!",
          400,
        );
      }

      const { rows: guesses } = await transaction.queryObject<Guess>(
        GUESSES_BY_NAME,
        [data.name],
      );

      const guess = guesses.find(({ id }) => id === data.id);

      if (!guess) {
        await transaction.rollback();

        throw new ServerError(
          "Die ID der Schätzung konnte dem Nutzer nicht zugeordnet werden.",
          400,
        );
      }

      if (dateObject(guess.date) < dateObject(new Date().toISOString())) {
        await transaction.rollback();

        throw new ServerError(
          "Eine bereits abgelaufene Schätzung kann nicht mehr verändert werden.",
          400,
        );
      }

      const { rows } = await transaction.queryObject<GuessData>(
        UPDATE_GUESS_BY_ID,
        [data.id, data.date, data.sex],
      );

      if (!rows[0]?.id) {
        await transaction.rollback();

        throw new ServerError("Schätzung konnte nicht geändert werden.");
      }

      await transaction.commit();

      return rows[0];
    } catch (e) {
      console.error(e);

      throw (e.name === SERVER_ERROR)
        ? e
        : new ServerError("Schätzung konnte nicht geändert werden.");
    } finally {
      await this.client.end();
    }
  }

  async deleteGuess(data: Pick<Guess, "id" | "name">) {
    try {
      await this.client.connect();

      const transaction = this.client.createTransaction("create_guess");

      await transaction.begin();

      const { rows: guesses } = await transaction.queryObject<Guess>(
        GUESSES_BY_NAME,
        [data.name],
      );

      if (!guesses.some(({ id }) => id === data.id)) {
        await transaction.rollback();

        throw new ServerError(
          "Die ID der Schätzung konnte dem Nutzer nicht zugeordnet werden.",
          400,
        );
      }

      const { rows } = await transaction.queryObject<Pick<Guess, "id">>(
        DELETE_GUESS_BY_ID,
        [data.id],
      );

      if (!rows[0]?.id) {
        await transaction.rollback();

        throw new ServerError("Schätzung konnte nicht gelöscht werden.");
      }

      await transaction.commit();

      return rows[0];
    } catch (e) {
      console.error(e);

      throw (e.name === SERVER_ERROR)
        ? e
        : new ServerError("Schätzung konnte nicht gelöscht werden.");
    } finally {
      await this.client.end();
    }
  }

  /*
   * Date section
   * ----------------------------------------------------------------------------
   */
  async getDate(id: string) {
    try {
      await this.client.connect();

      const { rows } = await this.client.queryObject<GuessData>(DATE_BY_ID, [
        id,
      ]);

      return rows[0] ?? null;
    } catch (e) {
      console.error(e);

      throw new ServerError("Abrufen des Datums fehlgeschlagen.");
    } finally {
      await this.client.end();
    }
  }

  async getAllDates() {
    try {
      await this.client.connect();

      const { rows } = await this.client.queryObject<GuessData>(ALL_DATES);

      return rows;
    } catch (e) {
      console.error(e);

      throw new ServerError("Abrufen der Daten fehlgeschlagen.");
    } finally {
      await this.client.end();
    }
  }

  async createDate(data: GuessData) {
    try {
      await this.client.connect();

      const { rows } = await this.client.queryObject<GuessData>(CREATE_DATE, [
        data.id,
        data.date,
        data.sex,
      ]);

      if (!rows[0]?.date) {
        throw new ServerError("Anlegen des Datums fehlgeschlagen.");
      }

      return rows[0];
    } catch (e) {
      console.error(e);

      throw (e.name === SERVER_ERROR)
        ? e
        : new ServerError("Anlegen des Datums fehlgeschlagen.");
    } finally {
      await this.client.end();
    }
  }

  async updateDate(data: GuessData) {
    try {
      await this.client.connect();

      const { rows } = await this.client.queryObject<GuessData>(
        UPDATE_DATE_BY_ID,
        [data.id, data.date, data.sex],
      );

      if (!rows[0]?.date) {
        throw new ServerError("Ändern des Datums fehlgeschlagen.");
      }

      return rows[0];
    } catch (e) {
      console.error(e);

      throw (e.name === SERVER_ERROR)
        ? e
        : new ServerError("Ändern des Datums fehlgeschlagen.");
    } finally {
      await this.client.end();
    }
  }

  async deleteDate(id: string) {
    try {
      await this.client.connect();

      const { rows } = await this.client.queryObject<GuessData>(
        DELETE_DATE_BY_ID,
        [id],
      );

      if (!rows[0].date) {
        throw new ServerError("Löschen des Datums fehlgeschlagen.");
      }

      return rows[0];
    } catch (e) {
      console.error(e);

      throw (e.name === SERVER_ERROR)
        ? e
        : new ServerError("Löschen des Datums fehlgeschlagen.");
    } finally {
      await this.client.end();
    }
  }

  /*
   * Session section
   * --------------------------------------------------------------------------
   */
  async getSession(id: string) {
    try {
      await this.client.connect();

      const transaction = this.client.createTransaction(
        "delete_if_session_contains_error",
      );

      await transaction.begin();

      const { rows } = await transaction.queryObject<
        Pick<Session, "name" | "error">
      >(SESSION_BY_ID, [
        id,
      ]);

      if (!rows?.length) {
        await transaction.rollback();
        throw new ServerError("Session nicht gefunden.", 404);
      }

      if (rows[0].error) {
        await transaction.queryObject<Pick<Session, "id">>(
          DELETE_SESSION_BY_ID,
          [id],
        );
      }

      await transaction.commit();

      return rows[0];
    } catch (e) {
      console.error(e);

      throw (e.name === SERVER_ERROR)
        ? e
        : new ServerError("Session nicht gefunden.", 404);
    } finally {
      await this.client.end();
    }
  }

  async createSession(
    data: Omit<Partial<Session>, "browser"> & { browser: Browser },
  ) {
    const { name, error, browser } = data;
    try {
      await this.client.connect();

      const transaction = this.client.createTransaction("create_session");
      await transaction.begin();

      await transaction.queryObject<
        { user_agent: string }
      >(CREATE_BROWSER, [
        browser.user_agent,
        browser.name,
        browser.version,
        browser.device,
        browser.os,
      ]);

      const { rows: session } = await transaction.queryObject<
        Pick<Session, "id" | "name">
      >(
        CREATE_SESSION,
        [Database.generateUUID(), name, browser.user_agent, error],
      );

      if (!session.length) {
        await transaction.rollback();
        throw new ServerError("Fehler beim Erstellen der Session.", 400);
      }

      await transaction.commit();

      return session[0];
    } catch (e) {
      console.error(e);

      throw (e.name === SERVER_ERROR) ? e : new ServerError(
        "Der Loginversuch ist fehlgeschlagen. Bitte Vorname und Nachname kontrollieren.",
      );
    } finally {
      await this.client.end();
    }
  }

  async updateSession(id: string, data: Partial<Session>) {
    try {
      await this.client.connect();
      const { rows } = await this.client.queryObject<
        Pick<Session, "id" | "name">
      >(
        UPDATE_SESSION_BY_ID,
        [id, data.name, data.browser, data.error, data.active],
      );

      if (!rows.length) {
        throw new ServerError(
          "Der Updateversuch der Session ist fehlgeschlagen.",
        );
      }

      return rows[0];
    } catch (e) {
      console.error(e);

      throw (e.name === SERVER_ERROR) ? e : new ServerError(
        "Der Updateversuch der Session ist fehlgeschlagen.",
      );
    } finally {
      await this.client.end();
    }
  }

  async expireSession(id: string) {
    try {
      await this.client.connect();
      await this.client.queryObject<Pick<Session, "id">>(EXPIRE_SESSION_BY_ID, [
        id,
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      await this.client.end();
    }
  }
}
