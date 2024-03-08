export interface Guess {
  id: string;
  name: string;
  date: string;
  sex: "female" | "male";
}

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
export const GUESSES = "guesses";
export const SESSIONS = "sessions";
export const USERS = "users";
