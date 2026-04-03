const API_BASE = "/grades";

const messageBox = document.getElementById("message");
const studentResult = document.getElementById("studentResult");
const gradesTableBody = document.getElementById("gradesTableBody");

document.getElementById("getGradeBtn").addEventListener("click", getStudentGrade);
document.getElementById("addStudentBtn").addEventListener("click", addStudent);
document.getElementById("editStudentBtn").addEventListener("click", editStudentGrade);
document.getElementById("deleteStudentBtn").addEventListener("click", deleteStudent);
document.getElementById("refreshBtn").addEventListener("click", loadAllGrades);

function showMessage(text, type) {
    messageBox.textContent = text;
    messageBox.className = `message ${type}`;
}

function clearMessage() {
    messageBox.textContent = "";
    messageBox.className = "message";
}

function encodeStudentName(name) {
    return encodeURIComponent(name.trim());
}

async function handleResponse(response) {
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
    return await response.json();
}

function renderGradesTable(data) {
    gradesTableBody.innerHTML = "";

    if (Array.isArray(data)) {
        if (data.length === 0) {
            gradesTableBody.innerHTML = `<tr><td colspan="2">No students found.</td></tr>`;
            return;
        }

        data.forEach(student => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${student.name}</td><td>${student.grade}</td>`;
            gradesTableBody.appendChild(row);
        });
    } else if (typeof data === "object" && data !== null) {
        const entries = Object.entries(data);

        if (entries.length === 0) {
            gradesTableBody.innerHTML = `<tr><td colspan="2">No students found.</td></tr>`;
            return;
        }

        entries.forEach(([name, grade]) => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${name}</td><td>${grade}</td>`;
            gradesTableBody.appendChild(row);
        });
    } else {
        gradesTableBody.innerHTML = `<tr><td colspan="2">Unable to display data.</td></tr>`;
    }
}

async function loadAllGrades() {
    clearMessage();
    try {
        const response = await fetch(API_BASE);
        const data = await handleResponse(response);
        renderGradesTable(data);
        showMessage("Loaded all students and grades.", "success");
    } catch (error) {
        showMessage(error.message, "error");
    }
}

async function getStudentGrade() {
    clearMessage();
    const name = document.getElementById("searchName").value.trim();

    if (!name) {
        showMessage("Please enter a student name.", "error");
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/${encodeStudentName(name)}`);
        const data = await handleResponse(response);

        if (data.name && data.grade !== undefined) {
            studentResult.textContent = `${data.name}: ${data.grade}`;
        } else {
            const entries = Object.entries(data);
            if (entries.length > 0) {
                studentResult.textContent = `${entries[0][0]}: ${entries[0][1]}`;
            } else {
                studentResult.textContent = "Student not found.";
            }
        }

        showMessage("Student grade retrieved successfully.", "success");
    } catch (error) {
        studentResult.textContent = "Student not found or request failed.";
        showMessage(error.message, "error");
    }
}

async function addStudent() {
    clearMessage();
    const name = document.getElementById("addName").value.trim();
    const grade = parseFloat(document.getElementById("addGrade").value);

    if (!name || isNaN(grade)) {
        showMessage("Enter a valid student name and grade.", "error");
        return;
    }

    try {
        const response = await fetch(API_BASE, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, grade })
        });

        await handleResponse(response);
        showMessage(`Added ${name} successfully.`, "success");
        document.getElementById("addName").value = "";
        document.getElementById("addGrade").value = "";
        loadAllGrades();
    } catch (error) {
        showMessage(error.message, "error");
    }
}

async function editStudentGrade() {
    clearMessage();
    const name = document.getElementById("editName").value.trim();
    const grade = parseFloat(document.getElementById("editGrade").value);

    if (!name || isNaN(grade)) {
        showMessage("Enter a valid student name and new grade.", "error");
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/${encodeStudentName(name)}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ grade })
        });

        await handleResponse(response);
        showMessage(`Updated ${name} successfully.`, "success");
        document.getElementById("editName").value = "";
        document.getElementById("editGrade").value = "";
        loadAllGrades();
    } catch (error) {
        showMessage(error.message, "error");
    }
}

async function deleteStudent() {
    clearMessage();
    const name = document.getElementById("deleteName").value.trim();

    if (!name) {
        showMessage("Enter a student name to delete.", "error");
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/${encodeStudentName(name)}`, {
            method: "DELETE"
        });

        await handleResponse(response);
        showMessage(`Deleted ${name} successfully.`, "success");
        document.getElementById("deleteName").value = "";
        loadAllGrades();
    } catch (error) {
        showMessage(error.message, "error");
    }
}

loadAllGrades();