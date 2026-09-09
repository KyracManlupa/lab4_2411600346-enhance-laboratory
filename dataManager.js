// ========================================
// STUDENT PORTAL - DATA MANAGER
// ========================================

// Course Data
const courses = [
    {
        id: 1,
        code: "ITE313",
        name: "Web Systems and Technologies",
        category: "IT",
        instructor: "Instructor 1",
        grade: 95,
        status: "Ongoing",
        units: 3,
        attendance: 95,
        assignmentStatus: "Pending"
    },
    {
        id: 2,
        code: "IM101",
        name: "Advanced Database Systems",
        category: "IT",
        instructor: "Instructor 2",
        grade: 92,
        status: "Ongoing",
        units: 3,
        attendance: 93,
        assignmentStatus: "Completed"
    },
    {
        id: 3,
        code: "ITE311",
        name: "Networking 1",
        category: "IT",
        instructor: "Instructor 3",
        grade: 94,
        status: "Ongoing",
        units: 3,
        attendance: 96,
        assignmentStatus: "Completed"
    },
    {
        id: 4,
        code: "ITE312",
        name: "Data Structures and Algorithms",
        category: "IT",
        instructor: "Instructor 4",
        grade: 90,
        status: "Ongoing",
        units: 3,
        attendance: 91,
        assignmentStatus: "Pending"
    },
    {
        id: 5,
        code: "RIZAL",
        name: "Life and Works of Rizal",
        category: "General Education",
        instructor: "Instructor 5",
        grade: 93,
        status: "Completed",
        units: 3,
        attendance: 97,
        assignmentStatus: "Completed"
    },
    {
        id: 6,
        code: "PATHFIT3",
        name: "PATHFIT 3",
        category: "General Education",
        instructor: "Instructor 6",
        grade: 96,
        status: "Ongoing",
        units: 2,
        attendance: 98,
        assignmentStatus: "Completed"
    }
];

// ========================================
// DATA RETRIEVAL
// ========================================

function getCourses() {
    return courses;
}

function getCourseById(id) {
    return courses.find(course => course.id === id);
}

function getCoursesByCategory(category) {
    if (category === "All") {
        return courses;
    }

    return courses.filter(course => course.category === category);
}

function getPendingAssignments() {
    return courses.filter(
        course => course.assignmentStatus === "Pending"
    );
}

// ========================================
// STATISTICS
// ========================================

function getCourseStatistics() {
    const totalCourses = courses.length;

    const averageGrade =
        courses.reduce((total, course) => total + course.grade, 0)
        / totalCourses;

    const averageAttendance =
        courses.reduce((total, course) => total + course.attendance, 0)
        / totalCourses;

    const ongoingCourses =
        courses.filter(course => course.status === "Ongoing").length;

    const completedCourses =
        courses.filter(course => course.status === "Completed").length;

    const pendingAssignments =
        courses.filter(course => course.assignmentStatus === "Pending").length;

    return {
        totalCourses,
        averageGrade: averageGrade.toFixed(2),
        averageAttendance: averageAttendance.toFixed(2),
        ongoingCourses,
        completedCourses,
        pendingAssignments
    };
}

// ========================================
// FILTERING
// ========================================

function filterByCategory(category) {
    if (category === "All") {
        return courses;
    }

    return courses.filter(course => course.category === category);
}

function filterByStatus(status) {
    if (status === "All") {
        return courses;
    }

    return courses.filter(course => course.status === status);
}

function filterByGrade(minGrade, maxGrade) {
    return courses.filter(
        course => course.grade >= minGrade &&
                  course.grade <= maxGrade
    );
}

function applyFilters(category, status, minGrade, maxGrade) {
    return courses.filter(course => {
        const categoryMatch =
            category === "All" || course.category === category;

        const statusMatch =
            status === "All" || course.status === status;

        const gradeMatch =
            course.grade >= minGrade &&
            course.grade <= maxGrade;

        return categoryMatch && statusMatch && gradeMatch;
    });
}

// ========================================
// SEARCH
// ========================================

function searchCourses(searchTerm) {
    const term = searchTerm.toLowerCase().trim();

    if (term === "") {
        return courses;
    }

    return courses.filter(course =>
        course.name.toLowerCase().includes(term) ||
        course.code.toLowerCase().includes(term) ||
        course.instructor.toLowerCase().includes(term)
    );
}

// ========================================
// SORTING
// ========================================

function sortCoursesByGrade(order = "desc") {
    return [...courses].sort((a, b) => {
        return order === "asc"
            ? a.grade - b.grade
            : b.grade - a.grade;
    });
}

function sortCoursesByName(order = "asc") {
    return [...courses].sort((a, b) => {
        const result = a.name.localeCompare(b.name);

        return order === "asc" ? result : -result;
    });
}

// ========================================
// CSV EXPORT
// ========================================

function exportToCSV(data) {
    if (!data || data.length === 0) {
        return;
    }

    const headers = [
        "Course Code",
        "Course Name",
        "Category",
        "Instructor",
        "Grade",
        "Status",
        "Units",
        "Attendance",
        "Assignment Status"
    ];

    const rows = data.map(course => [
        course.code,
        course.name,
        course.category,
        course.instructor,
        course.grade,
        course.status,
        course.units,
        course.attendance,
        course.assignmentStatus
    ]);

    let csvContent = headers.join(",") + "\n";

    rows.forEach(row => {
        csvContent += row.join(",") + "\n";
    });

    downloadCSV(csvContent, "student-portal-records.csv");
}

function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}