module.exports = {
  "development": {
    "username": "samcatherman",
    "password": null,
    "database": "beatworm_dev",
    "host": process.env.PG_HOST || "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "username": "samcatherman",
    "password": null,
    "database": "beatworm_test",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "username": "samcatherman",
    "password": null,
    "database": "beatworm_production",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}
