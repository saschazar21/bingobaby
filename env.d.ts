export {};

declare global {
  interface ProcessEnv {
    BIRTHDATE?: string;
    CALCULATED_BIRTHDATE: string;
    COOKIE_SIGNATURE_PASSWORD: string;
    MAX_GUESSES?: string;
    POSTGRES_CONNECTION_STRING: string;
    NODE_ENV: "development" | "production" | "test";
  }
  interface Process {
    env: ProcessEnv;
  }
  let process: Process;
}
