import { pgTable, serial, varchar, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { userRoleEnum } from "../enums/user-role";

export const users = pgTable("users", {
  id: serial('id').primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  nome: varchar("nome", { length: 255 }).notNull(),
  role: userRoleEnum("role").notNull().default('user'),
  isActive: integer("is_active").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updateAt: timestamp("updated_at")
});
