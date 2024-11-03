import fs from 'fs'
import chalk from 'chalk';


// Funcion encargada de cargar las tareas
function loadTasks() {
  try {

    //Verifico si existe el archivo
    if (!fs.existsSync(tasksFile)) {
      const taskArray = { nextId: 1, taskArray: [] }
      // Si no existe procedo a crearlo
      fs.writeFileSync(tasksFile, JSON.stringify(taskArray)); //Crea el archivo con un array vacio
    }

    //Leer el archivo y devolver las tareas
    const dataBuffer = fs.readFileSync(tasksFile);
    const dataJSON = dataBuffer.toString()
    return JSON.parse(dataJSON)
  } catch (error) {
    console.log(chalk.red(`Error - Function loadTask() - System error reading the file tasks.json: ${error}`))
  }
}

// Función para guardar tareas en el archivo JSON
function saveTasks(tasks) {
  try {
    const dataJSON = JSON.stringify(tasks, null, 2);  // Convierte el objeto a JSON
    fs.writeFileSync(tasksFile, dataJSON);  // Escribe en el archivo
    currentTasks = loadTasks()

  } catch (error) {
    console.log(chalk.red(`Error - Function saveTask() - System error reading the file tasks.json: ${error}`))
  }
}

//Funcion para agregar una tarea
function addTask(taskDescription) {
  try {

    const tasks = loadTasks(); // Cargar tareas existentes
    const actualDate = new Date(); // Obtener la fecha actual
    const newTask = {
      'id': tasks.nextId++, // tasks.nextId++ toma el valor actual para el 'Id' y a su vez actualiza el valor de la propiedad nextId de la propiedad "nextId" del archivo JSON
      'task': taskDescription,
      'status': 'todo',
      'createdAt': actualDate.toUTCString(),
      'updatedAt': actualDate.toUTCString()
    }
    tasks.taskArray.push(newTask); // Agregar la nueva tarea
    saveTasks(tasks) // Guardar tareas actualizadas
    console.log(chalk.green(`Task Id ${newTask.id} - Description: ${newTask.task} added successfully`));

  } catch (error) {
    console.log(chalk.red(`Error - Function addTask() - System error reading the file tasks.json: ${error}`))
  }
}

//Funcion para listar las tareas
function listTasks(args) {
  try {

    if (args.length === 0) {
      if (currentTasks.taskArray.length > 0) {
        console.log(chalk.blue(`List of tasks: `))
        currentTasks.taskArray.forEach(task => console.log(`Task id ${chalk.magenta(task.id)} - task: ${chalk.cyan(task.task)} - status: ${chalk.yellow(task.status)}`))
      } else {
        console.log(chalk.yellow("No hay tareas registradas"))
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

//Funcion para filtrar las tareas por status
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

//Funcion para mostrar la ayuda
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

//Funcion para actualizar las tareas
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

//Funcion para eliminar una tarea
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

//Funcion para marcar una tarea como en progreso
function markInProgress(args) {
  try {

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

//Funcion para marcar una tarea como completada
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
      console.log(chalk.red(`Unreconised command:`), chalk.magenta.bold(`${command}.`), chalk.red(`Please select one of the listed commands \n`));
      handleCommands('help');
      break;
  }
}




// Archivo donde se guardarán las tareas
const tasksFile = 'tasks.json';

// Variable que almacena las tareas
let currentTasks = loadTasks()

console.log(chalk.blue('Welcome to SuperList!'))
console.log(chalk.greenBright('Type'), chalk.greenBright.bold('"help"'), chalk.greenBright('to see the list of available commands \n'));

// Escuchar la entrada del usuario
process.stdin.on('data', (data) => {
  const input = data.toString().trim();
  const [command, ...args] = input.split(" ");
  handleCommands(command, args)
});