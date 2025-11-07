/**
 * Script para cargar variables de entorno desde settings.json
 * y ejecutarlas antes de correr tests o lambdas localmente.
 */

const fs = require("fs");
const { execSync } = require("child_process");

const settings = JSON.parse(fs.readFileSync("./settings.json", "utf-8"));

const envVars = settings.variables.set.DEV || {};

Object.entries(envVars).forEach(([key, value]) => {
  process.env[key] = value;
});

execSync("npm test", { stdio: "inherit", env: process.env });
