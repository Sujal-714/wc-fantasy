"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const config_1 = require("../config");
const pool = new pg_1.Pool({
    connectionString: config_1.config.database_url,
});
// Test the connection on startup
pool.connect((err, client, release) => {
    if (err) {
        console.error('DB connection failed:', err.message);
    }
    else {
        console.log('DB connected successfully');
        release();
    }
});
exports.default = pool;
