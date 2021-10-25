const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'root1234',
        database: 'company_db'
    },
    console.log(`Connected to the company_db database.`)
);

const viewAllEmployees = () => {
    const sql = `
        SELECT employee.id, 
            employee.first_name, 
            employee.last_name, 
            role.title,
            department.name AS department,
            role.salary,
            CONCAT (manager.first_name, " ", manager.last_name) AS manager
        FROM employee 
        JOIN role 
        ON employee.role_id = role.id
        JOIN department 
        ON role.department_id = department.id
        LEFT JOIN employee AS manager
        ON employee.manager_id = manager.id
        `;

    db.promise().query(sql)
        .then(([rows, fields]) => {
            console.table(rows);
        })
        .catch(console.log)
        .then(() => askMenuOption());
}

const addEmployee = () => {

}

const updateEmployeeRole = () => {

}

const viewAllRoles = () => {
    const sql = `
        SELECT role.id,
            role.title,
            department.name AS department,
            role.salary
        FROM role
        JOIN department
        ON role.department_id = department.id
        `;

    db.promise().query(sql)
        .then(([rows, fields]) => {
            console.table(rows);
        })
        .catch(console.log)
        .then(() => askMenuOption());

}

const addRole = () => {
    const departments = []

    const sql = `
    SELECT name
    FROM department
    `;

    db.promise().query(sql)
        .then(([rows, fields]) => {
            for (i in rows) {
                departments.push(rows[i].name)
            }
        })
        .catch(console.log)

        const roleQuestions = [
            {
                type: "input",
                message: "What is the name of the role?",
                name: "title"
            },
            {
                type: "number",
                message: "What is the salary of the role?",
                name: "salary"
            },
            {
                type: "list",
                message: "Which department does the role belong to?",
                name: "department",
                choices: departments
            }
        ]

    inquirer
        .prompt(roleQuestions)
        .then((data) => {
            const department_id = departments.indexOf(data.department);
            const sql = `
            INSERT INTO role (title, salary, department_id)
            VALUES ('${data.title}', '${data.salary}', '${department_id}')
            `;

            db.promise().query(sql)
                .then(([rows, fields]) => {
                    console.log(`Added ${data.title} to the database.`);
                })
                .catch(console.log)
                .then(() => askMenuOption());
        });
}

// department
// view all departments
const viewAllDepartments = () => {
    const sql = `
        SELECT id, name
        FROM department
        `;

    db.promise().query(sql)
        .then(([rows, fields]) => {
            console.table(rows);
        })
        .catch(console.log)
        .then(() => askMenuOption());
}

// add department
const addDepartment = () => {
    const departmentQuestion = [
        {
            type: "input",
            message: "What is the name of the department?",
            name: "name"
        }
    ]

    inquirer
        .prompt(departmentQuestion)
        .then((data) => {
            const sql = `
            INSERT INTO department (name)
            VALUES (?)
            `;

            db.promise().query(sql, data.name)
                .then(([rows, fields]) => {
                    console.log(`Added ${data.name} to the database.`);
                })
                .catch(console.log)
                .then(() => askMenuOption());

        });
}

// menu option
const askMenuOption = () => {
    const menuOption = [
        {
            type: "list",
            message: "What would you like to do?",
            name: "option",
            choices: [
                "View All Employees",
                "Add Employee",
                "Update Employee Role",
                "View All Roles",
                "Add Role",
                "View All Departments",
                "Add Department",
                "Quit"
            ]
        }
    ]

    inquirer
        .prompt(menuOption)
        .then((data) => {
            switch (data.option) {
                case "View All Employees":
                    viewAllEmployees();
                    break;
                case "Add Employee":
                    break;
                case "Update Employee Role":
                    break;
                case "View All Roles":
                    viewAllRoles();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "View All Departments":
                    viewAllDepartments();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                case "Quit":
                    // exit program
                    db.end();
                    break;
                default:
                    return;
            }
        });
}

const init = () => {
    askMenuOption();
}

init();
