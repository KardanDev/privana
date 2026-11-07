export const requiredSections = [
  "Summary",
  "Scope",
  "Acceptance criteria",
  "Validation",
  "Evidence",
  "Data and rollout",
  "Review notes",
];

export const reviewBudget = {
  files: 30,
  lines: 800,
  targetFiles: 20,
  targetLines: 400,
};
export const generatedPaths = [
  /^bun\.lock$/,
  /^packages\/db\/prisma\/generated\//,
];
