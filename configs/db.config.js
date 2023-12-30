
module.exports = {
    development: {
        DB_DRIVER: "mongodb",
        DB_HOST: "127.0.0.1",
        DB_PORT: "11011",
        DB_NAME: "library_opac",
        DB_USER: "",
        DB_PASS: "",
    },
    staging: {
        DB_DRIVER: "mongodb",
        DB_HOST: "127.0.0.1",
        DB_PORT: "11011",
        DB_NAME: "library_opac",
        DB_USER: "root",
        DB_PASS: "root",
    },
    production: {
        DB_DRIVER: "mongodb",
        DB_HOST: "127.0.0.1",
        DB_PORT: "11011",
        DB_NAME: "library_opac",
        DB_USER: "root",
        DB_PASS: "root",
    }
}