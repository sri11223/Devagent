export type User = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: Date;
};

export type PublicUser = Omit<User, "passwordHash">;
