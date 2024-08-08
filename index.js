const inquirer = require('inquirer');
const figlet = require('figlet');
const {connection} = require('./config/connection');

connection.connect((err) => {
  if (err) throw err;
  console.error(error);

  console.log(``);
  console.log(figlet.textSync("Employee Tracker"));

  console.log(``);
  initalQuery();
});

initialQuery = () => {
  inquirer
  .prompt({
    name: "action",
    type: "rawlist",
    message: "What would you like to do?",
    choices: [
      "View department, roles or employees",
      "Add department, roles or employees",
      "Update employee role",
      "Remove employee",
      "View department budgets",
      "Exit",
    ],
  })
  .then((answer) => {
    switch (answer.action) {
      case "View department, roles or employees":
        viewTable();
        break;

      case "Add department, roles or employees":
        addValue();
        break;

      case "Update employee role":
        updateRole();
        break;

      case"Exit":
        connection.end();
        break;
    }
  });
}

viewTable = () => {
  inquirer
    .prompt({
      name: "view_table",
      type: "list",
      message: "Which table would you like to view?",
      choices: ["Departments", "Roles", "Employees"],
    })
    .then((val) => {
      if (val.view_table === "Departments") {
        connection.query(`SELECT dept_id AS Department_ID, departments.name AS Department_Name FROM departments`, (err,res) => {
          if (err) throw err;
          console.error(err);
          console.log(``);
          initialQuery();
        });
      } else if (val.view_table === "Roles") {
        const query = `SELECT roles.role_id AS Role_ID, roles.title AS Title, CONCAT('$', FORMAT (salary, 0)) AS Salary, departments.name AS Department
        FROM roles
        INNER JOIN departments ON roles.dept_id = departments.dept_id
        ORDER BY roles.role_id ASC`
        connection.query(query, (err, res) => {
          if (err) throw err;
          console.error(err);
          console.log(``);
          initialQuery();
        });
      } else if (val.view_table === "Employees") {
        const query = `SELECT emp_id AS Employee-ID, first_name AS First_Name, last_name AS Last_Name, title AS Title,CONCAT('$', FORMATF (salary, 0)) AS Salary, departments.name AS Department
        FROM employees
        INNER JOIN roles ON employees.role_Id = roles.role_id
        INNER JOIN departments ON roles.dept_id = departments.dept_id
        ORDER BY last_name ASC`
        connection.query(query, (err, res) => {
          if (err) throw err;
          console.error(err);
          initialQuery();
        });
      }
    });
}

addValue = () => {
  let listOfDepartments = [];
  let listOfRoles = [];
  let listOfManagers = [];
  
  inquirer
    .prompt({
      name: "add",
      type: "list",
      message: "Which would you like to add?",
      choices: ["Department", "Role", "Employee"],
    })
    .then((val) => {
      if (val.add === "Department") {
        inquirer
          .prompt({
            type: "input",
            name: "dept_add",
            message: "What is the name of the deparment you would like to add?",
            validate: newDeptInput => {
              if (newDeptInput) {
                return true
              } else {
                console.log("Please enter a name for the new department");
                return false
              }
            }
          })
          .then((answer) => {
            console.log(' ');
            connection.query("INSERT INTO Departments SET ?", {name: answer.dept_add}, (err, res) => {
              if (err) throw err;
              console.error(err);
              initialQuery();
            }
          );
        });

       } else if (val.add === "Role") {
          connection.query(`SELECT * FROM departments`, (err, res) => {
            if (err) throw err;
            console.error(err);
            listOfDepartments = res.map(dept => (
              {
                name: dept.name,
                value: dept.dept_id
              }
            ))
            inquirer
              .prompt([
                {
                  type: "input",
                  name: "role_add",
                  message: "What is the name of the role you would like to add?",
                  validate: newRoleInput => {
                    if (newRoleInput) {
                      return true
                    } else {
                      console.log("Please enter a name for the new role");
                      return false
                    }
                  }
                },
                {
                  type: "number",
                  name: "salary",
                  message: "What is the salary for the role you would like to add?",
                  default: 10000
                },
                {
                  type: "list",
                  name: "deptId",
                  message: "What is the department for the role you would like to add?",
                  choices: listOfDepartments
                }
              ])
              .then((answer) => {
                console.log(' ');
                connection.query("INSERT INTO Roles SET ?",
                  {
                    title: answer.role_add,
                    salary: answer.salary,
                    dept_id: answer.deptId,
                  },
                  (err, res) => {
                    if (err) throw err;
                    console.error(err);
                    initialQuery();
                  }
                );
              });
          })
       } else if (val.add === "Employee") {
        connection.query(`SELECT * FROM roles`, (err, res) => {
          if (err) throw err;
          console.error(err);
          listOfRoles = res.map(role => (
            {
              name: role.title,
              value: role.role_id
            }
          ));
          inquirer
            .prompt([
              {
                type: "input",
                name: "empAddFirstName",
                message: "What is the first name of the employee you would like to add?",
                validate: firstNameInput => {
                  if(firstNameInput) {
                    return true
                  } else {
                    console.log("Please enter a first name");
                    return false;
                  }
                }
              },
              {
                type: "input",
                name: "empAddLastName",
                message: "What is the last name of the employee you would like to add?",
              },
              {
                type: "list",
                name: "roleId",
                message: "What is the role of the employee you would like to add?",
                choices: listOfRoles
              },
              {
                type: "number",
                name: "empAddMgrId",
                message: "What is the namager ID of the employee you would like to add?",
                default: 1, 
              },
            ])
            .then((answer) => {
              console.log(' ');
              connection.query("INSERT INTO Employees SET ?",
                {
                  last_name: answer.empAddLastName,
                  first_name: answer.empAddFirstName,
                  role_id: answer.roleId,
                  manager_id: answer.empAddMgrId,
                },
                (err, res) => {
                  if (err) throw err;
                  console.error(err);
                  initialQuery();
                }
              );
            });
        })
       }
    });
}

updateRole = () => {
  let listOfEmployees = [];
  let listOfRoles = [];
  let employeeLastName = null;

  inquirer
    .prompt([
      {
        name: "empLastName",
        type: "input",
        message: "Wha is the last name of the employee you would like to update?",
      }
    ])
    .then((answer) => {
      employeeLastName = answer.empLastName;
      const query = `SELECT emp_id AS Employee_ID, first_name AS First_Name, last_name AS Last_Name, title AS Title, salary AS Salary, departments.name AS Department FROM employees
      INNER JOIN roles ON employees.role_Id = roles.role_id
      INNER JOIN departments ON roles.dept_id = departments.dept_id
      WHERE ?`;

      connection.query(query, { last_name: answer.empLastName }, (err, res) => {
        if (err) throw err;
        console.error(err);
        console.log(` `)
        
        listOfEmployees = res.map(employee => (
          {
            name: employee.First_Name,
            value: employee.Employee_ID
          }
        ));

        connection.query("SELECT * FROM roles", (err, res) => {
          if(err) throw err;
          console.error(err);

          listOfRoles = res.map(role => (
            {
             name: role.title,
             value: role.role_id
            }
          ))
            inquirer.prompt([
              {
                type: "list",
                name: "nameConfirm",
                message: "Please select the employee to confirm",
                choices: listOfEmployees
              },
              {
                type: "list",
                name: "roleChoice",
                message: "Please select the new role for the employee",
                choices: listOfRoles
              }
            ])
          .then((answers) => {
            const query = `SELECT emp_id AS Employee_ID, first_name AS First_Name, last_name AS Last_Name, title AS Title, salary AS Salary, departments.name AS Department FROM employees
            INNER JOIN roles ON employees.role_Id = roles.role_id
            INNER JOIN departments ON roles.dept_id = departments.dept_id
            WHERE ?`;
            connection.query(query, { last_name: employeeLastName }, (err, res) => {
              if (err) throw err;
              console.error(err);
              console.log(` `);
              initialQuery();
            })
          })
        })
      })
    })
}

removeEmp = () => {
  inquirer
    .prompt([
      {
        name: "empToRemove",
        type: "input",
        message: "What is the last name of the employee you would like to remove?",
      },
    ])
    .then((answer) => {
      const query = `SELECT emp_id AS Employee_ID, first_name AS First_Name, last_name AS Last_Name, title AS Title, salary AS Salary, departments.name AS Department FROM employees
      INNER JOIN roles ON employees.role_Id = roles.role_id
      INNER JOIN departments ON roles.dept_id = departments.dept_id
      WHERE ?`;
      connection.query(query, { last_name: answer.empToRemove }, (err, res) => {
        if(err) throw err;
        console.error(err);
        if (res.length === 0) {
          console.log("No employee found by that name");
          initalQuery();
        } else {
          console.log("Employee found");
          console.log(` `);
          console.table(res);
          inquirer
            .prompt ({
              name: "idConfirm",
              type: "number",
              message: "Please enter the employee's ID to confirm choice:",
            })
            .then((answer) => {
              const query = "SELECT * FROM Employees WHERE ?";
              connection.query(query, { emp_id: answer.idConfirm }, (err, res) => {
                if (err) throw err;
                console.error(err);
                let idToDelete = answer.idConfirm;
                const deleteQuery = `DELETE FROM employees WHERE emp_id = ${idToDelete}`;
                connection.query(deleteQuery, (err, res) => {
                  if (err) throw err;
                  console.error(err);
                  initialQuery();
                })
              }
            );
            });
        }

        viewBudget = () => {
          const query = `SELECT departments.dept_id AS Dept_ID, departments.name AS Department_Name, CONCAT('$', FORMAT(SUM(salary),0)) AS Budget
          FROM roles
          INNER JOIN employees USING (role_id)
          INNER JOIN departments ON roles.dept_id = departments.dept_id
          GROUP BY roles.dept_id;`;
          connection.query(query, (err, res) => {
            if (err) throw err;
            console.error(err);
            initialQUery();
          })
        }
      })
    })
}