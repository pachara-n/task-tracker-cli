#!/usr/bin/env node
const fs = require("fs");

let tasks= [];

if (fs.existsSync("tasks.json")){
  const fileData = fs.readFileSync("tasks.json", "utf-8");
  // แปลง JSON String กลับมาเป็น Array
  tasks = JSON.parse(fileData);
}

function addTask(task) {
    // สร้าง id ง่ายๆ ด้วยการนับจำนวน task ที่มีอยู่แล้วบวก 1
    const newId = tasks.length + 1;

    const newTask = {
      id: newId,
      description: task,
      status: "todo",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tasks.push(newTask);
    // แปลง array เป็น string style JSON ก่อนค่อยบันทึก
    // JSON.stringify มันรับ argument ได้ 3 ตัว(ข้อมูลที่ต้องการแปลง, ตัวกรองข้อมูล, ขึ้นบรรทัดใหม่/ จำนวน space ต่อ 1 บรรทัด)
    const dataToSave = JSON.stringify(tasks, null, 2);
    // บันทึกข้อมูลลงไฟล์ tasks.json
    fs.writeFileSync("tasks.json", dataToSave);
    console.log(`Task added successfully (ID: ${newId})`);
}

function listTask() {
  console.log("All tasks: " + tasks);
}

const command = process.argv[2];
const taskName = process.argv[3];

if (command === "add") {
    addTask(taskName);
} else if (command === "list") {
    listTask();
} else {
    console.log("Invalid command");
}

