import { pgTable, serial, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { users } from "./users";

export const produtores = pgTable("produtores", {
  id: serial('id').primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  cpfOuCnpj: varchar("cpf_ou_cnpj", { length: 18 }).unique().notNull(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});
