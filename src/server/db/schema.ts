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

// const users = ["Dirk", "Jezabel", "Julian"] as const;
// export const PayedByOptions = [...users, "Jezabel und Julian"] as const;
// export type PayedByOptionsType = (typeof PayedByOptions)[number];

export const spendings = createTable(
  "spending",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    price: integer("price"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  }),
);

export const spendingsRelations = relations(spendings, ({ many }) => ({
  usersAffected: many(usersToSpendingsAffected, { relationName: "spendings_user" }),
  usersPayed: many(usersToSpendingsPayed, { relationName: "spendings_user" }),
  // distributedBetween: many(users, {
  //   relationName: "distributed_spendings_users",
  // }),
}));

export const users = createTable("user", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 256 }),
  username: varchar("user_name", { length: 256 }).notNull(),
  clerkId: varchar("clerk_id", { length: 256 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});

export const usersRelations = relations(users, ({ many }) => ({
  spendingsAffected: many(usersToSpendingsAffected, { relationName: "spendings_user" }), // spendings that you made
  spendingsPayed: many(usersToSpendingsPayed, { relationName: "spendings_user" }), // spendings that you payed
  // distributedBetween: many(spendings, {
  //   relationName: "distributed_spendings_users",
  // }), // spendings that you participated in
}));

export const usersToSpendingsAffected = createTable(
  "user_to_spending_affected",
  {
    userId: serial("user_id")
      .notNull()
      .references(() => users.id),
    spendingId: serial("spending_id")
      .notNull()
      .references(() => spendings.id),
    amount: integer("amount").notNull(),
  },
  (table) => {
    return {pk: primaryKey({columns: [table.userId, table.spendingId]})}
  }
);

export const usersToSpendingsAffectedRelations = relations(usersToSpendingsAffected, ({ one }) => ({
  user: one(users, {
    fields: [usersToSpendingsAffected.userId],
    references: [users.id]
    
  }),
  spending: one(spendings, {
    fields: [usersToSpendingsAffected.spendingId],
    references: [spendings.id]
  }),
}));


export const usersToSpendingsPayed = createTable(
  "user_to_spending_payed",
  {
    userId: serial("user_id")
      .notNull()
      .references(() => users.id),
    spendingId: serial("spending_id")
      .notNull()
      .references(() => spendings.id),
    amount: integer("amount").notNull(),
  },
  (table) => {
    return {pk: primaryKey({columns: [table.userId, table.spendingId]})}
  }
);

export const usersToSpendingsPayedRelations = relations(usersToSpendingsPayed, ({ one }) => ({
  user: one(users, {
    fields: [usersToSpendingsPayed.userId],
    references: [users.id]
  
  }),
  spending: one(spendings, {
    fields: [usersToSpendingsPayed.spendingId],
    references: [spendings.id]
  
  }),
}));

// export const usersToSpendingsRelations = relations(payedBy);
