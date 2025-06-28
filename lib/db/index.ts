import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const client = neon(process.env.DATABASE_URL!);
export const db = drizzle(process.env.DATABASE_URL!, { schema });
