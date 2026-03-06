# Task Tracker CLI

A simple command-line interface (CLI) application for tracking your tasks and managing your to-do list.
This is a sample solution for the [task-tracker challenge](https://roadmap.sh/projects/task-tracker) from roadmap.sh.

## Prerequisites

- Node.js installed on your machine.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/pachara-n/task-tracker-cli.git
cd task-tracker-cli
```

2. Link the package globally to use the `task-cli` command anywhere in your terminal:

```bash
npm link
```

## Usage

You can use the `task-cli` command followed by the action you want to perform.

```bash
# Add a new task
task-cli add "Buy groceries"

# Update a task description
task-cli update 1 "Buy groceries and cook dinner"

# Delete a task
task-cli delete 1

# Mark a task's status
task-cli mark-in-progress 1
task-cli mark-done 1

# List all tasks
task-cli list

# List tasks by specific status
task-cli list done
task-cli list todo
task-cli list in-progress
```
