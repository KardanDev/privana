export const repository = "KardanDev/privana";
export const linearProject = "ad8f93d2-3056-43a5-8ec3-1c9d8dfb1e8a";
export const linearTeam = "c0f2059d-05f0-49ed-987d-3ba9aed00c0e";
export const requiredWorkflows = [
  {
    file: "quality.yml",
    jobs: ["Repository checks", "Quality gate"],
    name: "Quality",
  },
  {
    file: "pull-request-contract.yml",
    jobs: ["Pull request contract"],
    name: "Pull request contract",
  },
];
