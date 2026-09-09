const isLoggedIn = localStorage.getItem("isLoggedIn");
const username = localStorage.getItem("username");

if (isLoggedIn !== "true") {

    window.location.href = "index.html";

} else {

    // ========================================
    // WELCOME MESSAGE
    // ========================================

    const greeting = document.getElementById("greeting");

    const currentHour = new Date().getHours();

    let timeGreeting;

    if (currentHour < 12) {
        timeGreeting = "Good Morning";
    } else if (currentHour < 18) {
        timeGreeting = "Good Afternoon";
    } else {
        timeGreeting = "Good Evening";
    }

    greeting.textContent = `${timeGreeting}, ${username}!`;


    // ========================================
    // STATISTICS
    // ========================================

    function updateStatistics() {

        const statistics = getCourseStatistics();

        document.getElementById("stat1-value").textContent =
            statistics.averageGrade;

        document.getElementById("stat2-value").textContent =
            statistics.ongoingCourses;

        document.getElementById("stat3-value").textContent =
            statistics.pendingAssignments;

        document.getElementById("stat4-value").textContent =
            statistics.averageAttendance + "%";
    }


    updateStatistics();


    // ========================================
    // COURSE TABLE
    // ========================================

    const courseTable = document.getElementById("courseTable");

    function displayCourses(courseList) {

        courseTable.innerHTML = "";

        if (courseList.length === 0) {

            courseTable.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-muted">
                        No courses found.
                    </td>
                </tr>
            `;

            return;
        }


        courseList.forEach(function (course) {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${course.code}</td>
                <td>${course.name}</td>
                <td>${course.category}</td>
                <td>${course.grade}</td>
                <td>${course.status}</td>
                <td>${course.attendance}%</td>
                <td>${course.assignmentStatus}</td>
            `;

            courseTable.appendChild(row);

        });
    }


    // Display all courses
    displayCourses(getCourses());


    // ========================================
    // SEARCH
    // ========================================

    const searchInput = document.getElementById("searchInput");

    searchInput.addEventListener("input", function () {

        applyAllFilters();

    });


    // ========================================
    // CATEGORY FILTER
    // ========================================

    const categoryFilter = document.getElementById("categoryFilter");

    categoryFilter.addEventListener("change", function () {

        applyAllFilters();

    });


    // ========================================
    // STATUS FILTER
    // ========================================

    const statusFilter = document.getElementById("statusFilter");

    statusFilter.addEventListener("change", function () {

        applyAllFilters();

    });


    // ========================================
    // SORTING
    // ========================================

    const sortSelect = document.getElementById("sortSelect");

    sortSelect.addEventListener("change", function () {

        applyAllFilters();

    });


    // ========================================
    // COMBINED FILTER + SEARCH + SORT
    // ========================================

    function applyAllFilters() {

        const category = categoryFilter.value;
        const status = statusFilter.value;
        const searchTerm = searchInput.value.toLowerCase().trim();
        const sortValue = sortSelect.value;


        let filteredCourses = [...getCourses()];


        // Category filter
        if (category !== "All") {

            filteredCourses = filteredCourses.filter(function (course) {

                return course.category === category;

            });

        }


        // Status filter
        if (status !== "All") {

            filteredCourses = filteredCourses.filter(function (course) {

                return course.status === status;

            });

        }


        // Search
        if (searchTerm !== "") {

            filteredCourses = filteredCourses.filter(function (course) {

                return (
                    course.name.toLowerCase().includes(searchTerm) ||
                    course.code.toLowerCase().includes(searchTerm) ||
                    course.instructor.toLowerCase().includes(searchTerm)
                );

            });

        }


        // Sorting
        if (sortValue === "grade-high") {

            filteredCourses.sort(function (a, b) {
                return b.grade - a.grade;
            });

        } else if (sortValue === "grade-low") {

            filteredCourses.sort(function (a, b) {
                return a.grade - b.grade;
            });

        } else if (sortValue === "name-az") {

            filteredCourses.sort(function (a, b) {
                return a.name.localeCompare(b.name);
            });

        } else if (sortValue === "name-za") {

            filteredCourses.sort(function (a, b) {
                return b.name.localeCompare(a.name);
            });

        }


        displayCourses(filteredCourses);
    }


    // ========================================
    // PENDING ASSIGNMENT ALERT
    // ========================================

    const alertSection = document.getElementById("alertSection");

    function updateAssignmentAlert() {

        const pendingAssignments = getPendingAssignments();

        if (pendingAssignments.length > 0) {

            alertSection.classList.remove("d-none");

            alertSection.innerHTML = `
                <strong>Attention:</strong>
                You have ${pendingAssignments.length}
                pending assignment(s).
            `;

        } else {

            alertSection.classList.add("d-none");

        }
    }


    updateAssignmentAlert();


    // ========================================
    // CSV EXPORT
    // ========================================

    const exportBtn = document.getElementById("exportBtn");

    exportBtn.addEventListener("click", function () {

        const category = categoryFilter.value;
        const status = statusFilter.value;
        const searchTerm = searchInput.value.toLowerCase().trim();


        let exportData = [...getCourses()];


        if (category !== "All") {

            exportData = exportData.filter(function (course) {

                return course.category === category;

            });

        }


        if (status !== "All") {

            exportData = exportData.filter(function (course) {

                return course.status === status;

            });

        }


        if (searchTerm !== "") {

            exportData = exportData.filter(function (course) {

                return (
                    course.name.toLowerCase().includes(searchTerm) ||
                    course.code.toLowerCase().includes(searchTerm) ||
                    course.instructor.toLowerCase().includes(searchTerm)
                );

            });

        }


        exportToCSV(exportData);

    });


    // ========================================
    // CHARTS
    // ========================================

    const courses = getCourses();


    // ----------------------------------------
    // Grades Chart
    // ----------------------------------------

    const gradesChartElement =
        document.getElementById("gradesChart");

    const gradesChart = new Chart(gradesChartElement, {

        type: "bar",

        data: {

            labels: courses.map(function (course) {
                return course.code;
            }),

            datasets: [
                {
                    label: "Grade",

                    data: courses.map(function (course) {
                        return course.grade;
                    })
                }
            ]

        },

        options: {

            responsive: true,

            scales: {

                y: {
                    beginAtZero: true,
                    max: 100
                }

            }

        }

    });


    // ----------------------------------------
    // Attendance Chart
    // ----------------------------------------

    const attendanceChartElement =
        document.getElementById("attendanceChart");

    const attendanceChart = new Chart(attendanceChartElement, {

        type: "line",

        data: {

            labels: courses.map(function (course) {
                return course.code;
            }),

            datasets: [
                {
                    label: "Attendance (%)",

                    data: courses.map(function (course) {
                        return course.attendance;
                    }),

                    tension: 0.3
                }
            ]

        },

        options: {

            responsive: true,

            scales: {

                y: {
                    beginAtZero: true,
                    max: 100
                }

            }

        }

    });


    // ----------------------------------------
    // Assignment Status Chart
    // ----------------------------------------

    const completedAssignments = courses.filter(function (course) {

        return course.assignmentStatus === "Completed";

    }).length;


    const pendingAssignmentsCount = courses.filter(function (course) {

        return course.assignmentStatus === "Pending";

    }).length;


    const assignmentChartElement =
        document.getElementById("assignmentChart");


    const assignmentChart = new Chart(assignmentChartElement, {

        type: "doughnut",

        data: {

            labels: [
                "Completed",
                "Pending"
            ],

            datasets: [
                {
                    label: "Assignments",

                    data: [
                        completedAssignments,
                        pendingAssignmentsCount
                    ]
                }
            ]

        },

        options: {

            responsive: true

        }

    });


    // ========================================
    // REAL-TIME UPDATE
    // ========================================

    const updateNotification =
        document.getElementById("updateNotification");


    setInterval(function () {

        const randomCourse =
            courses[Math.floor(Math.random() * courses.length)];


        // Simulate attendance update
        if (randomCourse.attendance < 100) {

            randomCourse.attendance += 1;

        }


        // Update statistics
        updateStatistics();


        // Update course table
        applyAllFilters();


        // Update attendance chart
        attendanceChart.data.datasets[0].data =
            courses.map(function (course) {

                return course.attendance;

            });

        attendanceChart.update();


        // Show notification
        updateNotification.classList.remove("d-none");

        updateNotification.innerHTML = `
            <strong>Real-Time Update:</strong>
            ${randomCourse.name} attendance has been updated
            to ${randomCourse.attendance}%.
        `;


        // Hide notification after 5 seconds
        setTimeout(function () {

            updateNotification.classList.add("d-none");

        }, 5000);


    }, 15000);


    // ========================================
    // RECENT ACTIVITY
    // ========================================

    const activities = [
        {
            date: "September 9, 2026",
            activity: "Web Systems and Technologies",
            status: "Ongoing"
        },
        {
            date: "September 8, 2026",
            activity: "Advanced Database Systems",
            status: "Completed"
        },
        {
            date: "September 7, 2026",
            activity: "Networking 1",
            status: "Completed"
        },
        {
            date: "September 6, 2026",
            activity: "Data Structures and Algorithms",
            status: "Pending"
        }
    ];


    const activityTable =
        document.getElementById("activityTable");


    activities.forEach(function (item) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.date}</td>
            <td>${item.activity}</td>
            <td>${item.status}</td>
        `;

        activityTable.appendChild(row);

    });


    // ========================================
    // LOGOUT
    // ========================================

    const logoutBtn =
        document.getElementById("logoutBtn");


    logoutBtn.addEventListener("click", function () {

        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("username");

        window.location.href = "index.html";

    });

}