import { pgTable, serial, numeric, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { produtores } from "./produtor";

export const fazendas = pgTable("fazendas", {
  id: serial("id").primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  cidade: varchar("cidade", { length: 100 }).notNull(),
  estado: varchar("estado", { length: 2 }).notNull(), // UF
  areaTotal: numeric("area_total", { precision: 10, scale: 2 }).notNull(),
  areaAgricultavel: numeric("area_agricultavel", { precision: 10, scale: 2 }).notNull(),
  areaVegetacao: numeric("area_vegetacao", { precision: 10, scale: 2 }).notNull(),
  produtorId: integer("produtor_id").notNull().references(() => produtores.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});
