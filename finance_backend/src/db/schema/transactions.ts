
import { mysqlTable } from "drizzle-orm/mysql-core"
import * as t from "drizzle-orm/mysql-core";


export const transactionTable = mysqlTable('transactions', {
    id: t.int().primaryKey().autoincrement(),
    amount: t.double(),
    category: t.varchar("category", { length: 255 }),
    currency: t.varchar("currency", { length: 255 }),
    date: t.datetime(),
    description: t.varchar("description", { length: 255 }),
    merchant: t.varchar("merchant", { length: 255 }),
    type: t.varchar("type", { length: 255 }),
},
    (table) => [
        t.uniqueIndex("category_idx").on(table.category),
    ]
);