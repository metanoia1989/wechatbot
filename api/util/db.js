const { Sequelize } = require('sequelize')

class DB {
  constructor() {
    if (!DB.instance) {
      const { 
        DB_DATABASE: database,
        DB_USERNAME: username,
        DB_PASSWORD: password,
        DB_TYPE: dialect,
        DB_PREFIX: prefix,
        DB_HOSTNAME: host,
        DB_HOSTPORT: port,
        DB_CHARSET: charset
      } = process.env
      DB.instance = new Sequelize(database, username, password, {
        host, dialect, port, 
        define: {
          schema: prefix,
          schemaDelimiter: '_',
          charset: charset,
        }
      })
    }
  }

  getInstance() {
    return DB.instance;
  }
}

module.exports = DB;
