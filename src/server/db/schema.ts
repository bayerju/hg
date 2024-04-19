// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
  primaryKey,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `hg_${name}`);

export const spendings = createTable(
  "spending",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
    amount: integer("amount").notNull(),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  }),
);

export const spendingsRelations = relations(spendings, ({ many }) => ({
  usersAffected: many(usersToSpendingsAffected),
  usersPayed: many(usersToSpendingsPayed),
}));

export const users = createTable("user", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 256 }),
  username: varchar("user_name", { length: 256 }).notNull(),
  clerkId: varchar("clerk_id", { length: 256 }).unique().notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});

export const usersRelations = relations(users, ({ many }) => ({
  spendingsAffected: many(usersToSpendingsAffected),
  spendingsPayed: many(usersToSpendingsPayed),
}));

export const usersToSpendingsAffected = createTable(
  "user_to_spending_affected",
  {
    spendingId: serial("spending_id")
      .notNull()
      .references(() => spendings.id),
    clerkId: varchar("clerk_id", { length: 256 }).references(
      () => users.clerkId,
    ),
  },
  (table) => {
    return { pk: primaryKey({ columns: [table.clerkId, table.spendingId] }) };
  },
);

export const usersToSpendingsAffectedRelations = relations(
  usersToSpendingsAffected,
  ({ one }) => ({
    user: one(users, {
      fields: [usersToSpendingsAffected.clerkId],
      references: [users.clerkId],
      // relationName: "user_to_spending_affected",
    }),
    spending: one(spendings, {
      fields: [usersToSpendingsAffected.spendingId],
      references: [spendings.id],
    }),
  }),
);

export const usersToSpendingsPayed = createTable(
  "user_to_spending_payed",
  {
    clerkId: varchar("clerk_id", { length: 256 }).references(
      () => users.clerkId,
    ),
    spendingId: serial("spending_id")
      .notNull()
      .references(() => spendings.id),
  },
  (table) => {
    return { pk: primaryKey({ columns: [table.clerkId, table.spendingId] }) };
  },
);

export const usersToSpendingsPayedRelations = relations(
  usersToSpendingsPayed,
  ({ one }) => ({
    user: one(users, {
      fields: [usersToSpendingsPayed.clerkId],
      references: [users.clerkId],
    }),
    spending: one(spendings, {
      fields: [usersToSpendingsPayed.spendingId],
      references: [spendings.id],
    }),
  }),
);

