const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'emptracker_db',
    password: 'bootcamp24',
    port: 5432,
});

class Database {
    async getDepartments() {
        const res = await pool.query('SELECT * FROM department');
        return res.rows;
    }

    async getRoles() {
        const res = await pool.query('SELECT * FROM role');
        return res.rows;
    }

    async getEmployees() {
        const res = await pool.query('SELECT * FROM employee');
        return res.rows;
    }

    async addDepartment(name) {
        const res = await pool.query('INSERT INTO department (name) VALUES ($1, $2, $3) RETURNING *', [name]);
        return res.rows[0];
    }

    async addRole(title, salary, department) {
        const res = await pool.query('INSERT INTO role (title, salary, department) VALUES ($1, $2, $3, $4) RETURNING *', [title, salary, department]);
        return res.rows[0];
    }

    async addEmployee(first_name, last_name, role_id, manager_id) {
        const res = await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *', [first_name, last_name, role_id, manager_id]);
        return res.rows[0];
    }

    async updateEmployeeManager(employeeId, managerId) {
        await pool.query('UPDATE employee SET manager_id = $1 WHERE id = $2', [managerId, employeeId]);
    }

    async viewEmployeesByManager(managerId) {
        const res = await pool.query('SELECT * FROM employee WHERE manager_id = $1', [managerId]);
        return res.rows;
    }

    async viewEmployeesByDepartment(departmentId) {
        const res = await pool.query('SELECT employee.* FROM employee JOIN role ON employee.role_id = role.id WHERE role.department_id = $1', [departmentId]);
        return res.rows;
    }

    async deleteEmployee(employeeId) {
        await pool.query('DELETE FROM employee WHERE id = $1', [employeeId]);
    }

    async deleteRole(roleId) {
        await pool.query('DELETE FROM role WHERE id = $1', [roleId]);
    }

    async deleteDepartment(departmentId) {
        await pool.query('DELETE FROM department WHERE id = $1', [departmentId]);
    }

    async getTotalBudget(departmentId) {
        const res = await pool.query('SELECT SUM(role.salary) FROM role JOIN employee ON role.id = employee.role_id WHERE role.department_id = $1', [departmentId]);
        return res.rows[0].sum;
    }
}

module.exports = new Database();