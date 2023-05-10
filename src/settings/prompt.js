const prompt = require('prompts');
const seeder = require('../database/seeder');
const { faker } = require('@faker-js/faker');
const { fakers, fakerTypes } = require('./faker');
class Prompter {


   async DbConnection(){
        const questions = [
    {
        type: 'number',
        name: 'port',
        message: 'What is the port of your PostgreSQL database?',
        validate: value => value < 65536 && value > 0 ? true : 'Please enter a valid port number',
        initial: 5432,
        
    },
    {
        type: 'text',
        name: 'host',
        message: 'What is the host of your PostgreSQL database?',
        validate: value => value.length > 0 ? true : 'Please enter a valid host',
        initial: 'localhost',
    },
    {
        type: 'text',
        name: 'user',
        message: 'What is the user of your PostgreSQL database?',
        validate: value => value.length > 0 ? true : 'Please enter a valid user',
    },
    {
        type: 'invisible',
        name: 'password',
        message: 'What is the password of your PostgreSQL database?',
        validate: value => value.length > 0 ? true : 'Please enter a valid password',
    },
    {
        type: 'text',
        name: 'database',
        message: 'What is the name of your PostgreSQL database?',
        validate: value => value.length > 0 ? true : 'Please enter a valid database name',
    },

];
    const response = await prompt(questions, {
        onCancel: () => {
            process.exit();
        }
    });
    return await seeder.init(response);
    }

    async DbField(field){
        const questions = [

            {
                type:'select',
                name:'type',
                message:`What type of data do you want to add to "${field}" column?`,
                choices: fakers,

            },
        ];
        const response = await prompt(questions);
        const secondQuestion = [
            {
                type: 'select',
                name: 'fakerType',
                message: 'Choose a type of data',
                choices: fakerTypes[response.type],
            }
        ]
        const result = await prompt(secondQuestion);
        return {type: response.type, fakerType: result.fakerType}
    }
    /**
     * 
     * @param {array<object>} tables 
     */
    async DbTable(tables){
        const questions = [
            {
                type: 'select',
                name: 'table',
                message: 'On which table do you want to add data?',
                choices: tables.map((table) => ({ title: table.table, value: table.table })),
            },
            {
                type: 'number',
                name: 'number',
                message: 'How many data do you want to add?',
                validate: value => value > 0 ? true : 'Please enter a valid number',
            }
        ];
        const response = await prompt(questions);
        return response;
    }

    async start(){
        const response = await this.DbConnection();
        const tables = await this.DbTable(response);
        const fields = await seeder.parsedData(tables.table)
        const datas = [];
        for (const field of fields) {
            const data = await this.DbField(field.column)
            datas.push({field: field.column, value: data})
        }
       const isFinished = await seeder.create(tables.table, datas, tables.number);
         if(isFinished){
                const response = await prompt({
                    type: 'confirm',
                    name: 'continue',
                    message: 'Do you want to continue?',
                    initial: true,
                });
                if(response.continue){
                    await this.start();
                }else{
                    process.exit();
                }
            }
    }
}

module.exports = new Prompter();