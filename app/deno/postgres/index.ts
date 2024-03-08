import { generate } from "https://deno.land/std@0.218.2/uuid/v1.ts";
import { Client } from "https://deno.land/x/postgres@v0.19.2/mod.ts";
import { CREATE_BROWSER } from "./queries/browsers.ts";
import {
  CREATE_SESSION,
  DELETE_SESSION_BY_ID,
  EXPIRE_SESSION_BY_ID,
  UPDATE_SESSION_BY_ID,
} from "./queries/sessions.ts";
import { Browser } from "../../utils/browser.ts";
import { SESSION_BY_ID } from "./queries/sessions.ts";
import { GUESSES_BY_NAME } from "./queries/guesses.ts";
import { Guess, Session } from "./types.d.ts";
import { CREATE_GUESS } from "./queries/guesses.ts";
import { UPDATE_GUESS_BY_ID } from "./queries/guesses.ts";
import { GUESS_BY_ID } from "./queries/guesses.ts";
import { DELETE_GUESS_BY_ID } from "./queries/guesses.ts";
import { VALID_GUESSES } from "./queries/guesses.ts";

export class Database {
  private client: Client;

  static generateUUID() {
    return generate();
  }

  constructor(connection: string) {
    this.client = new Client(connection);
  }

  async getGuess(id: string) {
    try {
      await this.client.connect();

      const { rows } = await this.client.queryObject<
        Pick<Guess, "date" | "sex">
      >(GUESS_BY_ID, [id]);

      return rows[0] ?? null;
    } catch (e) {
      console.error(e);

      throw new Error("Fehler beim Abrufen der Schätzung.");
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

      throw new Error("Fehler beim Abrufen der Schätzungen.");
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

      throw new Error(
        "Deine Schätzungen konnten nicht geladen werden.",
      );
    } finally {
      await this.client.end();
    }
  }

  async createGuess(data: Omit<Guess, "id">) {
    try {
      await this.client.connect();

      const transaction = this.client.createTransaction("create_guess");

      await transaction.begin();

      const { rows: guesses } = await transaction.queryObject<Guess>(
        GUESSES_BY_NAME,
        [data.name],
      );

      if (guesses.length >= 3) {
        await transaction.rollback();

        throw new Error(
          "Maximale Anzahl der erlaubten Schätzungen ist bereits erreicht.",
        );
      }

      const { rows } = await transaction.queryObject<
        Pick<Guess, "id" | "date" | "sex">
      >(
        CREATE_GUESS,
        [Database.generateUUID(), data.name, data.date, data.sex],
      );

      if (!rows.length ?? !rows[0]?.id) {
        await transaction.rollback();

        throw new Error("Schätzung konnte nicht angelegt werden.");
      }

      await transaction.commit();

      return rows[0];
    } catch (e) {
      console.error(e);

      throw new Error("Schätzung konnte nicht angelegt werden.");
    } finally {
      await this.client.end();
    }
  }

  async updateGuess(data: Partial<Guess> & Pick<Guess, "id" | "name">) {
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

        throw new Error(
          "Die ID der Schätzung konnte dem Nutzer nicht zugeordnet werden.",
        );
      }

      const { rows } = await transaction.queryObject<
        Pick<Guess, "id" | "date" | "sex">
      >(
        UPDATE_GUESS_BY_ID,
        [data.id, data.date, data.sex],
      );

      if (!rows.length ?? !rows[0]?.id) {
        await transaction.rollback();

        throw new Error("Schätzung konnte nicht geändert werden.");
      }

      await transaction.commit();

      return rows[0];
    } catch (e) {
      console.error(e);

      throw new Error("Schätzung konnte nicht geändert werden.");
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

        throw new Error(
          "Die ID der Schätzung konnte dem Nutzer nicht zugeordnet werden.",
        );
      }

      const { rows } = await transaction.queryObject<
        Pick<Guess, "id">
      >(
        DELETE_GUESS_BY_ID,
        [data.id],
      );

      if (!rows.length ?? !rows[0]?.id) {
        await transaction.rollback();

        throw new Error("Schätzung konnte nicht gelöscht werden.");
      }

      await transaction.commit();

      return rows[0];
    } catch (e) {
      console.error(e);

      throw new Error("Schätzung konnte nicht gelöscht werden.");
    } finally {
      await this.client.end();
    }
  }

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
        throw new Error("Session not found.");
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

      throw new Error("Session nicht gefunden.");
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
        throw new Error("Failed to create session!");
      }

      await transaction.commit();

      return session[0];
    } catch (e) {
      console.error(e);

      throw new Error(
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
        throw new Error("Failed to update session!");
      }

      return rows[0];
    } catch (e) {
      console.error(e);

      throw new Error("Der Updateversuch der Session ist fehlgeschlagen.");
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
