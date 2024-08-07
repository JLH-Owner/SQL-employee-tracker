DROP DATABASE IF EXISTS employee_tracker_DB;
CREATE DATABASE Employee_tracker_DB;

USE employee_tracker_DB;

CREATE TABLE Departments (
  dept_id SERIAL PRIMARY KEY,
  dept_id INTEGER NOT NULL,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE Roles (
  role_id SERIAL PRIMARY KEY,
  role_id INTEGER NOT NULL,
  title VARCHAR(30) UNIQUE NOT NULL,
  salary DECIMAL NOT NULL,
  dept_id INTEGER NOT NULL,
  FOREIGN KEY (dept_id) REFERENCES Departments(id)
  ON DELETE SET NULL
);

CREATE TABLE Employees (
  emp_id SERIAL PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER NOT NULL,
  manager_id INTEGER,
  FOREIGN KEY (role_id) REFERENCES Roles(role_id),
  FOREIGN KEY (manager_id) REFERENCES Employees(emp_id)
  ON DELETE SET NULL
);