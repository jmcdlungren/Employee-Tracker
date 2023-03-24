// Import and require mysql2, dotenv, and inquirer
const mysql = require('mysql2');
require("dotenv").config();
const inquirer = require('inquirer');

const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: process.env.DB_USER,
        // MySQL password here
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    console.log(`Connected to the employee_db database.`)
);

async function viewDepartments() {
    const results = await db.promise().query('SELECT * FROM department;')
    console.table(results[0]);
    console.log("\n");
    employeeMenu();
};

async function viewRoles() {
    const results = await db.promise().query('SELECT * FROM role;')
    console.table(results[0]);
    console.log("\n");
    employeeMenu();
};

async function viewEmployees() {
    const results = await db.promise().query('SELECT * FROM employee;')
    console.table(results[0]);
    console.log("\n");
    employeeMenu();
};

async function viewEmployeesByMgr() {
    const mgrName = await db.promise().query(`SELECT first_name, last_name, id AS value FROM employee;`);
    const fullName = await mgrName[0].map((item) => {
        return {
            name: `${item.first_name} ${item.last_name}`,
            value: item.value
        }
    });

    const data = await inquirer
        .prompt([
            {
                type: 'list',
                name: 'manager',
                message: "Which manager's employees would you like to see?",
                choices: fullName
            }
        ])

    const results = await db.promise().query(`SELECT * FROM employee WHERE manager_id = ${data.manager};`)
    console.log("\n");
    console.table(results[0]);
    console.log("\n");
    employeeMenu();
};

async function sortEmployeesByMgr() {
    const results = await db.promise().query(`SELECT * FROM employee ORDER BY manager_id;`)
    console.log("\n");
    console.table(results[0]);
    console.log("\n");
    employeeMenu();
};

async function viewEmployeesByDpt() {
    const dptName = await db.promise().query(`SELECT name, id AS value FROM department;`)
    const data = await inquirer
        .prompt([
            {
                type: 'list',
                name: 'department',
                message: "Which department's employees would you like to see?",
                choices: dptName[0]
            }
        ])

    const results = await db.promise().query(`SELECT * FROM employee WHERE department_id = ${data.department};`)
    if (results) {
        console.log("\n");
        console.table(results[0]);
        console.log("\n");
        employeeMenu();
    };
};

async function sortEmployeesByDpt() {
    const results = await db.promise().query(`SELECT * FROM employee ORDER BY department_id;`)
    if (results) {
        console.log("\n");
        console.table(results[0]);
        console.log("\n");
        employeeMenu();
    };
};

async function viewDepartmentBudget() {
    const dptName = await db.promise().query(`SELECT name, id AS value FROM department;`)
    const data = await inquirer
        .prompt([
            {
                type: 'list',
                name: 'department',
                message: "Which department's budget would you like to see?",
                choices: dptName[0]
            }
        ])
    const results = await db.promise().query(`SELECT SUM(salary) FROM role WHERE department_id = ${data.department};`)
    console.log("\n");
    console.table(results[0]);
    console.log("\n");
    employeeMenu();
};

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
    if (results) {
        console.log("SUCCESS!")
        employeeMenu()
    }
};

async function addRole() {
    const dptName = await db.promise().query(`SELECT name, id AS value FROM department;`)
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
    if (results) {
        console.log("SUCCESS!")
        employeeMenu()
    }
};

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
    if (results) {
        console.log("SUCCESS!")
        employeeMenu()
    }
};

async function updateRole() {
    const roleName = await db.promise().query(`SELECT title AS name, id AS value FROM role;`);
    const empName = await db.promise().query(`SELECT first_name, last_name, id AS value FROM employee;`);
    const fullName = empName[0].map((item) => {
        return {
            name: `${item.first_name} ${item.last_name}`,
            value: item.value
        }
    });
    const data = await inquirer
        .prompt([
            {
                type: 'list',
                name: 'employee',
                message: "Which employee needs to be updated?",
                choices: fullName
            },
            {
                type: 'list',
                name: 'role',
                message: "What is the employee's new role?",
                choices: roleName[0]
            },
            {
                type: 'list',
                name: 'manager',
                message: "Who is the employee's manager?",
                choices: fullName
            }
        ])
    const results = await db.promise().query(`UPDATE employee SET role_id = ${data.role}, manager_id = ${data.manager} WHERE id = ${data.employee}`)
    if (results) {
        console.table("SUCCESS!")
        employeeMenu()
    }
};

async function updateMgr() {
    const empName = await db.promise().query(`SELECT first_name, last_name, id AS value FROM employee;`);
    const fullName = empName[0].map((item) => {
        return {
            name: `${item.first_name} ${item.last_name}`,
            value: item.value
        }
    });
    const data = await inquirer
        .prompt([
            {
                type: 'list',
                name: 'employee',
                message: "Which employee needs to be updated?",
                choices: fullName
            },
            {
                type: 'list',
                name: 'manager',
                message: "Who is the employee's new manager?",
                choices: fullName
            }
        ])
    const results = await db.promise().query(`UPDATE employee SET manager_id = ${data.manager} WHERE id = ${data.employee}`)
    if (results) {
        console.table("SUCCESS!")
        employeeMenu()
    }
};

async function removeDpt() {
    const dptName = await db.promise().query(`SELECT name, id AS value FROM department;`)
    const data = await inquirer
        .prompt([
            {
                type: 'list',
                name: 'department',
                message: "Which department needs to be removed?",
                choices: dptName[0]
            }
        ])
    const results = await db.promise().query(`DELETE FROM department WHERE id = ${data.department}`)
    if (results) {
        console.table("SUCCESS!")
        employeeMenu()
    }
};

async function removeRole() {
    const roleName = await db.promise().query(`SELECT title AS name, id AS value FROM role;`);
    const data = await inquirer
        .prompt([
            {
                type: 'list',
                name: 'role',
                message: "Which role needs to be removed?",
                choices: roleName[0]
            }
        ])
    const results = await db.promise().query(`DELETE FROM role WHERE id = ${data.role}`)
    if (results) {
        console.table("SUCCESS!")
        employeeMenu()
    }
};

async function removeEmployee() {
    const empName = await db.promise().query(`SELECT first_name, last_name, id AS value FROM employee;`);
    const fullName = empName[0].map((item) => {
        return {
            name: `${item.first_name} ${item.last_name}`,
            value: item.value
        }
    });
    const data = await inquirer
        .prompt([
            {
                type: 'list',
                name: 'employee',
                message: "Which employee needs to be removed?",
                choices: fullName
            }
        ])
    const results = await db.promise().query(`DELETE FROM employee WHERE id = ${data.employee}`)
    if (results) {
        console.table("SUCCESS!")
        employeeMenu()
    }
};

async function employeeMenu() {
    const results = await inquirer
        .prompt([
            {
                type: 'list',
                name: 'employeeMenu',
                message: 'Welcome to Employee Tracker. Please select what you would like to do.',
                choices: ['View All Departments', 'View All Roles', 'View All Employees', 'View All Employees by Manager', 'Sort All Employees by Manager', 'View All Employees by Department', 'Sort All Employees by Department', 'View Department Budget', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role', 'Update Employee Manager', 'Remove Department', 'Remove Role', 'Remove Employee', 'Exit'],
            }
        ])
    if (results.employeeMenu === 'View All Departments') {
        viewDepartments()
    };
    if (results.employeeMenu === 'View All Roles') {
        viewRoles()
    };
    if (results.employeeMenu === 'View All Employees') {
        viewEmployees()
    };
    if (results.employeeMenu === 'View All Employees by Manager') {
        viewEmployeesByMgr()
    };
    if (results.employeeMenu === 'Sort All Employees by Manager') {
        sortEmployeesByMgr()
    };
    if (results.employeeMenu === 'View All Employees by Department') {
        viewEmployeesByDpt()
    };
    if (results.employeeMenu === 'Sort All Employees by Department') {
        sortEmployeesByDpt()
    };
    if (results.employeeMenu === 'View Department Budget') {
        viewDepartmentBudget()
    };
    if (results.employeeMenu === 'Add Department') {
        addDepartment()
    };
    if (results.employeeMenu === 'Add Role') {
        addRole()
    };
    if (results.employeeMenu === 'Add Employee') {
        addEmployee()
    };
    if (results.employeeMenu === 'Update Employee Role') {
        updateRole()
    };
    if (results.employeeMenu === 'Update Employee Manager') {
        updateMgr()
    };
    if (results.employeeMenu === 'View All Employees by Manager') {
        viewEmployeesByMgr()
    };
    if (results.employeeMenu === 'Remove Department') {
        removeDpt()
    };
    if (results.employeeMenu === 'Remove Role') {
        removeRole()
    };
    if (results.employeeMenu === 'Remove Employee') {
        removeEmployee()
    };
};

async function startEmployeeMenu() {
    console.log(`
    ███████╗███╗░░░███╗██████╗░██╗░░░░░░█████╗░██╗░░░██╗███████╗███████╗
    ██╔════╝████╗░████║██╔══██╗██║░░░░░██╔══██╗╚██╗░██╔╝██╔════╝██╔════╝
    █████╗░░██╔████╔██║██████╔╝██║░░░░░██║░░██║░╚████╔╝░█████╗░░█████╗░░
    ██╔══╝░░██║╚██╔╝██║██╔═══╝░██║░░░░░██║░░██║░░╚██╔╝░░██╔══╝░░██╔══╝░░
    ███████╗██║░╚═╝░██║██║░░░░░███████╗╚█████╔╝░░░██║░░░███████╗███████╗
    ╚══════╝╚═╝░░░░░╚═╝╚═╝░░░░░╚══════╝░╚════╝░░░░╚═╝░░░╚══════╝╚══════╝
    
    ████████╗██████╗░░█████╗░░█████╗░██╗░░██╗███████╗██████╗░
    ╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗██║░██╔╝██╔════╝██╔══██╗
    ░░░██║░░░██████╔╝███████║██║░░╚═╝█████═╝░█████╗░░██████╔╝
    ░░░██║░░░██╔══██╗██╔══██║██║░░██╗██╔═██╗░██╔══╝░░██╔══██╗
    ░░░██║░░░██║░░██║██║░░██║╚█████╔╝██║░╚██╗███████╗██║░░██║
    ░░░╚═╝░░░╚═╝░░╚═╝╚═╝░░╚═╝░╚════╝░╚═╝░░╚═╝╚══════╝╚═╝░░╚═╝`)
    console.log("\n");
    employeeMenu();
};

startEmployeeMenu();