# Employee Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Description

I was motivated to create a program that allows a manager to easily view and edit departments, roles, and the employee registry. This program allows the user to add and remove, update managers, view the department budget, and sort as needed.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Questions and Contributing](#questions-and-contributing)
- [Tests](#tests)

## Installation

The user will first need to clone this repository and have it added to their files (recommended program of use is Visual Studio Code). Once cloned, as long as the user has the applicable systems installed (Git Bash, Node, & SQL), the user will then be able to run "npm i" in the terminal. This will automatically install all necessary programs. Once installed, the user will need to create a ".env" file with the following filled out:

    DB_NAME='employee_db'
    DB_USER='ENTER USERNAME HERE'
    DB_PASSWORD='ENTER PASSWORD HERE'


Once all of the above is completed, the user will then be able to run "node server" in the terminal and the program will run. Refer to the [Usage](#usage) section for further information on use.

## Usage

When the user runs "node server" it will begin the Employee Tracker. From there, the user is presented with a list of choices such as View All Departments, Sort All Employees by Manager, or Add Employee, among others. When the user selects any of the view or sort options, it will present a table with the results selected. If the user selects either the add or remove options, the user will be presented with a list of choices, whether it be departments, roles, or employees depending on what they selected. In addition, the program may also provide a list of other choices for salary, the manager name, or the department that a role belongs to, when applicable.

Please view the following video of usage:

[![Video of program use, providing a visual of options and usage when running the program in the terminal.](./Images/Employee%20Tracker%20GIF.gif)](https://drive.google.com/file/d/1SFqBqdqWUi5t1HUQxdw9t1ia8ko_fS9Q/view)

## License

[The MIT License](https://opensource.org/licenses/MIT)

## Questions and Contributing

If you have any questions, you can contact me by [email](j.mcd.lungren@gmail.com) or through [GitHub](https://github.com/jmcdlungren).

If you are interested in contributing, please follow the guidelines outlined within the [Contributor Covenant](https://www.contributor-covenant.org/).

## Tests

N/A