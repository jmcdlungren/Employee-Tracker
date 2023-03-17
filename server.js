// Import and require mysql2
const mysql = require('mysql2');

const inquirer = require('inquirer');

const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password here
        password: 'root',
        database: 'employee_db'
    },
    console.log(`Connected to the movies_db database.`)
);

async function viewDepartments() {
    const results = await db.promise().query('SELECT * FROM department;')
    console.table(results[0]);
}

async function addDepartment() {
    const data = await inquirer
        .prompt([
            {
                type: 'input',
                name: 'department',
                message: 'What is the name of the department you would like to add?',
            }
        ])
    const results = await db.promise().query(`INSERT INTO department(name) VALUES ("${data.department}");`)
    if(results) {
        console.log("SUCCESS!")
        employeeMenu()
    }
}

async function employeeMenu() {
    const results = await inquirer
        .prompt([
            {
                type: 'list',
                name: 'employeeMenu',
                message: 'Welcome to Employee Tracker. Please select what you would like to do.',
                choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add Department', 'Add Role', 'Add Employee', 'Quit'],
            }
        ])
        if(results.employeeMenu === 'View All Departments') {
            viewDepartments()
        }
        if(results.employeeMenu === 'Add Department') {
            addDepartment()
        }
}

employeeMenu();