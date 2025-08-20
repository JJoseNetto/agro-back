import { pgTable, serial, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { fazendas } from "./fazendas";
import { safras } from "./safras";

export const culturasPlantadas = pgTable("culturas_plantadas", {
  id: serial("id").primaryKey(),
  nome: varchar("nome", { length: 100 }).notNull(), // Ex: Soja, Milho
  fazendaId: integer("fazenda_id").notNull().references(() => fazendas.id, { onDelete: "cascade" }),
  safraId: integer("safra_id").notNull().references(() => safras.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});