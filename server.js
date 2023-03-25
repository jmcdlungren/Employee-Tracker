// Import and require mysql2, dotenv, and inquirer
const mysql = require('mysql2');
require("dotenv").config();
const inquirer = require('inquirer');

// Creates connection to SQL, connecting to the .env file
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

// Function to View Departments - has SQL select all columns from the department table. The results are then shown in a table.
async function viewDepartments() {
    const results = await db.promise().query('SELECT * FROM department;')
    console.table(results[0]);
    console.log("\n");
    employeeMenu();
};

// Function to View Roles - has SQL select all columns from the role table. The results are then shown in a table.
async function viewRoles() {
    const results = await db.promise().query('SELECT * FROM role;')
    console.table(results[0]);
    console.log("\n");
    employeeMenu();
};

// Function to View Employees - has SQL select all columns from the employee table. The results are then shown in a table.
async function viewEmployees() {
    const results = await db.promise().query('SELECT * FROM employee;')
    console.table(results[0]);
    console.log("\n");
    employeeMenu();
};

// Function to View Employees by Manager. SQL first selects the columns first_name, last_name, & id from the employee table. The fullName variable then creates a function to return first_name & last_name as one full "name" and returns the id as "value" from the previous statement. The fullName variable is then used as the choices within the inquirer.prompt as fullName is returned as an array. The results are then shown in a table.
// **Note: This function is currently creating issues in the terminal as it runs double. I have not figured out the reasoning for this as of this time.
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

// Similar to the viewEmployees function, this one selects all from the employee table; however, it is now ordering by the manager_id column to sort the employees by manager. The results are then shown in a table.
async function sortEmployeesByMgr() {
    const results = await db.promise().query(`SELECT * FROM employee ORDER BY manager_id;`)
    console.log("\n");
    console.table(results[0]);
    console.log("\n");
    employeeMenu();
};

// Function to View Employees by Department. SQL selects the name column and id column (as value) from the department table. The name and value is required for the choices array. This can then be used as choices within the inquirer.prompt. The results are then shown in a table.
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

// Similar to the viewDepartments function, this one selects all from the department table; however, it is now ordering by the department_id column to sort the employees by department. The results are then shown in a table.
async function sortEmployeesByDpt() {
    const results = await db.promise().query(`SELECT * FROM employee ORDER BY department_id;`)
    if (results) {
        console.log("\n");
        console.table(results[0]);
        console.log("\n");
        employeeMenu();
    };
};

// Function to View Deparment Budget. SQL selects the name column and id column (as value) from the department table. The name and value is required for the choices array. This can then be used as choices within the inquirer.prompt. SQL then is asked to select the sum of the salary column within the department table where the department id matches what was selected from the inquirer.prompt. The results are then shown in a table.
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

// The inquirer.prompt asks for the name of the department. When the user enters this in, the answer is then inputted as a name within the name column within the department table.
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

// SQL selects the name column and id column (as value) from the department table. The name and value is required for the choices array. This can then be used as choices within the inquirer.prompt for the department question. The inquirer.prompt asks for the name of the role, the salary, and then has the user choose from a list of choices for the department. When the user enters all of the information in, the answer is then inputted in the appropriate columns within the role table.
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

// SQL first selects the name column and id column (as value) from the role table. The name and value is required for the choices array. This can then be used as choices within the inquirer.prompt for the role question. SQL then selects the columns first_name, last_name, & id from the employee table. The fullName variable then creates a function to return first_name & last_name as one full "name" and returns the id as "value" from the previous statement. The fullName variable is then used as the choices within the inquirer.prompt as fullName is returned as an array. The inquirer.prompt asks for the first name & last name of the employee, and then has the user choose from a list of choices for the manager, and then a list of choices for the employee's role. When the user enters all of the information in, the answer is then inputted in the appropriate columns within the employee table.
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

// SQL first selects the name column and id column (as value) from the role table. The name and value is required for the choices array. This can then be used as choices within the inquirer.prompt for the role question. SQL then selects the columns first_name, last_name, & id from the employee table. The fullName variable then creates a function to return first_name & last_name as one full "name" and returns the id as "value" from the previous statement. The fullName variable is then used as the choices within the inquirer.prompt as fullName is returned as an array. The inquirer.prompt asks for the name of the employee, and then has the user choose from a list of choices for the new manager, and then a list of choices for the employee's role. When the user enters all of the information in, the answer is then inputted in the appropriate columns within the employee table.
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

// SQL first selects the columns first_name, last_name, & id from the employee table. The fullName variable then creates a function to return first_name & last_name as one full "name" and returns the id as "value" from the previous statement. The fullName variable is then used as the choices within the inquirer.prompt as fullName is returned as an array. The inquirer.prompt asks for the name of the employee, and then has the user choose from a list of choices for the employee's new manager. When the user enters all of the information in, the answer is then inputted in the appropriate columns within the employee table.
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

// SQL selects the name column and id column (as value) from the department table. The name and value is required for the choices array. This can then be used as choices within the inquirer.prompt for the department question. The inquirer.prompt asks for the name of the department that needs to be removed. The information is then inputted in a SQL request to have the department deleted from the department table.
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

// SQL selects the name column and id column (as value) from the role table. The name and value is required for the choices array. This can then be used as choices within the inquirer.prompt for the role question. The inquirer.prompt asks for the name of the role that needs to be removed. The information is then inputted in a SQL request to have the role deleted from the role table.
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

// SQL first selects the columns first_name, last_name, & id from the employee table. The fullName variable then creates a function to return first_name & last_name as one full "name" and returns the id as "value" from the previous statement. The fullName variable is then used as the choices within the inquirer.prompt as fullName is returned as an array. The inquirer.prompt asks for the name of the employee that needs to be removed. The information is then inputted in a SQL request to have the employee deleted from the employee table.
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

// This is the main menu that the user selects what they would like to do from. As each option is selected, the appropriate function is ran to complete the requested action. If the user selects "Exit", the program ends.
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

// This function starts the program when the user runs "node server" in the terminal. A designed "Employee Tracker" prompt is shown and the employeeMenu function is ran.
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

// This calls the function startEmployeeMenu above so that it can run once the user enters "node server" in the terminal.
startEmployeeMenu();