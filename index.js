import fs from 'fs'
import chalk from 'chalk';

// Function responsible for loading tasks
function loadTasks() {
  try {
    // Check if the file exists
    if (!fs.existsSync(tasksFile)) {
      const taskArray = { nextId: 1, taskArray: [] }
      // If it doesn't exist, proceed to create it
      fs.writeFileSync(tasksFile, JSON.stringify(taskArray)); // Create the file with an empty array
    }

    // Read the file and return the tasks
    const dataBuffer = fs.readFileSync(tasksFile);
    const dataJSON = dataBuffer.toString()
    return JSON.parse(dataJSON)
  } catch (error) {
    console.log(chalk.red(`Error - Function loadTask() - System error reading the file tasks.json: ${error}`))
  }
}

// Function to save tasks in the JSON file
function saveTasks(tasks) {
  try {
    const dataJSON = JSON.stringify(tasks, null, 2);  // Convert the object to JSON
    fs.writeFileSync(tasksFile, dataJSON);  // Write to the file
    currentTasks = loadTasks()

  } catch (error) {
    console.log(chalk.red(`Error - Function saveTask() - System error reading the file tasks.json: ${error}`))
  }
}

// Function to add a task
function addTask(taskDescription) {
  try {
    const tasks = loadTasks(); // Load existing tasks
    const actualDate = new Date(); // Get the current date
    const newTask = {
      'id': tasks.nextId++, // tasks.nextId++ takes the current value for 'Id' and also updates the value of the "nextId" property in the JSON file
      'task': taskDescription,
      'status': 'todo',
      'createdAt': actualDate.toUTCString(),
      'updatedAt': actualDate.toUTCString()
    }
    tasks.taskArray.push(newTask); // Add the new task
    saveTasks(tasks) // Save updated tasks
    console.log(chalk.green(`Task Id ${newTask.id} - Description: ${newTask.task} added successfully`));

  } catch (error) {
    console.log(chalk.red(`Error - Function addTask() - System error reading the file tasks.json: ${error}`))
  }
}

// Function to list tasks
function listTasks(args) {
  try {
    if (args.length === 0) {
      if (currentTasks.taskArray.length > 0) {
        console.log(chalk.blue(`List of tasks: `))
        currentTasks.taskArray.forEach(task => console.log(`Task id ${chalk.magenta(task.id)} - task: ${chalk.cyan(task.task)} - status: ${chalk.yellow(task.status)}`))
      } else {
        console.log(chalk.yellow("No tasks registered"))
      }
    } else {
      switch (args.toString()) {
        case 'todo':
          filtteredList(args)
          break;

        case 'done':
          filtteredList(args)
          break;

        case 'in-progress':
          filtteredList(args)
          break;

        default:
          console.log(chalk.red(`Invalid argument ${args}, please try again`))
          handleCommands('help')
          break;
      }
    }
  } catch (error) {
    console.log(chalk.red(`Error - Function listTasks() - System error listing the tasks: ${error}`))
  }
}

// Function to filter tasks by status
function filtteredList(args) {
  try {
    const filtterdedTasks = currentTasks.taskArray.filter(elemnt => elemnt.status === args.toString())
    if (filtterdedTasks.length === 0) {
      console.log(`There is no task with status ${args}`)
    } else {
      console.log(chalk.blue(`List of tasks with ${args} status: `))
      filtterdedTasks.forEach(task => console.log(`Task id ${chalk.magenta(task.id)} - task: ${chalk.cyan(task.task)} - status: ${chalk.yellow(task.status)}`))
    }
  } catch (error) {
    console.log(chalk.red(`Error - Function filtteredList() - System error filtering the tasks: ${error}`))
  }
};

// Function to show help
function help() {
  console.log(chalk.greenBright('List of available commands: \n'));
  console.log(chalk.gray('# Adding a new task'));
  console.log(chalk.green('Command example:'), chalk.yellow('add'), chalk.cyanBright('"Buy groceries"'));
  console.log(chalk.gray('# Output: Task added successfully (ID: 1)'));

  console.log(chalk.gray('\n# Updating and deleting tasks'));
  console.log(chalk.green('Command example:'), chalk.yellow('update'), chalk.magenta('1'), chalk.cyanBright('"Buy groceries and cook dinner"'));
  console.log(chalk.green('Command example:'), chalk.yellow('delete'), chalk.magenta('1'));

  console.log(chalk.gray('\n# Marking a task as in progress or done'));
  console.log(chalk.green('Command example:'), chalk.yellow('mark-in-progress'), chalk.magenta('1'));
  console.log(chalk.green('Command example:'), chalk.yellow('mark-done'), chalk.magenta('1'));

  console.log(chalk.gray('\n# Listing all tasks'));
  console.log(chalk.green('Command example:'), chalk.yellow('list'));

  console.log(chalk.gray('\n# Listing tasks by status'));
  console.log(chalk.green('Command example:'), chalk.yellow('list done'));
  console.log(chalk.green('Command example:'), chalk.yellow('list todo'));
  console.log(chalk.green('Command example:'), chalk.yellow('list in-progress'));

  console.log(chalk.gray('\n# Getting help with app commands'));
  console.log(chalk.green('Command example:'), chalk.yellow('help'));

  console.log(chalk.gray('\n# Exit the app'));
  console.log(chalk.green('Command example:'), chalk.yellow('exit'));
}

// Function to update tasks
function updateTasks(args) {
  try {
    let selectedElement = currentTasks.taskArray.find(element => element.id === Number(args[0]))

    if (selectedElement !== undefined) {
      selectedElement.task = args[1]
      selectedElement.updatedAt = new Date().toUTCString()
      saveTasks(currentTasks)
      console.log(chalk.green(`Task Id ${selectedElement.id} - Description: ${selectedElement.task} updated successfully`));
    } else {
      console.log(chalk.red(`Task with id ${args[0]} not found`))
    }
  } catch (error) {
    console.log(chalk.red(`Error - Function updateTasks() - System error updating the task: ${error}`))
  }
}

// Function to delete a task
function deleteTask(args) {
  try {
    let selectedElement = currentTasks.taskArray.find(element => element.id === Number(args[0]))

    if (selectedElement !== undefined) {
      let newArray = currentTasks.taskArray.filter(element => element.id !== Number(args[0]))
      currentTasks.taskArray = newArray
      saveTasks(currentTasks)
      console.log(chalk.green(`Task with id ${args[0]} updated successfully`))
    } else {
      console.log(chalk.red(`Task with id ${args[0]} not found`))
    }
  } catch (error) {
    console.log(chalk.red(`Error - Function deleteTask() - System error deleting the task: ${error}`))
  }
}

// Function to mark a task as in progress
function markInProgress(args) {
  try {
    // Function to mark a task as in progress
    let selectedElement = currentTasks.taskArray.find(element => element.id === Number(args[0]))

    if (selectedElement !== undefined) {
      selectedElement.status = 'in-progress'
      saveTasks(currentTasks)
      console.log(chalk.green(`Task with id ${args[0]} updated successfully`))
    } else {
      console.log(chalk.red(`Task with id ${args[0]} not found`))
    }
  } catch (error) {
    console.log(chalk.red(`Error - Function markInProgress() - System error updating the task: ${error}`))
  }
}

// Function to mark a task as completed
function markDone(args) {
  try {
    let selectedElement = currentTasks.taskArray.find(element => element.id === Number(args[0]))

    if (selectedElement !== undefined) {
      selectedElement.status = 'done'
      saveTasks(currentTasks)
      console.log(chalk.green(`Task with id ${args[0]} updated successfully`))
    } else {
      console.log(chalk.red(`Task with id ${args[0]} not found`))
    }
  } catch (error) {
    console.log(chalk.red(`Error - Function markDone() - System error updating the task: ${error}`))
  }
}

function handleCommands(command, args) {
  switch (command) {
    case 'add':
      addTask(args)
      break;

    case 'update':
      updateTasks(args);
      break;

    case 'delete':
      deleteTask(args);
      break;

    case 'mark-in-progress':
      markInProgress(args);
      break;

    case 'mark-done':
      markDone(args);
      break;

    case 'list':
      listTasks(args)
      break;

    case 'help':
      help();
      break;

    case 'exit':
      console.log(chalk.blue('Thank you for using SuperList, see you next time!'))
      process.exit();
      break;

    default:
      console.log(chalk.red(`Unrecognized command:`), chalk.magenta.bold(`${command}.`), chalk.red(`Please select one of the listed commands \n`));
      handleCommands('help');
      break;
  }
}

// File where tasks will be saved
const tasksFile = 'tasks.json';

// Variable that stores the tasks
let currentTasks = loadTasks()

console.log(chalk.blue('Welcome to SuperList!'))
console.log(chalk.greenBright('Type'), chalk.greenBright.bold('"help"'), chalk.greenBright('to see the list of available commands \n'));

// Listen to user input
process.stdin.on('data', (data) => {
  const input = data.toString().trim();
  const [command, ...args] = input.split(" ");
  handleCommands(command, args)
});
