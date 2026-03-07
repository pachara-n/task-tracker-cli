#!/usr/bin/env node
const fs = require("fs");

let tasks = [];

if (fs.existsSync("tasks.json")) {
  const fileData = fs.readFileSync("tasks.json", "utf-8");
  // แปลง JSON String กลับมาเป็น Array
  tasks = JSON.parse(fileData);
}

function saveTasks() {
  try {
    // JSON.stringify มันรับ argument ได้ 3 ตัว(ข้อมูลที่ต้องการแปลง, ตัวกรองข้อมูล, ขึ้นบรรทัดใหม่/ จำนวน space ต่อ 1 บรรทัด)
    const dataToSave = JSON.stringify(tasks, null, 2);
    // บันทึกข้อมูลลงไฟล์ tasks.json
    fs.writeFileSync("tasks.json", dataToSave);
  } catch (error) {
    console.log(error);
  }
}

function addTask(task) {
  // Validate ว่าต้องมี description
  if (!task || task.trim() === "") {
    console.log("Error: Please provide a task description");
    return;
  }

  // สร้าง id และป้องกันการซ้ำถ้าลบด้วยการหา ID สูงสุดแล้วบวก 1
  const newId = tasks.length > 0 
    ? Math.max(...tasks.map(t => t.id)) + 1 
    : 1;

  const newTask = {
    id: newId,
    description: task,
    status: "todo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  saveTasks();
  console.log(`Task added successfully (ID: ${newId})`);
}

function markTaskStatus(idString, newStatus) {
  if (!idString) {
    console.log("Error: Please provide task ID");
    return;
  }

  const targetId = parseInt(idString);
  
  // ตรวจสอบว่า ID เป็นตัวเลขที่ valid
  if (isNaN(targetId)) {
    console.log("Error: ID must be a number");
    return;
  }

  const index = tasks.findIndex((task) => task.id === targetId);
  // ถ้าหาเจอ (findIndex ถ้าหาไม่เจอมันจะคืนค่า -1)
  if (index !== -1) {
    tasks[index].status = newStatus;
    tasks[index].updatedAt = new Date().toISOString();
    saveTasks();
    console.log(`Task ${targetId} marked as ${newStatus}`);
  } else {
    console.log(`Error: Task with ID ${targetId} not found`);
  }
}

function updateDescription(idString, newDescription) {
  if (!idString) {
    console.log("Error: Please provide task ID");
    return;
  }

  if (!newDescription || newDescription.trim() === "") {
    console.log("Error: Please provide new description");
    return;
  }

  const targetId = parseInt(idString);
  
  if (isNaN(targetId)) {
    console.log("Error: ID must be a number");
    return;
  }

  const index = tasks.findIndex((task) => task.id === targetId);
  if (index !== -1) {
    tasks[index].description = newDescription;
    tasks[index].updatedAt = new Date().toISOString();
    saveTasks();
    console.log(`Task ${targetId} updated successfully`);
  } else {
    console.log(`Error: Task with ID ${targetId} not found`);
  }
}

function deleteTask(idString) {
  if (!idString) {
    console.log("Error: Please provide task ID");
    return;
  }

  const targetId = parseInt(idString);
  
  if (isNaN(targetId)) {
    console.log("Error: ID must be a number");
    return;
  }

  // เช็คว่ามีก่อนลบ โดยนับจำนวน
  const currentCount = tasks.length;
  tasks = tasks.filter((task) => task.id !== targetId);
  
  if (tasks.length === currentCount) {
    console.log(`Error: Task with ID ${targetId} not found`);
  } else {
    saveTasks();
    console.log(`Task ${targetId} deleted successfully`);
  }
}

function listTask(status) {
  // ตัวแปร status การประกาศลอยๆ แบบนี้คือถ้ามีค่าก็เข้าเงื่อนไข ถ้าไม่ก็ไปทำหลัง :
  const taskToShow = status
    ? tasks.filter((task) => task.status === status)
    : tasks;

  if (taskToShow.length === 0) {
    const message = status 
      ? `No tasks found with status "${status}"` 
      : "No tasks found";
    console.log(message);
    return;
  }

  // แสดงผลแบบอ่านง่าย พร้อมเลข ID, description และ status
  console.log("\nTasks:");
  console.log("=".repeat(50));
  taskToShow.forEach(task => {
    console.log(`[${task.id}] ${task.description}`);
    console.log(`  Status: ${task.status} | Updated: ${new Date(task.updatedAt).toLocaleString()}`);
  });
  console.log("=".repeat(50) + "\n");
}

function showHelp() {
  console.log("\nTask Tracker CLI - Usage:\n");
  console.log("  task-cli add <description>           - Add a new task");
  console.log("  task-cli list [status]               - List all tasks or filter by status");
  console.log("                                         (status: todo, in-progress, done)");
  console.log("  task-cli update <id> <description>   - Update task description");
  console.log("  task-cli delete <id>                 - Delete a task");
  console.log("  task-cli mark-done <id>              - Mark task as done");
  console.log("  task-cli mark-in-progress <id>       - Mark task as in-progress");
  console.log("\nExamples:");
  console.log('  task-cli add "Buy groceries"');
  console.log('  task-cli list todo');
  console.log('  task-cli update 1 "Buy organic groceries"');
  console.log('  task-cli mark-done 1\n');
}

const command = process.argv[2];
const idOrTitle = process.argv[3];
const extraValue = process.argv[4];

if (command === "add") {
  addTask(idOrTitle);
} else if (command === "list") {
  listTask(idOrTitle);
} else if (command === "mark-in-progress") {
  markTaskStatus(idOrTitle, "in progress");
} else if (command === "mark-done") {
  markTaskStatus(idOrTitle, "done");
} else if (command === "update") {
  updateDescription(idOrTitle, extraValue);
} else if (command === "delete") {
  deleteTask(idOrTitle);
} else {
  console.log("Invalid command");
  showHelp();
}
