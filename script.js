// Timetable for each class (period -> subject)
const classTimetable = {
    "6": { "1": "Math", "2": "Science", "3": "English", "4": "History", "5": "Geography" },
    "7": { "1": "Science", "2": "Math", "3": "History", "4": "English", "5": "Geography" },
    "8": { "1": "English", "2": "History", "3": "Math", "4": "Science", "5": "Geography" },
    // Add similar data for other classes
};

// Teacher-Subject-Class mapping
const teacherSubjectMapping = [
    { teacher: "Teacher A", subject: "Math", classes: ["6", "8"] },
    { teacher: "Teacher B", subject: "Science", classes: ["6", "7", "8"] },
    { teacher: "Teacher B", subject: "Math", classes: ["7"] },
    { teacher: "Teacher C", subject: "English", classes: ["6", "7", "8"] },
    { teacher: "Teacher D", subject: "History", classes: ["6", "7", "8"] },
    { teacher: "Teacher E", subject: "Geography", classes: ["6", "7", "8"] },
    // Add more teachers here
];

// Populate teacher dropdown
function populateTeacherDropdown() {
    const teacherDropdown = document.getElementById("teacher");
    const teachers = [...new Set(teacherSubjectMapping.map(mapping => mapping.teacher))];
    teachers.forEach(teacher => {
        const option = document.createElement("option");
        option.value = teacher;
        option.textContent = teacher;
        teacherDropdown.appendChild(option);
    });
}

// Find all periods and classes an absent teacher is handling
function getAbsentTeacherSchedule(teacher) {
    const schedule = [];
    teacherSubjectMapping.forEach(mapping => {
        if (mapping.teacher === teacher) {
            mapping.classes.forEach(classNum => {
                for (const period in classTimetable[classNum]) {
                    if (classTimetable[classNum][period] === mapping.subject) {
                        schedule.push({ class: classNum, period, subject: mapping.subject });
                    }
                }
            });
        }
    });
    return schedule;
}

// Find available teachers for a specific subject and class
function findAvailableTeacher(subject, classNum) {
    const busyTeachers = teacherSubjectMapping
        .filter(mapping => mapping.subject === subject && mapping.classes.includes(classNum))
        .map(mapping => mapping.teacher);

    const allTeachers = [...new Set(teacherSubjectMapping.map(mapping => mapping.teacher))];
    return allTeachers.filter(teacher => !busyTeachers.includes(teacher))[0] || "No substitute available";
}

// Display arrangements in the table
function displayArrangements(schedule) {
    const tableBody = document.querySelector("#arrangementTable tbody");
    tableBody.innerHTML = ""; // Clear previous rows

    schedule.forEach(({ class: classNum, period, subject }) => {
        const availableTeacher = findAvailableTeacher(subject, classNum);

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${classNum}</td>
            <td>${period}</td>
            <td>${subject}</td>
            <td>${availableTeacher}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Event listener for the "Check Arrangements" button
document.getElementById("checkButton").addEventListener("click", () => {
    const absentTeacher = document.getElementById("teacher").value;
    if (!absentTeacher) {
        alert("Please select an absent teacher.");
        return;
    }

    const schedule = getAbsentTeacherSchedule(absentTeacher);
    if (schedule.length === 0) {
        alert("This teacher has no scheduled periods.");
    } else {
        displayArrangements(schedule);
    }
});

// Initialize the page
populateTeacherDropdown();
