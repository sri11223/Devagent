export type Project = {
  id: string;
  ownerId: string;
  name: string;
  description: string | null;
  status: "planned" | "active" | "completed";
  createdAt: Date;
  updatedAt: Date;
};
