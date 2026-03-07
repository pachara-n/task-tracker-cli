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
    console.log(
      `Please input ID! (Ex. task-cli mark-${newStatus === "done" ? "done" : "in-progress"} 1)`,
    );
    return;
  }

  const targetId = parseInt(idString);
  const index = tasks.findIndex((task) => task.id === targetId);
  // ถ้าหาเจอ (findIndex ถ้าหาไม่เจอมันจะคืนค่า -1)
  if (index !== -1) {
    tasks[index].status = newStatus;
    tasks[index].updatedAt = new Date().toISOString();
    saveTasks();
    console.log(`Task ${targetId} marked as ${newStatus}`);
  } else {
    console.log(`Not found ID: ${targetId}`);
  }
}

function updateDescription(idString, newDescription) {
  if (!idString) {
    console.log("plese input ID! (Ex. task-cli update 1)");
    return;
  }
  const targetId = parseInt(idString);
  const index = tasks.findIndex((task) => task.id === targetId);
  if (index !== -1) {
    tasks[index].description = newDescription;
    tasks[index].updatedAt = new Date().toISOString();
    saveTasks();
    console.log(`Task ${targetId} update description successfully`);
  }
}

function deleteTask(idString) {
  const targetId = parseInt(idString);
  // Check if exis before delete
  const currentCount = tasks.length;
  tasks = tasks.filter((task) => task.id !== targetId);
  if (tasks.length === currentCount) {
    console.log(`Not found ID: ${targetId}`);
  } else {
    saveTasks();
    console.log("remove task successfully");
  }
}

function listTask(status) {
  // ตัวแปร status การประกาศลอยๆ แบบนี้คือถ้ามีค่าก็เข้าเงื่อนไข ถ้าไม่ก็ไปทำหลัง :
  const taskToShow = status
    ? tasks.filter((task) => task.status === status)
    : tasks;
  console.log("tasks: ", taskToShow);
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
}
