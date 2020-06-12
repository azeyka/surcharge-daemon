// @flow

const Knex = require('knex');
const { frontendDb } = require('../config.js');

class DB {
    static frontend() {
        if (!DB.privFrontend) {
            DB.privFrontend = Knex({
                client: 'pg',
                connection: {
                    host: frontendDb.host,
                    port: frontendDb.port,
                    user: frontendDb.user,
                    password: frontendDb.pwd,
                    database: frontendDb.db,
                },
                pool: frontendDb.pool || { min: 0, max: 5 },
                useNullAsDefault: true,
            });
        }
        return DB.privFrontend;
    }

    static async release() {
        const {
            privFrontend,
        } = DB;
        if (privFrontend) {
            console.info('disconnect from frontend DB');
            await privFrontend.destroy();
            delete DB.privFrontend;
        }
    }
}

module.exports = DB;

