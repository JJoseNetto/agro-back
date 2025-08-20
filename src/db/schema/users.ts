import { pgTable, serial, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { userRoleEnum } from "../enums/user-role";

export const users = pgTable("users", {
  id: serial('id').primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  nome: varchar("nome", { length: 255 }).notNull(),
  role: userRoleEnum("role").notNull().default('user'),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
});
