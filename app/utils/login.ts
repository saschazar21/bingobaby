const validateSegments = (name: string) => {
  if (name.split(" ").filter((segment) => segment.length > 0).length !== 2) {
    throw new Error("Name muss aus Vor- und Nachname bestehen!");
  }
};

const activeValidators = [validateSegments];

export const formatValue = (name: string) => {
  const trimmed = name.trim();

  activeValidators.forEach((validator) => validator(trimmed));

  return trimmed.split(" ").map((segment) =>
    segment.charAt(0).toUpperCase() + segment.slice(1)
  ).join(" ");
};
