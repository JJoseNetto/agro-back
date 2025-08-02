import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";
import { fazendas } from "./fazendas";
import { safras } from "./safras";

export const culturasPlantadas = pgTable("culturas_plantadas", {
  id: serial("id").primaryKey(),
  nome: varchar("nome", { length: 100 }).notNull(), // Ex: Soja, Milho
  fazendaId: serial("fazenda_id").notNull().references(() => fazendas.id, { onDelete: "cascade" }),
  safraId: serial("safra_id").notNull().references(() => safras.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});