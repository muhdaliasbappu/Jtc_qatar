document.addEventListener("DOMContentLoaded", function () {
    // Check if the 'projectbar' data is defined
    if (typeof projectbar === 'undefined') {
        console.error("projectbar data is not defined.");
        return;
    }

    // Define the series mapping
    const seriesMapping = {
        "Own Labour": "ownlaboursalary",
        "Hired Labour": "hiredlabourmsalary",
        "Man Power": "hiredstaffhourly",
        "Own Staff(P)": "ownstaffsalary",
        "Hired Staff(P)": "hiredstaffsalary",
        "Operation Cost": "operationcost",
        "Over Head Cost": "overheadcost"
    };

    // Define the order of series to maintain consistent coloring
    const seriesOrder = [
        "Own Labour",
        "Hired Labour",
        "Man Power",
        "Own Staff(P)",
        "Hired Staff(P)",
        "Operation Cost",
        "Over Head Cost"
    ];

    // Define the color mapping
    const seriesColors = {
        "Own Labour": "#727cf5",
        "Hired Labour": "#0acf97",
        "Man Power": "#fa5c7c",
        "Own Staff(P)": "#6c757d",
        "Hired Staff(P)": "#39afd1",
        "Operation Cost": "#ffbc00",
        "Over Head Cost": "#ff6b6b"
    };

    // Generate colors array based on the series order
    const colorsArray = seriesOrder.map(seriesName => seriesColors[seriesName]);

    /**
     * Function to generate series data based on selected time frame
     * @param {string} timeFrame - The key representing the time frame in the projectbar object
     * @returns {Array} - Array of series objects for ApexCharts
     */
    function getSeriesData(timeFrame) {
        // Ensure the timeFrame exists in projectbar
        if (!projectbar[timeFrame]) {
            console.error(`No data found for time frame: ${timeFrame}`);
            return [];
        }

        return seriesOrder.map(name => ({
            name: name,
            data: projectbar[timeFrame][seriesMapping[name]] || []
        }));
    }

    // Initialize the chart with the default time frame (currentMonth)
    var chartOptions = {
        chart: {
            height: 380,
            type: "bar",
            stacked: true,
            toolbar: { show: false },
            id: "projectCost-chart" // Assign a unique ID to the chart
        },
        plotOptions: {
            bar: {
                horizontal: true,
                dataLabels: { position: 'top' }
            }
        },
        stroke: { show: false },
        series: getSeriesData('currentMonth'),
        xaxis: {
            categories: (projectbar.currentMonth && projectbar.currentMonth.projectname) || [],
            labels: { 
                formatter: function(val) { 
                    return "QAR " + val; 
                } 
            },
            axisBorder: { show: false }
        },
        yaxis: { title: { text: undefined } },
        colors: colorsArray,
        tooltip: { 
            y: { 
                formatter: function(val) { 
                    return "QAR " + val; 
                } 
            } 
        },
        fill: { opacity: 1 },
        states: { hover: { filter: "none" } },
        legend: {
            position: "top",
            horizontalAlign: "center",
            offsetY: 10
        },
        grid: { borderColor: "#f1f3fa" }
    };

    var chartElement = document.querySelector("#projectCost-chart");
    if (!chartElement) {
        console.error("Element with ID 'projectCost-chart' not found.");
        return;
    }

    var chart = new ApexCharts(chartElement, chartOptions);
    chart.render();

    /**
     * Handle dropdown selection for dynamic chart switching
     * Only processes dropdown items with href attributes starting with '#'
     */
    const dropdownItems = document.querySelectorAll(".dropdown-item");
    dropdownItems.forEach(function(item) {
        item.addEventListener("click", function(e) {
            const href = this.getAttribute("href");

            // Check if href starts with '#'
            if (href && href.startsWith("#")) {
                e.preventDefault(); // Prevent default navigation

                const target = href.substring(1); // Remove '#' from href

                // Validate that the target exists in projectbar
                if (!projectbar[target]) {
                    console.error(`No data found for target: ${target}`);
                    return;
                }

                // Update chart categories and series data
                chart.updateOptions({
                    xaxis: {
                        categories: projectbar[target].projectname || []
                    },
                    series: getSeriesData(target)
                });
            }
            // If href does not start with '#', allow default behavior (e.g., navigation for Logout)
        });
    });
});
