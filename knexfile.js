module.exports = {
  development: {
    client: "pg",
    connection: {
      host: "127.0.0.1",
      user: "patrickshushereba",
      password: "",
      database: "appetizen_dev",
    },
    migrations: {
      directory: "./data/migrations",
    },
    seeds: {
      directory: "./data/seeds",
    },
  },

  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: "./data/migrations",
    },
    seeds: {
      directory: "./data/seeds",
    },
  },
};
