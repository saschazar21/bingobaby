import { dateObject } from "./day";

export const validateLength = (name: string) => {
  if (!name?.length) {
    throw new Error("Feld darf nicht leer sein.");
  }
};

export const validateSegments = (name: string) => {
  if (name.split(" ").filter((segment) => segment.length > 0).length !== 2) {
    throw new Error("Name muss aus Vor- und Nachname bestehen!");
  }
};

export const validateAgainstFutureDate = (date: string) => {
  if (
    dateObject(date) > dateObject(new Date().toISOString())
  ) {
    throw new Error("Gewähltes Datum kann nicht in der Zukunft liegen.");
  }
};

export const validateAgainstPastDate = (date: string) => {
  if (
    dateObject(date) < dateObject(new Date().toISOString())
  ) {
    throw new Error("Gewähltes Datum kann nicht in der Vergangenheit liegen.");
  }
};
