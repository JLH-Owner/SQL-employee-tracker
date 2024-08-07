const Sequelize = require('sequelize-cockroachdb')
require('dotenv').config();

const connectionString = process.env.DATABASE_URL ({
    $env:DATABASE_URL = "postgresql://jlh_bootcamp:sAHRYGgaJ0bhNE4pIFVmgYg@employee-tracker-7888.g8z.gcp-us-east1.cockroachlabs.cloud:26257/employee-tracker?sslmode=verify-full"

})

const sequelize = new Sequelize(connectionString);

module.exports = sequelize;

