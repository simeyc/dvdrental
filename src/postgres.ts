import { Pool, type PoolConfig } from "pg";

const PG_CONFIG: PoolConfig = {
  user: "postgres",
  password: "postgres",
  database: "dvdrental",
  port: 8989,
  host: "localhost",
};

let pool: Pool;

export const getPool = () => {
  if (!pool) {
    pool = new Pool(PG_CONFIG);
  }
  return pool;
};
