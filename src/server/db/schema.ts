// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `hg_${name}`);

const users = ["Dirk", "Jezabel", "Julian"] as const;
export const PayedByOptions = [...users, "Jezabel und Julian"] as const;
export type PayedByOptionsType = (typeof PayedByOptions)[number];

export const payments = createTable(
  "payment",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    price: integer("price"),
    payedBy: text("payed_by", { enum: PayedByOptions }),
    usedBy: varchar("used_by", { length: 256 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  }),
);
