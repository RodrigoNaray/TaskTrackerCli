import fs from 'fs'
import chalk from 'chalk';

// Archivo donde se guardarán las tareas
const tasksFile = 'tasks.json';


// Funcion encargada de cargar las tareas
function loadTasks() {
  try{

    //Verifico si existe el archivo
    if(!fs.existsSync(tasksFile)) {
      const taskArray = {nextId: 1 , taskArray: []}
      // Si no existe procedo a crearlo
      fs.writeFileSync(tasksFile, JSON.stringify(taskArray)); //Crea el archivo con un array vacio
    }
    
    //Leer el archivo y devolver las tareas
    const dataBuffer = fs.readFileSync(tasksFile);
    const dataJSON = dataBuffer.toString()
    return JSON.parse(dataJSON)
  }catch(error){
    console.log(chalk.red(`Error - Function loadTask() - System error reading the file tasks.json: ${error}`))
  }
}

// Función para guardar tareas en el archivo JSON
function saveTasks(tasks) {
  try{
    const dataJSON = JSON.stringify(tasks, null, 2);  // Convierte el objeto a JSON
    fs.writeFileSync(tasksFile, dataJSON);  // Escribe en el archivo
  }catch(error){
    console.log(chalk.red(`Error - Function saveTask() - System error reading the file tasks.json: ${error}`))
  }
}

//Funcion para agregar una tarea
function addTask(taskDescription){
  try{

    const tasks = loadTasks(); // Cargar tareas existentes
    const newTask = {
      'id': tasks.nextId++, // tasks.nextId++ toma el valor actual para el 'Id' y a su vez actualiza el valor de la propiedad nextId de la propiedad "nextId" del archivo JSON
      'task': taskDescription,
      'status': 'todo'
    }
    tasks.taskArray.push(newTask); // Agregar la nueva tarea
    saveTasks(tasks) // Guardar tareas actualizadas
    console.log(chalk.green(`Task Id ${newTask.id} - Description: ${newTask.task} added successfully`));

  }catch(error){
    console.log(chalk.red(`Error - Function addTask() - System error reading the file tasks.json: ${error}`))
  }
}

function listTasks(args) {
  if( args.length === 0){
    console.log(currentTasks.taskArray)
  }else{
    switch(args.toString()) {
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
}

function filtteredList(args){
  const filtterdedTasks = currentTasks.taskArray.filter( elemnt => {elemnt.status === JSON.stringify(args)})
  console.log(filtterdedTasks)
}

const currentTasks = loadTasks()




console.log(chalk.blue('Welcome to SuperList!'))
console.log(chalk.greenBright('Type'), chalk.greenBright.bold('"help"'),chalk.greenBright('to see the list of available commands \n'));


function handleCommands(command, args) {
  console.log(args)
  switch(command) {
    case 'add':
      addTask(args)
      break;
    
    case 'update':
      break;

    case 'delete':
      break;

    case 'mark-in-progress':
      break;

    case 'mark-done':
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
      console.log(chalk.red(`Unreconised command:`),chalk.magenta.bold(`${command}.`), chalk.red(`Please select one of the listed commands \n`));
      handleCommands('help');
      break;
  }
}



function help() {
  console.log(chalk.greenBright('List of available commands: \n'));
  console.log(chalk.gray('# Adding a new task'));
  console.log(chalk.green('Command example:'), chalk.yellow('add "Buy groceries"'));
  console.log(chalk.gray('# Output: Task added successfully (ID: 1)'));
  
  console.log(chalk.gray('\n# Updating and deleting tasks'));
  console.log(chalk.green('Command example:'), chalk.yellow('update'),chalk.magenta('1'),chalk.yellow('"Buy groceries and cook dinner"'));
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


process.stdin.on('data', (data) => {
  const input = data.toString().trim();
  const [command, ...args] = input.split(" ");
  handleCommands(command,args)
});