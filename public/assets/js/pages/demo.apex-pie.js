// Colors for the chart
colors = ["#727cf5", "#0acf97", "#fa5c7c", "#6c757d", "#39afd1", "#ffbc00", "#ff6b6b"];


// Data object for the chart
let seriedate = typeCounts
// Extract series data and labels from seriedate
let seriesData = Object.values(seriedate);
let labelsData = Object.keys(seriedate);

// Update Donut Chart
dataColors = $("#update-donut").data("colors");
options = {
    chart: {
        height: 300,
        type: "donut"
    },
    dataLabels: {
        enabled: false
    },
    series: seriesData, // Use the dynamic data
    labels: labelsData, // Use the dynamic labels
    colors: dataColors ? dataColors.split(",") : colors,
    legend: {
        show: false,
        position: "bottom",
        horizontalAlign: "center",
        verticalAlign: "middle",
        floating: false,
        fontSize: "0px",
        offsetX: 0,
        offsetY: 7
    },
    responsive: [{
        breakpoint: 600,
        options: {
            chart: {
                height: 240
            },
            legend: {
                show: false
            }
        }
    }]
};

chart = new ApexCharts(document.querySelector("#update-donut"), options);
chart.render();

// Utility Functions for Update Donut Chart
function appendData() {
    var newSeries = chart.w.globals.series.map(function () {
        return Math.floor(100 * Math.random()) + 1;
    });
    newSeries.push(Math.floor(100 * Math.random()) + 1);
    return newSeries;
}

function removeData() {
    var newSeries = chart.w.globals.series.map(function () {
        return Math.floor(100 * Math.random()) + 1;
    });
    newSeries.pop();
    return newSeries;
}

function randomize() {
    return chart.w.globals.series.map(function () {
        return Math.floor(100 * Math.random()) + 1;
    });
}

function reset() {
    return seriesData; // Reset to the original dynamic data
}
