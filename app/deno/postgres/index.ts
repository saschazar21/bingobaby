import { generate } from "https://deno.land/std@0.218.2/uuid/v1.ts";
import { Client } from "https://deno.land/x/postgres@v0.19.2/mod.ts";
import { CREATE_BROWSER } from "./queries/browsers.ts";
import { CREATE_SESSION, EXPIRE_SESSION_BY_ID } from "./queries/sessions.ts";
import { Browser } from "../../utils/browser.ts";

export class Database {
  private client: Client;

  static generateUUID() {
    return generate();
  }

  constructor(connection: string) {
    this.client = new Client(connection);
  }

  async createSession(name: string, browser: Browser) {
    try {
      await this.client.connect();
      const transaction = this.client.createTransaction("create_session");

      const { rows: browserResult } = await transaction.queryObject<
        { user_agent: string }
      >(CREATE_BROWSER, [
        browser.user_agent,
        browser.name,
        browser.version,
        browser.device,
        browser.os,
      ]);

      const { rows: session } = await transaction.queryObject<{ id: string }>(
        CREATE_SESSION,
        [Database.generateUUID(), name, browserResult[0].user_agent],
      );

      if (!session.length || !session[0]?.id) {
        await transaction.rollback();
        throw new Error("Failed to create session!");
      }

      return transaction.commit().then(() => session[0]);
    } catch (e) {
      console.error(e);

      throw new Error("Der Loginversuch ist fehlgeschlagen.");
    } finally {
      await this.client.end();
    }
  }

  async expireSession(id: string) {
    try {
      await this.client.connect();
      await this.client.queryObject(EXPIRE_SESSION_BY_ID, [id]);
    } catch (e) {
      console.error(e);
    } finally {
      await this.client.end();
    }
  }
}
