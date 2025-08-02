import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

export const produtores = pgTable("produtores", {
  id: serial('id').primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  cpfOuCnpj: varchar("cpf_ou_cnpj", { length: 18 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
