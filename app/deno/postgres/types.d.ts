export type WithoutTimestamps<T> = Omit<T, "created_at" | "updated_at">;
export type WithoutName<T> = Omit<T, "name">;

export interface Guess {
  id: string;
  name: string;
  date: string;
  sex: "female" | "male";
  created_at: string;
  updated_at: string;
}
export type GuessAnonymous = WithoutName<Guess>;
export type GuessData = WithoutTimestamps<GuessAnonymous>;
export type GuessInput = WithoutTimestamps<Omit<Guess, "id">>;

export interface Session {
  id: string;
  name?: string;
  error?: string;
  active: boolean;
  browser?: string;
  created_at: string;
  updated_at: string;
}

export const BROWSERS = "browsers";
export const DATES = "dates";
export const GUESSES = "guesses";
export const SESSIONS = "sessions";
export const USERS = "users";
