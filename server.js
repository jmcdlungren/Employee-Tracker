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
    employeeMenu();
}

async function viewRoles() {
    const results = await db.promise().query('SELECT * FROM role;')
    console.table(results[0]);
    employeeMenu();
}

async function viewEmployees() {
    const results = await db.promise().query('SELECT * FROM employee;')
    console.table(results[0]);
    employeeMenu();
}

async function addDepartment() {
    const data = await inquirer
        .prompt([
            {
                type: 'input',
                name: 'departmentName',
                message: 'What is the name of the department you would like to add?',
            }
        ])
    const results = await db.promise().query(`INSERT INTO department(name) VALUES ("${data.departmentName}");`)
    if(results) {
        console.log("SUCCESS!")
        employeeMenu()
    }
}

async function addRole() {
    const dptName = await db.promise().query(`SELECT name, id AS value FROM department;`)
    // const dptName = await db.promise().query(`SELECT * FROM role JOIN department ON role.department_id = department.id`)
    const data = await inquirer
        .prompt([
            {
                type: 'input',
                name: 'role',
                message: 'What is the name of the role you would like to add?',
            },
            {
                type: 'input',
                name: 'salary',
                message: "What is the salary of this role? Enter in number and decimal only."
            },
            {
                type: 'list',
                name: 'department',
                message: "Which department does the role belong to?",
                choices: dptName[0]
            }
        ])
    const results = await db.promise().query(`INSERT INTO role(title, salary, department_id) VALUES ("${data.role}", ${data.salary}, ${data.department});`)
    if(results) {
        console.log("SUCCESS!")
        employeeMenu()
    }
}

async function addEmployee() {
    const roleName = await db.promise().query(`SELECT title AS name, id AS value FROM role;`);
    const mgrName = await db.promise().query(`SELECT first_name, last_name, id AS value FROM employee;`);
    const fullName = mgrName[0].map((item) => {
        return {
            name: `${item.first_name} ${item.last_name}`,
            value: item.value
        }
    });
    
    const data = await inquirer
        .prompt([
            {
                type: 'input',
                name: 'firstName',
                message: 'What is the first name of the employee you would like to add?',
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'What is the last name of the employee you would like to add?',
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'What is the last name of the employee you would like to add?',
            },
            {
                type: 'list',
                name: 'role',
                message: "Which role does the employee have?",
                choices: roleName[0],
            },
            {
                type: 'list',
                name: 'manager',
                message: "Who is the employee's manager?",
                choices: fullName
            }
        ])
    const results = await db.promise().query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("${data.firstName}", "${data.lastName}", ${data.role}, ${data.manager});`)
    if(results) {
        console.log("SUCCESS!")
        employeeMenu()
    }
}

// async function updateRole() {
//     const data = await inquirer
//         .prompt([
//             {
//                 type: 'list',
//                 name: 'updateRole',
//                 message: "What is the employee's new role?",
//                 choices: []
//             }
//         ])
// }

async function employeeMenu() {
    const results = await inquirer
        .prompt([
            {
                type: 'list',
                name: 'employeeMenu',
                message: 'Welcome to Employee Tracker. Please select what you would like to do.',
                choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role', 'Quit'],
            }
        ])
        if(results.employeeMenu === 'View All Departments') {
            viewDepartments()
        }
        if(results.employeeMenu === 'View All Roles') {
            viewRoles()
        }
        if(results.employeeMenu === 'View All Employees') {
            viewEmployees()
        }
        if(results.employeeMenu === 'Add Department') {
            addDepartment()
        }
        if(results.employeeMenu === 'Add Role') {
            addRole()
        }
        if(results.employeeMenu === 'Add Employee') {
            addEmployee()
        }
        // if(results.employeeMenu === 'Update Employee Role') {
        //     updateRole()
        // }

}

employeeMenu();