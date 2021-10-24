const mysql = require('mysql2');
const inquirer = require('inquirer');

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

    db.query(sql, (err, result) => {
        if (err) throw err;
        console.table(result);
    });
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

    db.query(sql, (err, result) => {
        if (err) throw err;
        console.table(result);
    });
}

const addRole = () => {

}

const viewAllDepartments = () => {
    const sql = `
    SELECT id, name
    FROM department
    `;

    db.query(sql, (err, result) => {
        if (err) throw err;
        console.table(result);
    });

}

const addDepartment = () => {

}

const askMenuOption = () => {
    inquirer
        .prompt(menuOption)
        .then((data) => {
            console.log(data);
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
                    break;
                case "View All Departments":
                    viewAllDepartments();
                    break;
                case "Add Department":
                    break;
                case "Quit":
                    // exit program
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
