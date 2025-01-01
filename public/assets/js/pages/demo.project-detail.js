(function ($) {
    "use strict";

    // ChartJs Constructor
    function ChartJs() {
        this.$body = $("body");
        this.charts = [];
    }

    /**
     * Initialize a responsive Line Chart
     * @param {string} selector - The DOM selector for the canvas element.
     * @param {object} data - The data object for the chart.
     * @param {object} options - The configuration options for the chart.
     * @returns {Chart} - The initialized Chart.js instance.
     */
    ChartJs.prototype.initLineChart = function (selector, data, options) {
        var chartInstance,
            originalDraw = Chart.controllers.line.prototype.draw,
            ctx = $(selector)[0].getContext("2d"),
            container = $(selector).parent();

        // Override the draw method to add shadow effect
        Chart.controllers.line.prototype.draw = function () {
            originalDraw.apply(this, arguments);
            var ctx = this.chart.ctx;
            var originalStroke = ctx.stroke;

            ctx.stroke = function () {
                ctx.save();
                ctx.shadowColor = "rgba(0,0,0,0.01)";
                ctx.shadowBlur = 20;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 5;
                originalStroke.apply(this, arguments);
                ctx.restore();
            };
        };

        // Set default Chart.js global options
        Chart.defaults.color = "#8fa2b3";
        Chart.defaults.scale.grid.color = "#8391a2";

        // Adjust canvas width to match its container
        $(selector).attr("width", $(container).width());

        // Initialize the Line chart
        chartInstance = new Chart(ctx, {
            type: "line",
            data: data,
            options: options
        });

        return chartInstance;
    };

    /**
     * Initialize all required charts on the page.
     * @returns {Array} - An array of initialized Chart.js instances.
     */
    ChartJs.prototype.initCharts = function () {
        var charts = [];

        // Initialize Line Chart if the element exists
        if ($("#one").length > 0) {
            charts.push(this.initLineChart(
                "#one",
                {
                    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                    datasets: [
                        {
                            label: "Own Labour",
                            backgroundColor: "transparent",
                            borderColor: "#727cf5",
                            borderDash: [5, 5],
                            fill: true,
                            data: [32, 42, 40, 62, 52, 75, 62]
                        },
                        {
                            label: "Hired Labour",
                            fill: true,
                            backgroundColor: "transparent",
                            borderColor: "#0acf97",
                            borderDash: [5, 5],
                            data: [42, 58, 45, 93, 82, 105, 92]
                        },
                        {
                            label: "Man Power",
                            fill: true,
                            backgroundColor: "transparent",
                            borderColor: "#fa5c7c",
                            borderDash: [5, 5],
                            data: [42, 98,50, 93, 82, 108, 292]
                        },
                        {
                            label: "Own Staff(P)",
                            fill: true,
                            backgroundColor: "transparent",
                            borderColor: "#6c757d",
                            borderDash: [5, 5],
                            data: [42, 98,60, 93, 82, 108, 292]
                        },
                        {
                            label: "Hired Staff(P)",
                            fill: true,
                            backgroundColor: "transparent",
                            borderColor: "#39afd1",
                            borderDash: [5, 5],
                            data: [42, 98,70, 93, 82, 108, 292]
                        },
                        {
                            label: "Operation Cost",
                            fill: true,
                            backgroundColor: "transparent",
                            borderColor: "#ffbc00",
                            borderDash: [5, 5],
                            data: [42, 98,80, 93, 82, 108, 292]
                        }
                        ,
                        {
                            label: "Over Head Cost",
                            fill: true,
                            backgroundColor: "transparent",
                            borderColor: "#ff6b6b",
                            borderDash: [5, 5],
                            data: [42, 98,90, 93, 82, 108, 292]
                        },
                        {
                            label: "Total Cost",
                            fill: true,
                            backgroundColor: "rgba(10, 207, 151, 0.3)",
                            borderColor: "#727cf5",
                            data: [42, 98,133, 93, 82, 108, 292]
                        }
                    ]
                },
                {
                    maintainAspectRatio: false,
                    plugins: {
                        filler: { propagate: false },
                        legend: { display: false },
                        tooltips: { intersect: false },
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
                }
            ));
        }
      
        else if ($("#two").length > 0) {
            charts.push(this.initLineChart(
                "#two",
                {
                    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                    datasets: [
                        {
                            label: "Own Labour",
                            backgroundColor: "transparent",
                            borderColor: "#727cf5",
                            borderDash: [5, 5],
                            fill: true,
                            data: [32, 42, 40, 62, 52, 75, 62]
                        },
                        {
                            label: "Hired Labour",
                            fill: true,
                            backgroundColor: "transparent",
                            borderColor: "#0acf97",
                            borderDash: [5, 5],
                            data: [42, 58, 45, 93, 82, 105, 92]
                        },
                        {
                            label: "Man Power",
                            fill: true,
                            backgroundColor: "transparent",
                            borderColor: "#fa5c7c",
                            borderDash: [5, 5],
                            data: [42, 98,50, 93, 82, 108, 292]
                        },
                        {
                            label: "Own Staff(P)",
                            fill: true,
                            backgroundColor: "transparent",
                            borderColor: "#6c757d",
                            borderDash: [5, 5],
                            data: [42, 98,60, 93, 82, 108, 292]
                        },
                        {
                            label: "Hired Staff(P)",
                            fill: true,
                            backgroundColor: "transparent",
                            borderColor: "#39afd1",
                            borderDash: [5, 5],
                            data: [42, 98,70, 93, 82, 108, 292]
                        },
                        {
                            label: "Operation Cost",
                            fill: true,
                            backgroundColor: "transparent",
                            borderColor: "#ffbc00",
                            borderDash: [5, 5],
                            data: [42, 98,80, 93, 82, 108, 292]
                        }
                        ,
                        {
                            label: "Over Head Cost",
                            fill: true,
                            backgroundColor: "transparent",
                            borderColor: "#ff6b6b",
                            borderDash: [5, 5],
                            data: [42, 98,90, 93, 82, 108, 292]
                        },
                        {
                            label: "Total Cost",
                            fill: true,
                            backgroundColor: "rgba(10, 207, 151, 0.3)",
                            borderColor: "#727cf5",
                            data: [42, 98,133, 93, 82, 108, 292]
                        }
                    ]
                },
                {
                    maintainAspectRatio: false,
                    plugins: {
                        filler: { propagate: false },
                        legend: { display: false },
                        tooltips: { intersect: false },
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
                }
            ));
        }
        else if ($("#three").length > 0) {
            charts.push(this.initLineChart(
                "#one",
                {
                    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                    datasets: [
                        {
                            label: "Own Labour",
                            backgroundColor: "transparent",
                            borderColor: "#727cf5",
                            borderDash: [5, 5],
                            fill: true,
                            data: [32, 42, 40, 62, 52, 75, 62]
                        },
                        {
                            label: "Hired Labour",
                            fill: true,
                            backgroundColor: "transparent",
                            borderColor: "#0acf97",
                            borderDash: [5, 5],
                            data: [42, 58, 45, 93, 82, 105, 92]
                        },
                        {
                            label: "Man Power",
                            fill: true,
                            backgroundColor: "transparent",
                            borderColor: "#fa5c7c",
                            borderDash: [5, 5],
                            data: [42, 98,50, 93, 82, 108, 292]
                        },
                        {
                            label: "Own Staff(P)",
                            fill: true,
                            backgroundColor: "transparent",
                            borderColor: "#6c757d",
                            borderDash: [5, 5],
                            data: [42, 98,60, 93, 82, 108, 292]
                        },
                        {
                            label: "Hired Staff(P)",
                            fill: true,
                            backgroundColor: "transparent",
                            borderColor: "#39afd1",
                            borderDash: [5, 5],
                            data: [42, 98,70, 93, 82, 108, 292]
                        },
                        {
                            label: "Operation Cost",
                            fill: true,
                            backgroundColor: "transparent",
                            borderColor: "#ffbc00",
                            borderDash: [5, 5],
                            data: [42, 98,80, 93, 82, 108, 292]
                        }
                        ,
                        {
                            label: "Over Head Cost",
                            fill: true,
                            backgroundColor: "transparent",
                            borderColor: "#ff6b6b",
                            borderDash: [5, 5],
                            data: [42, 98,90, 93, 82, 108, 292]
                        },
                        {
                            label: "Total Cost",
                            fill: true,
                            backgroundColor: "rgba(10, 207, 151, 0.3)",
                            borderColor: "#727cf5",
                            data: [42, 98,133, 93, 82, 108, 292]
                        }
                    ]
                },
                {
                    maintainAspectRatio: false,
                    plugins: {
                        filler: { propagate: false },
                        legend: { display: false },
                        tooltips: { intersect: false },
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
                }
            ));
        }
        else if ($("#four").length > 0) {
            charts.push(this.initLineChart(
                "#one",
                {
                    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                    datasets: [
                        {
                            label: "Own Labour",
                            backgroundColor: "transparent",
                            borderColor: "#727cf5",
                            borderDash: [5, 5],
                            fill: true,
                            data: [32, 42, 40, 62, 52, 75, 62]
                        },
                        {
                            label: "Hired Labour",
                            fill: true,
                            backgroundColor: "transparent",
                            borderColor: "#0acf97",
                            borderDash: [5, 5],
                            data: [42, 58, 45, 93, 82, 105, 92]
                        },
                        {
                            label: "Man Power",
                            fill: true,
                            backgroundColor: "transparent",
                            borderColor: "#fa5c7c",
                            borderDash: [5, 5],
                            data: [42, 98,50, 93, 82, 108, 292]
                        },
                        {
                            label: "Own Staff(P)",
                            fill: true,
                            backgroundColor: "transparent",
                            borderColor: "#6c757d",
                            borderDash: [5, 5],
                            data: [42, 98,60, 93, 82, 108, 292]
                        },
                        {
                            label: "Hired Staff(P)",
                            fill: true,
                            backgroundColor: "transparent",
                            borderColor: "#39afd1",
                            borderDash: [5, 5],
                            data: [42, 98,70, 93, 82, 108, 292]
                        },
                        {
                            label: "Operation Cost",
                            fill: true,
                            backgroundColor: "transparent",
                            borderColor: "#ffbc00",
                            borderDash: [5, 5],
                            data: [42, 98,80, 93, 82, 108, 292]
                        }
                        ,
                        {
                            label: "Over Head Cost",
                            fill: true,
                            backgroundColor: "transparent",
                            borderColor: "#ff6b6b",
                            borderDash: [5, 5],
                            data: [42, 98,90, 93, 82, 108, 292]
                        },
                        {
                            label: "Total Cost",
                            fill: true,
                            backgroundColor: "rgba(10, 207, 151, 0.3)",
                            borderColor: "#727cf5",
                            data: [42, 98,133, 93, 82, 108, 292]
                        }
                    ]
                },
                {
                    maintainAspectRatio: false,
                    plugins: {
                        filler: { propagate: false },
                        legend: { display: false },
                        tooltips: { intersect: false },
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
                }
            ));
        }
        else if ($("#six").length > 0) {
            charts.push(this.initLineChart(
                "#one",
                {
                    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                    datasets: [
                        {
                            label: "Own Labour",
                            backgroundColor: "transparent",
                            borderColor: "#727cf5",
                            borderDash: [5, 5],
                            fill: true,
                            data: [32, 42, 40, 62, 52, 75, 62]
                        },
                        {
                            label: "Hired Labour",
                            fill: true,
                            backgroundColor: "transparent",
                            borderColor: "#0acf97",
                            borderDash: [5, 5],
                            data: [42, 58, 45, 93, 82, 105, 92]
                        },
                        {
                            label: "Man Power",
                            fill: true,
                            backgroundColor: "transparent",
                            borderColor: "#fa5c7c",
                            borderDash: [5, 5],
                            data: [42, 98,50, 93, 82, 108, 292]
                        },
                        {
                            label: "Own Staff(P)",
                            fill: true,
                            backgroundColor: "transparent",
                            borderColor: "#6c757d",
                            borderDash: [5, 5],
                            data: [42, 98,60, 93, 82, 108, 292]
                        },
                        {
                            label: "Hired Staff(P)",
                            fill: true,
                            backgroundColor: "transparent",
                            borderColor: "#39afd1",
                            borderDash: [5, 5],
                            data: [42, 98,70, 93, 82, 108, 292]
                        },
                        {
                            label: "Operation Cost",
                            fill: true,
                            backgroundColor: "transparent",
                            borderColor: "#ffbc00",
                            borderDash: [5, 5],
                            data: [42, 98,80, 93, 82, 108, 292]
                        }
                        ,
                        {
                            label: "Over Head Cost",
                            fill: true,
                            backgroundColor: "transparent",
                            borderColor: "#ff6b6b",
                            borderDash: [5, 5],
                            data: [42, 98,90, 93, 82, 108, 292]
                        },
                        {
                            label: "Total Cost",
                            fill: true,
                            backgroundColor: "rgba(10, 207, 151, 0.3)",
                            borderColor: "#727cf5",
                            data: [42, 98,133, 93, 82, 108, 292]
                        }
                    ]
                },
                {
                    maintainAspectRatio: false,
                    plugins: {
                        filler: { propagate: false },
                        legend: { display: false },
                        tooltips: { intersect: false },
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
                }
            ));
        }
        else if ($("#seven").length > 0) {
            charts.push(this.initLineChart(
                "#one",
                {
                    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                    datasets: [
                        {
                            label: "Own Labour",
                            backgroundColor: "transparent",
                            borderColor: "#727cf5",
                            borderDash: [5, 5],
                            fill: true,
                            data: [32, 42, 40, 62, 52, 75, 62]
                        },
                        {
                            label: "Hired Labour",
                            fill: true,
                            backgroundColor: "transparent",
                            borderColor: "#0acf97",
                            borderDash: [5, 5],
                            data: [42, 58, 45, 93, 82, 105, 92]
                        },
                        {
                            label: "Man Power",
                            fill: true,
                            backgroundColor: "transparent",
                            borderColor: "#fa5c7c",
                            borderDash: [5, 5],
                            data: [42, 98,50, 93, 82, 108, 292]
                        },
                        {
                            label: "Own Staff(P)",
                            fill: true,
                            backgroundColor: "transparent",
                            borderColor: "#6c757d",
                            borderDash: [5, 5],
                            data: [42, 98,60, 93, 82, 108, 292]
                        },
                        {
                            label: "Hired Staff(P)",
                            fill: true,
                            backgroundColor: "transparent",
                            borderColor: "#39afd1",
                            borderDash: [5, 5],
                            data: [42, 98,70, 93, 82, 108, 292]
                        },
                        {
                            label: "Operation Cost",
                            fill: true,
                            backgroundColor: "transparent",
                            borderColor: "#ffbc00",
                            borderDash: [5, 5],
                            data: [42, 98,80, 93, 82, 108, 292]
                        }
                        ,
                        {
                            label: "Over Head Cost",
                            fill: true,
                            backgroundColor: "transparent",
                            borderColor: "#ff6b6b",
                            borderDash: [5, 5],
                            data: [42, 98,90, 93, 82, 108, 292]
                        },
                        {
                            label: "Total Cost",
                            fill: true,
                            backgroundColor: "rgba(10, 207, 151, 0.3)",
                            borderColor: "#727cf5",
                            data: [42, 98,133, 93, 82, 108, 292]
                        }
                    ]
                },
                {
                    maintainAspectRatio: false,
                    plugins: {
                        filler: { propagate: false },
                        legend: { display: false },
                        tooltips: { intersect: false },
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
                }
            ));
        }
    

        return charts;
    };

    /**
     * Initialize the ChartJs instance.
     */
    ChartJs.prototype.init = function () {
        var self = this;

        // Set default font family for all charts
        Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif';

        // Initialize charts and store references
        self.charts = self.initCharts();

        // Reinitialize charts on window resize
        $(window).on("resize", function () {
            $.each(self.charts, function (index, chart) {
                try {
                    chart.destroy();
                } catch (error) {
                    console.error("Error destroying chart:", error);
                }
            });
            self.charts = self.initCharts();
        });
    };

    // Assign the ChartJs instance to jQuery namespace
    $.ChartJs = new ChartJs();
    $.ChartJs.Constructor = ChartJs;

})(window.jQuery);

// Initialize ChartJs when the document is ready
(function () {
    "use strict";
    window.jQuery.ChartJs.init();
})();
