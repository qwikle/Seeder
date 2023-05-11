const prompt = require('prompts');
const seeder = require('../database/seeder');
const { fakersQuestions, fakerTypesQuestions,dbConnectionQuestions } = require('./questions');
const colors = require('ansi-colors');
class Prompter {


   async DbConnection(){
    const response = await prompt(dbConnectionQuestions, {
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
                message:'What type of data do you want to add to "' + colors.blueBright(field) + '" column?',
                choices: fakersQuestions,

            },
        ];
        const response = await prompt(questions, {
        onCancel: () => {
            process.exit();
        }
    });
        const secondQuestion = [
            {
                type: 'select',
                name: 'fakerType',
                message: 'Choose a type of data',
                choices: fakerTypesQuestions[response.type],
            }
        ]
        const result = await prompt(secondQuestion, {
        onCancel: () => {
            process.exit();
        }
    });
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
                max: 5000000,
                validate: value => value > 0 ? true : 'Please enter a valid number',
            }
        ];
        const response = await prompt(questions, {
        onCancel: () => {
            process.exit();
        }
    });
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
                    initial: false,
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