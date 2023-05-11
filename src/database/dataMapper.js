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
            const {rows} = await this.db.query(`INSERT INTO "${table}" (${Object.keys(data).map((key) => `"${key}"`).join(',')}) VALUES (${Object.keys(data).map((key) => `$${Object.keys(data).indexOf(key) + 1}`).join(',')}) RETURNING *`, Object.values(data));
            return rows[0];
        } catch (error) {
            console.error(error);
        }
    }

    async createMany(table, datas){
        const columns = Object.keys(datas[0]).map((key) => `"${key}"`).join(',');
        const values = datas.map((data, index) => `(${Object.keys(data).map((key) => `$${index * Object.keys(data).length + Object.keys(data).indexOf(key) + 1}`).join(',')})`).join(',');
        const valuesArray = datas.map((data) => Object.values(data)).flat();
        try {
            const {rows} = await this.db.query(`INSERT INTO "${table}" (${columns}) VALUES ${values} RETURNING *`, valuesArray);
            return rows;
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
            const {rows} = await this.db.query(`CREATE TABLE IF NOT EXISTS "${table}" (${data.map((data) => `"${data.field}" ${data.value}`).join(',')})`);
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
            const {rows} = await this.db.query(`DROP TABLE IF EXISTS "${table}"`);
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
            const {rows} = await this.db.query(
                `SELECT "table_name" as "table" 
                FROM information_schema.tables 
                WHERE table_schema='public' AND table_type='BASE TABLE'
                `);
            return rows;
        } catch (error) {
            console.error(error);
        }
    }

    async getTypeOfColumns(table){
        try {
            const {rows} = await this.db.query(
                `SELECT column_name AS "column", 
            data_type AS "type" FROM information_schema.columns WHERE table_name = '${table}'
            `);
            return rows;
        } catch (error) {
            console.error(error);
        }
    }

    async getConstraintOfColumn(table, column){
        try {
            const {rows} = await this.db.query(
                `SELECT tc.constraint_type, 
            kcu.column_name FROM information_schema.table_constraints AS tc JOIN information_schema.key_column_usage AS kcu 
            ON tc.constraint_name = kcu.constraint_name JOIN information_schema.constraint_column_usage AS ccu 
            ON ccu.constraint_name = tc.constraint_name WHERE tc.table_name='${table}' AND kcu.column_name='${column}'
            `);
            return rows;
        } catch (error) {
            console.error(error);
        }
    }
    

}

module.exports = new dataMapper();