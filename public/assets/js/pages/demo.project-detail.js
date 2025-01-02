   /**
     * Function to initialize or update the chart based on selected project
     * @param {string} selectedProject - The key corresponding to the selected project's data in PPerformance
     */
   function renderChart(selectedProject) {
    const ctx = document.getElementById('projectChart').getContext('2d');

    // Retrieve the data for the selected project
    const projectData = PPerformance[selectedProject];

    if (!projectData) {
        console.error(`No data found for project: ${selectedProject}`);
        return;
    }

    // Define the datasets based on projectData
    const data = {
        labels: projectData.date, // Assuming 'date' is an array of labels
        datasets: [
            {
                label: "Own Labour",
                backgroundColor: "transparent",
                borderColor: "#727cf5",
                borderDash: [5, 5],
                fill: true,
                data: projectData.ownlaboursalary
            },
            {
                label: "Hired Labour",
                fill: true,
                backgroundColor: "transparent",
                borderColor: "#0acf97",
                borderDash: [5, 5],
                data: projectData.hiredlabourmsalary
            },
            {
                label: "Man Power",
                fill: true,
                backgroundColor: "transparent",
                borderColor: "#fa5c7c",
                borderDash: [5, 5],
                data: projectData.hiredstaffhourly
            },
            {
                label: "Own Staff(P)",
                fill: true,
                backgroundColor: "transparent",
                borderColor: "#6c757d",
                borderDash: [5, 5],
                data: projectData.ownstaffsalary
            },
            {
                label: "Hired Staff(P)",
                fill: true,
                backgroundColor: "transparent",
                borderColor: "#39afd1",
                borderDash: [5, 5],
                data: projectData.hiredstaffsalary
            },
            {
                label: "Operation Cost",
                fill: true,
                backgroundColor: "transparent",
                borderColor: "#ffbc00",
                borderDash: [5, 5],
                data: projectData.operationcost
            },
            {
                label: "Over Head Cost",
                fill: true,
                backgroundColor: "transparent",
                borderColor: "#ff6b6b",
                borderDash: [5, 5],
                data: projectData.overheadcost
            },
            {
                label: "Total Cost",
                fill: true,
                backgroundColor: "rgba(10, 207, 151, 0.3)",
                borderColor: "#727cf5",
                data: projectData.total
            }
        ]
    };

    // Define chart options
    const options = {
        maintainAspectRatio: false,
        plugins: {
            filler: { propagate: true },
            legend: { display: false }, // Show legend for clarity
            tooltip: { intersect: false },
            hover: { intersect: true }
        },
        tension: 0.3,
        scales: {
            x: {
                grid: { color: "rgba(0,0,0,0.05)" }
            },
            y: {
                ticks: { stepSize: 20 },
                display: true,
                borderDash: [5, 5],
                grid: { color: "rgba(0,0,0,0)", fontColor: "#fff" }
            }
        }
    };

    // If chart already exists, destroy it before creating a new one
    if (projectChart) {
        projectChart.destroy();
    }

    // Create a new Chart instance
    projectChart = new Chart(ctx, {
        type: "line",
        data: data,
        options: options
    });
}

// Event listener for project selection change
document.getElementById('projectSelect').addEventListener('change', (e) => {
    const selectedValue = e.target.value; // e.g., 'one', 'two', etc.
    renderChart(selectedValue);
});

// Initialize the chart with the first project on page load
document.addEventListener('DOMContentLoaded', function() {
    const initialProject = document.getElementById('projectSelect').value;
    renderChart(initialProject);
});
