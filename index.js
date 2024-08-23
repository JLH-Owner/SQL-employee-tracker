const inquirer = require('inquirer');
const db = require('./db');

async function main() {
    const { action } = await inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
            'View all employees',
            'Add a Department',
            'Add a Role',
            'Add an employee',
            'Update employee manager',
            'View employees by manager',
            'View employees by department',
            'Delete an employee',
            'Delete a role',
            'Delete a department',
            'View total budget of a department',
            'Exit'
        ]
    });

    switch (action) {
        case 'View all employees':
            const employees = await db.getEmployees();
            console.table(employees);
            break;

            case 'Add a department':
            const { department_name } = await inquirer.prompt([
                { department_name: 'department_name', message: 'What is the name of the new department?:' },
                
            ]);
            await db.addDepartment(department_name);
            console.log('Department added successfully!');
            break;

            case 'Add a role':
            const { title, salary, department } = await inquirer.prompt([
                { title: 'title', message: 'What is the title of the new role?:' },
                { salary: 'salary', message: 'What is the salary of the new role?:' },
                { department: 'department', message: 'What department does the new role belong to?:' }
                
            ]);
            await db.addRole(title, salary, department);
            console.log('Role added successfully!');
            break;
        
        case 'Add an employee':
            const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
                { name: 'first_name', message: 'First Name:' },
                { name: 'last_name', message: 'Last Name:' },
                { name: 'role_id', message: 'Role ID:' },
                { name: 'manager_id', message: 'Manager ID (leave blank if none):', default: null }
            ]);
            await db.addEmployee(first_name, last_name, role_id, manager_id);
            console.log('Employee added successfully!');
            break;

        case 'Update employee manager':
            const { employeeId, newManagerId } = await inquirer.prompt([
                { name: 'employeeId', message: 'Employee ID to update:' },
                { name: 'newManagerId', message: 'New Manager ID:' }
            ]);
            await db.updateEmployeeManager(employeeId, newManagerId);
            console.log('Employee manager updated successfully!');
            break;

        case 'View employees by manager':
            const { managerId } = await inquirer.prompt({
                name: 'managerId',
                message: 'Manager ID:'
            });
            const managedEmployees = await db.viewEmployeesByManager(managerId);
            console.table(managedEmployees);
            break;

        case 'View employees by department':
            const { departmentId } = await inquirer.prompt({
                name: 'departmentId',
                message: 'Department ID:'
            });
            const departmentEmployees = await db.viewEmployeesByDepartment(departmentId);
            console.table(departmentEmployees);
            break;

        case 'Delete an employee':
            const { empId } = await inquirer.prompt({
                name: 'empId',
                message: 'Employee ID to delete:'
            });
            await db.deleteEmployee(empId);
            console.log('Employee deleted successfully!');
            break;

        case 'Delete a role':
            const { roleId } = await inquirer.prompt({
                name: 'roleId',
                message: 'Role ID to delete:'
            });
            await db.deleteRole(roleId);
            console.log('Role deleted successfully!');
            break;

        case 'Delete a department':
            const { deptId } = await inquirer.prompt({
                name: 'deptId',
                message: 'Department ID to delete:'
            });
            await db.deleteDepartment(deptId);
            console.log('Department deleted successfully!');
            break;

        case 'View total budget of a department':
            const { budgetDeptId } = await inquirer.prompt({
                name: 'budgetDeptId',
                message: 'Department ID:'
            });
            const budget = await db.getTotalBudget(budgetDeptId);
            console.log(`Total budget for department ${budgetDeptId}: $${budget}`);
            break;

        case 'Exit':
            console.log('Goodbye!');
            process.exit(0);
            break;
    }
    main(); // Call main again for the next action
}

main();