# PG-SEEDER

Version: 0.0.1

## Description

This is a simple script to seed a postgres database with fake data. It uses the [Faker](https://faker.readthedocs.io/en/master/) library to generate the fake data.

## Usage

### Install

```bash
npm install
```

### dependencies

- [pg](https://www.npmjs.com/package/pg)
- [faker](https://www.npmjs.com/package/faker)
- [colors](https://www.npmjs.com/package/ainsi-colors)
- [cli-progress](https://www.npmjs.com/package/cli-progress)
- [prompts](https://www.npmjs.com/package/prompts)


### How to use

1. run `npm run start` to start the script
2. enter the Information for the database
3. The script will show you the tables in the database
4. Select the tables you want to seed
5. Enter the number of rows you want to seed
6. Select the faker data you want to seed for each column
7. The script will show you the progress of the seeding

###  STILL IN DEVELOPMENT

- [ ] Add manual data input
- [ ] Add verification for unique columns
- [ ] Add verification for foreign keys
- [ ] Add verification for data types
- [ ] Catch all errors


## License

[MIT](https://choosealicense.com/licenses/mit/)