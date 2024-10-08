import fs from 'fs'
import * as systemPath from 'path';
import csvWriter from 'csv-writer';
import { title } from 'process';
const path = 'expenses.json'

export class ExpenseTracker {
    constructor() {

    }


    add(expense) {
        try {
            if (fs.existsSync(path)) {
                const data = fs.readFileSync(path);
                const expenses = JSON.parse(data);
                expense.setId(expenses.expenses.length + 1);
                expenses.expenses.push(expense);
                const json_string = JSON.stringify(expenses);
                fs.writeFileSync(path, json_string);
                console.log(`Expense added Succesfully (ID: ${expense.getId()})`);



            } else {
                const data = { expenses: [] };
                expense.setId(data.expenses.length + 1);
                data.expenses.push(expense);
                const json_string = JSON.stringify(data);
                fs.writeFileSync(path, json_string);
                console.log(`Expense added Succesfully (ID: ${expense.getId()})`);


            }
        } catch (error) {
            console.error(error)
        }

    }

    update() {

    }

    delete(id) {
        try {
            if (fs.existsSync(path)) {
                const data = fs.readFileSync(path);
                const expenses = JSON.parse(data);
                const expenses_list = expenses.expenses;
                const expenses_list_copy = [];
                for (const expense of expenses_list) {
                    if (Number(expense.id) === Number(id)) {
                        continue;
                    } else {
                        expenses_list_copy.push(expense);
                    }
                }
                expenses['expenses'] = expenses_list_copy;
                const json_string = JSON.stringify(expenses);
                fs.writeFileSync(path, json_string);
                console.log(`Expense with (ID:${id}) deleted successfully.`);

            }
        } catch (error) {
            console.error(error);
        }
    }

    list() {
        try {
            if (fs.existsSync(path)) {
                const data = fs.readFileSync(path);
                const expenses = JSON.parse(data);
                const expenses_list = expenses.expenses;
                console.log('ID     Date          Description     Amount     Category');
                for (const expense of expenses_list) {
                    console.log(`${expense.id}      ${expense.createdAt}     ${expense.description}         ${expense.amount}       ${expense.category || 'default'}`)
                }
            } else {
                console.log('No expenses found,Add an expense');


            }
        } catch (error) {
            console.error(error)
        }
    }

    summary() {
        try {
            if (fs.existsSync(path)) {
                let sum = 0;
                const data = fs.readFileSync(path);
                const expenses = JSON.parse(data);
                const expenses_list = expenses.expenses;
                for (const expense of expenses_list) {
                    const amount = expense.amount.split('$')[1];
                    sum += Number(amount);
                }
                console.log(`Total expenses: $${sum}`);
            } else {
                console.log('No expenses found,Add an expense');
            }
        } catch (error) {
            console.error(error);
        }
    }

    summaryByMonth(month) {
        try {
            if (fs.existsSync(path)) {
                let sum = 0;
                const data = fs.readFileSync(path);
                const expenses = JSON.parse(data);
                const expenses_list = expenses.expenses;
                for (const expense of expenses_list) {
                    if (expense.createdAt.split('/')[0] == month) {
                        const amount = expense.amount.split('$')[1];
                        sum += Number(amount);
                    }

                }
                console.log(`Total expenses: $${sum}`);
            } else {
                console.log('No expenses found,Add an expense');
            }
        } catch (error) {
            console.error(error);
        }
    }

    addCategory(id,category) {
        try {
            let condition = false;
            if(fs.existsSync(path)) {
                const data = fs.readFileSync(path);
                const expenses = JSON.parse(data);
                const expenses_list = expenses.expenses;
                const expenses_list_copy = [];
                for(const expense of expenses_list) {
                    if(Number(expense.id) === Number(id)) {
                        expense['category'] = category
                        expenses_list_copy.push(expense);
                        condition = true;
                    }else {
                        expenses_list_copy.push(expense);
                    }

                }
                expenses['expenses'] = expenses_list_copy;
                const json_string = JSON.stringify(expenses);
                fs.writeFileSync(path, json_string);
                if(condition) {
                    console.log(`Category added successfully to Expense with (ID:${id})`);
                }else {
                    console.log(`Expense with (ID:${id}) not found.`);
                }
            }else {
                console.log('No expenses found,Add an expense');

            }
        } catch (error) {
            console.error(error);
        }
    }

    filterByCategory(category) {
        try {
            if(fs.existsSync(path)) {
                const data = fs.readFileSync(path);
                const expenses = JSON.parse(data);
                const expenses_list = expenses.expenses;
                console.log('ID     Date          Description     Amount     Category');

                for(const expense of expenses_list) {
                    if(expense.category === category) {
                        console.log(`${expense.id}      ${expense.createdAt}     ${expense.description}         ${expense.amount}       ${expense.category || 'default'}`)

                    }
                }

            }else {
                console.log('No expenses found,Add an expense');

            }
        } catch (error) {
            console.error(error);
        }
    }

    exportAsCsv() {
        try {
            if(fs.existsSync(path)){
                const data = fs.readFileSync(path);
                const expenses = JSON.parse(data);
                const expenses_list = expenses.expenses;
                const writer = csvWriter.createObjectCsvWriter({
                    path: 'expenses.csv',
                    header:[
                        {id:'id',title:'ID'},
                        {id:'createdAt',title:'Date'},
                        {id:'description',title:'Description'},
                        {id:'amount',title:'Amount'},
                        {id:'category',title:'Category'}
                    ]
                });
                writer.writeRecords(expenses_list)
                .then(() => {
                    console.log('Csv file exported');
                })
              
            }
        } catch (error) {
            console.error(error);
        }
    }
}