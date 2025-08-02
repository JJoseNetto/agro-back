import { pgTable, serial, integer, timestamp } from "drizzle-orm/pg-core";

export const safras = pgTable("safras", {
  id: serial("id").primaryKey(),
  ano: integer("ano").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});