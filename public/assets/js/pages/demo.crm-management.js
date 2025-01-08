
let apexChart = null; // Will hold the current ApexCharts instance

  /**
   * Renders the ApexCharts chart for the given project key.
   * @param {string} selectedProject - The key (e.g. "one", "two") for the project's data in PPerformance.
   */
  function renderApexChart(selectedProject) {
    // Retrieve data for the selected project
    const projectData = PPerformance[selectedProject];

    if (!projectData) {
      console.error(`No data found for project: ${selectedProject}`);
      return;
    }

    // Default colors to match each series
    const defaultColors = [
      "#6f70af", // Own Labour
      "#0acf97", // Hired Labour
      "#fa5c7c", // Man Power
      "#6c757d", // Own Staff(P)
      "#39afd1", // Hired Staff(P)
      "#ffbc00", // Operation Cost
      "#ff6b6b", // Over Head Cost
      "#727cf5"  // Total Cost
    ];

    // If you have a custom color list in a data attribute:
    // var dataColors = $("#revenue-statistics-chart").data("colors");
    // const chartColors = dataColors ? dataColors.split(",") : defaultColors;
    const chartColors = defaultColors; // or override with any logic you prefer

    // Destroy the existing chart if it already exists (so we can create a fresh one)
    if (apexChart) {
      apexChart.destroy();
      apexChart = null;
    }

    // Configure the ApexCharts options
    const options = {
      chart: {
        height: 361,
        type: "line",
        dropShadow: {
          enabled: true,
          opacity: 0.2,
          blur: 7,
          left: -7,
          top: 7
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth",
        width: 3
      },
      series: [
        {
          name: "Own Labour",
          data: projectData.ownlaboursalary
        },
        {
          name: "Hired Labour",
          data: projectData.hiredlabourmsalary
        },
        {
          name: "Man Power",
          data: projectData.hiredstaffhourly
        },
        {
          name: "Own Staff(P)",
          data: projectData.ownstaffsalary
        },
        {
          name: "Hired Staff(P)",
          data: projectData.hiredstaffsalary
        },
        {
          name: "Operation Cost",
          data: projectData.operationcost
        },
        {
          name: "Over Head Cost",
          data: projectData.overheadcost
        },
        {
          name: "Total Cost",
          data: projectData.total
        }
      ],
      colors: chartColors,
      xaxis: {
        // If your data is monthly, you can manually use months:
        categories: projectData.date,
        // OR if your backend provides date labels, you could do:
        // categories: projectData.date,
        tooltip: {
          enabled: false
        },
        axisBorder: {
          show: false
        }
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            // Example suffix "k"
            return  value ;
          },
          offsetX: -15
        }
      },
      zoom: {
        enabled: false
      }
    };

    // Create and render the new ApexCharts instance
    apexChart = new ApexCharts(
      document.querySelector("#revenue-statistics-chart"),
      options
    );
    apexChart.render();
  }

  // Event listener for the project dropdown
  document.addEventListener('DOMContentLoaded', function() {
    const projectSelect = document.getElementById('projectSelect');
    // Render the initial chart based on the default selected project
    renderApexChart(projectSelect.value);

    // Update the chart whenever the selection changes
    projectSelect.addEventListener('change', function (e) {
      const newProject = e.target.value;
      renderApexChart(newProject);
    });
  });
