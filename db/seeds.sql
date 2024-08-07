INSERT INTO Departments (name)
VALUES ('Executive'),
       ('Financial'),
       ('Manager'),
       ('Associate')

INSERT INTO Roles (title, salary, dept_id)
VALUES ('CEO', 200000, 1),
       ('CFO', 150000, 2),
       ('Human Resources Manager', 100000, 3),
       ('Sales Manager', 90000, 3),
       ('Senior Sales Associate', 65000, 4),
       ('Junior Sales Associate', 50000, 4),
       ('Human Resources Clerk', 50000, 4);

INSERT INTO Employees (first_name,last_name,role_id,manager_id)
VALUES ('Natalie', 'Parsons', 1, null),
       ('Howard', 'Rife', 2, 1),
       ('Stephanie', 'Goldman', 3, 2),
       ('Michael', 'Cohen', 3, 2),
       ('Kylie', 'Markenson', 4, 3),
       ('Brian', 'Capstone', 4, 3),
       ('Janet', 'Simpson', 4, 3);