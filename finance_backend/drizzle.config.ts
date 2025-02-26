import { defineConfig } from "drizzle-kit";

export const dbConfig = {
    host: 'localhost',
    user: 'root',
    database: 'finance_ai',
} as const;


export default defineConfig({
    dialect: "mysql",
    schema: "./src/db/schema/*",
    out: "./drizzle",
   ...dbConfig
});