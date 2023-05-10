const { Client } = require('pg');
const colors = require('ansi-colors');
class dataMapper{
    db = null;
    /**
     * 
     * @param {string} table 
     * @param {object} data 
     */
    async createOne(table, data){
        try {
            const {rows} = await this.db.query(`INSERT INTO ${table} (${Object.keys(data).join(',')}) VALUES (${Object.keys(data).map((_, index) => `$${index + 1}`).join(',')}) RETURNING *`, Object.values(data));
            return rows[0];
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * @typedef {object} data
     * @property {string} data.field
     * @property {array<string>} data.value
     * @param {string} table 
     * @param {array<data>} datas
     * @returns 
     */
    async createTable(table,data){
        try {
            const {rows} = await this.db.query(`CREATE TABLE IF NOT EXISTS ${table} (${data.map((data) => `${data.field} ${data.value.join(' ')}`).join(',')})`);
            return rows[0];
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * @param {string} table
     * */
    async dropTable(table){
        try {
            const {rows} = await this.db.query(`DROP TABLE IF EXISTS ${table}`);
            return rows[0];
        } catch (error) {
            console.error(error);
        }
    }

    async init(data){
       try {
            this.db = new Client(data);
            await this.db.connect();
            console.log(colors.greenBright('Database connected'));
            return this;
       } catch (error) {
            console.log(colors.redBright('Database not connected'));
            console.error(error);
       }
    }

    async getAllTable(){
        try {
            const {rows} = await this.db.query(`SELECT "table_name" as "table" FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'`);
            return rows;
        } catch (error) {
            console.error(error);
        }
    }

    async getTypeOfColumns(table){
        try {
            const {rows} = await this.db.query(`SELECT column_name AS "column", data_type AS "type" FROM information_schema.columns WHERE table_name = '${table}'`);
            return rows;
        } catch (error) {
            console.error(error);
        }
    }
    

}

module.exports = new dataMapper();