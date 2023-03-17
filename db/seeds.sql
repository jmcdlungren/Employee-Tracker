USE employee_db;

INSERT INTO department (name)
VALUES ("Executive"),
       ("Legal"),
       ("Sales"),
       ("Human Resources"),
       ("Customer Service");

INSERT INTO role (title, salary, department_id)
VALUES ("CEO", 150000, 1),
       ("Lawyer", 100000, 2),
       ("Sales Associate", 60000, 3),
       ("HR Manager", 80000, 4),
       ("Customer Service Representative", 50000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Tom", "Sawyer", 1, NULL),
       ("Bill", "Rogers", 2, 1),
       ("Timmy", "Thompson", 3, 1),
       ("Bob", "Williamson", 4, 1),
       ("Carlos", "Santana", 5, 1);

