export interface Update {
  version: string;
  date: string;
  description: string;
}

const updates: Update[] = [
  {
    version: "v1.0.0",
    date: "2026-03-01",
    description: "Initial release — dashboard, student management, AI-powered scaffold generation, and assignment library.",
  },
];

export default updates;
