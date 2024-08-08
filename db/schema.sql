DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;

\c employee_tracker;

CREATE TABLE Departments (
  dept_id INTEGER NOT NULL,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (dept_id)
);

CREATE TABLE Roles (
  role_id INTEGER NOT NULL,
  title VARCHAR(30) UNIQUE NOT NULL,
  salary DECIMAL NOT NULL,
  dept_id INTEGER NOT NULL,
  PRIMARY KEY (role_id),
  FOREIGN KEY (dept_id) REFERENCES Departments(dept_id)
  ON DELETE SET NULL
);

CREATE TABLE Employees (
  emp_id INTEGER NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER NOT NULL,
  manager_id INTEGER,
  PRIMARY KEY (emp_id),
  FOREIGN KEY (role_id) REFERENCES Roles(role_id),
  FOREIGN KEY (manager_id) REFERENCES Employees(emp_id)
  ON DELETE SET NULL
);