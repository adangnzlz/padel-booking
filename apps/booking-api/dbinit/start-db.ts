import { execSync } from "child_process";
import dotenv from "dotenv";
import { parse } from "pg-connection-string";
import fs from "fs";
import path from "path";

// Load environment
const env = process.env.NODE_ENV || "dev";
dotenv.config({ path: `.env.${env}` });

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error("DATABASE_URL not defined in .env." + env);
}

const { user, password, host, port, database } = parse(dbUrl);

if (!user || !password || !host || !port || !database) {
  throw new Error("DATABASE_URL is invalid or missing required fields");
}

// Databases to create in the container
const databasesToCreate = ["finance_dev", "finance_test"];
const containerName = "pgdb";

// Load init.sql file
const initSqlPath = path.resolve(__dirname, "init.sql");
if (!fs.existsSync(initSqlPath)) {
  throw new Error(`init.sql not found at ${initSqlPath}`);
}
const initSql = fs.readFileSync(initSqlPath, "utf-8");

try {
  let containerExists = false;
  try {
    execSync(`docker ps -a --format '{{.Names}}' | grep -w ${containerName}`, {
      stdio: "pipe",
    });
    containerExists = true;
  } catch (_) {
    containerExists = false;
  }

  if (!containerExists) {
    console.log("🧱 Creating Docker container...");
    execSync(
      `docker run --name ${containerName} -e POSTGRES_USER=${user} -e POSTGRES_PASSWORD=${password} -e POSTGRES_DB=${databasesToCreate[0]} -p ${port}:5432 -d postgres`,
      { stdio: "inherit" }
    );

    // Wait for Postgres to start
    console.log("⏳ Waiting for Postgres to start...");
    execSync("sleep 3");

    // Create the additional databases
    const additionalDbs = databasesToCreate.slice(1);
    for (const db of additionalDbs) {
      console.log(`🛠️  Creating database: ${db}`);
      execSync(
        `docker exec -u ${user} ${containerName} psql -U ${user} -c "CREATE DATABASE ${db};"`,
        { stdio: "inherit" }
      );
    }

    // Initialize tables in each DB using init.sql
    for (const db of databasesToCreate) {
      console.log(`📦 Initializing tables in: ${db}`);
      execSync(
        `docker exec -i -u ${user} ${containerName} psql -U ${user} -d ${db}`,
        { input: initSql, stdio: ["pipe", "inherit", "inherit"] }
      );
    }
  } else {
    console.log("🔁 Container already exists. Starting it...");
    execSync(`docker start ${containerName}`, { stdio: "inherit" });
  }
} catch (err) {
  console.error("❌ Error starting container:", err);
  process.exit(1);
}
