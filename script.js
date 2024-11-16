// Timetable for each class (period -> subject)
const classTimetable = {
    "6": { "1": "Math", "2": "Science", "3": "English", "4": "History", "5": "Geography" },
    "7": { "1": "Science", "2": "Math", "3": "History", "4": "English", "5": "Geography" },
    "8": { "1": "English", "2": "History", "3": "Math", "4": "Science", "5": "Geography" },
    // Add similar data for other classes
};

// Teacher-Subject-Class mapping
const teacherSubjectMapping = [
    { teacher: "Teacher A", subject: "Math", classes: ["6", "7", "8"] },
    { teacher: "Teacher B", subject: "Science", classes: ["6", "7", "8"] },
    { teacher: "Teacher C", subject: "English", classes: ["6", "7", "8"] },
    { teacher: "Teacher D", subject: "History", classes: ["6", "7", "8"] },
    { teacher: "Teacher E", subject: "Geography", classes: ["6", "7", "8"] },
    // Add more teachers here
];

// Populate teacher dropdown (multiple selection)
function populateTeacherDropdown() {
    const teacherDropdown = document.getElementById("teachers");
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
                        schedule.push({ class: classNum, period, subject: mapping.subject, teacher: mapping.teacher });
                    }
                }
            });
        }
    });
    return schedule;
}

// Find all available teachers for a specific subject and class (for a particular period)
function findAvailableTeachers(subject, classNum, busyTeachers) {
    // Collect teachers who are assigned to this subject and class but are not busy
    const availableTeachers = teacherSubjectMapping
        .filter(mapping => mapping.subject === subject && mapping.classes.includes(classNum))
        .map(mapping => mapping.teacher)
        .filter(teacher => !busyTeachers.includes(teacher));

    return availableTeachers;
}

// Display arrangements in the table
function displayArrangements(absentTeachers) {
    const tableBody = document.querySelector("#arrangementTable tbody");
    tableBody.innerHTML = ""; // Clear previous rows

    let allSchedules = [];

    // Collect all schedules for the absent teachers
    absentTeachers.forEach(absentTeacher => {
        const schedule = getAbsentTeacherSchedule(absentTeacher);
        allSchedules = [...allSchedules, ...schedule];
    });

    if (allSchedules.length === 0) {
        alert("No periods found for the selected absent teachers.");
        return;
    }

    // For each schedule, find all substitute teachers and display them
    allSchedules.forEach(({ class: classNum, period, subject, teacher }) => {
        const busyTeachers = absentTeachers.concat(getTeachersForSubjectAndClass(subject, classNum));  // Include absent teachers in the list of busy teachers
        const availableTeachers = findAvailableTeachers(subject, classNum, busyTeachers);

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${teacher}</td>
            <td>${classNum}</td>
            <td>${period}</td>
            <td>${subject}</td>
            <td>${availableTeachers.length > 0 ? availableTeachers.join(", ") : "No substitutes available"}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Get all teachers for a given subject and class
function getTeachersForSubjectAndClass(subject, classNum) {
    return teacherSubjectMapping
        .filter(mapping => mapping.subject === subject && mapping.classes.includes(classNum))
        .map(mapping => mapping.teacher);
}

// Event listener for the "Check Arrangements" button
document.getElementById("checkButton").addEventListener("click", () => {
    const selectedTeachers = Array.from(document.getElementById("teachers").selectedOptions).map(option => option.value);

    if (selectedTeachers.length === 0) {
        alert("Please select at least one absent teacher.");
        return;
    }

    displayArrangements(selectedTeachers);
});

// Initialize the page
populateTeacherDropdown();
