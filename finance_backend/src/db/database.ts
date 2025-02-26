import { drizzle } from "drizzle-orm/mysql2";

import mysql from 'mysql2/promise';
import {dbConfig} from '../../drizzle.config';

const connection = await mysql.createConnection(dbConfig);
const db = drizzle(connection);
export default db;

