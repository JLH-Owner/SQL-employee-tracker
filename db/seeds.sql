INSERT INTO department (name) VALUES ('Engineering'), ('Sales'), ('Marketing');

INSERT INTO role (title, salary, department_id) VALUES 
('Software Engineer', 80000, 1),
('Web Developer', 70000, 1),
('Sales Representative', 60000, 2),
('Marketing Manager', 90000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, 1),
('Jim', 'Brown', 3, NULL),
('Jack', 'White', 4, 2);