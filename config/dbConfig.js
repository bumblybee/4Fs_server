require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    host: "127.0.0.1",
    dialect: "postgres",
    port: 5433,
    seederStorage: "json",
  },
  production: {
    use_env_variable: DATABASE_URL,
    dialect: "postgres",
    seederStorage: "json",
    dialectOptions: {
      ssl: true,
    },
  },
};
