const dataMapper = require('./dataMapper');
const { faker } = require('@faker-js/faker')
const { camelCase } = require('lodash');
const colors = require('ansi-colors');
const bar = require('../settings/progress');
class Seeder {

    constructor() {
        this.dataMapper = dataMapper;
    }

    async init(data){
        await this.dataMapper.init(data);
        return await this.dataMapper.getAllTable();
    }


    async parsedData(table){
        const datas = await this.dataMapper.getTypeOfColumns(table);
        const result = datas.filter((data) => {
            return data.column !== 'id' && data.column !== 'created_at' && data.column !== 'updated_at' && data.column !== 'deleted_at' && data.column !== camelCase('deleted_at') && data.column !== camelCase('created_at') && data.column !== camelCase('updated_at');
        });
        return result;
    }

    async create(table, datas, number){
        bar.start(number, 0);
        for (let i = 0; i < number; i++) {
            const result = this.generateFaker(datas);
            await this.dataMapper.createOne(table, result);
            bar.increment();
        }
        bar.stop();
        console.log(colors.greenBright(`${number} data added to ${table} table`));
        return true;
    }

    generateFaker(datas){
        const result = {};
        for (const data of datas) {
            result[data.field] = faker[data.value.type][data.value.fakerType]();
        }
        return result;
    }
}


module.exports = new Seeder();