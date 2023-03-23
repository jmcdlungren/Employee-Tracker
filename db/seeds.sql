USE employee_db;

INSERT INTO department (name)
VALUES ("Executive"),
       ("Legal"),
       ("Human Resources"),
       ("Sales"),
       ("Customer Service");

INSERT INTO role (title, salary, department_id)
VALUES ("CEO", 150000, 1),
       ("Lawyer", 100000, 2),
       ("HR Manager", 80000, 3),
       ("Sales Manager", 75000, 4),
       ("Sales Associate", 60000, 4),
       ("Customer Service Manager", 70000, 5),
       ("Customer Service Representative", 50000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id, department_id)
VALUES ("Tom", "Sawyer", 1, NULL, 1),
       ("Bill", "Rogers", 2, 1, 2),
       ("Bob", "Williamson", 3, 1, 3),
       ("Abdul", "Paraya", 4, 1, 4),
       ("Timmy", "Thompson", 5, 4, 4),
       ("Carlos", "Santana", 6, 1, 5),
       ("Manny", "Ortega", 7, 6, 5);
       
       
       

