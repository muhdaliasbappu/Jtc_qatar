
// New Leads Chart
colors = ["#727cf5", "#0acf97", "#fa5c7c", "#ffbc00"];
dataColors = $("#new-leads-chart").data("colors");

var options2 = {
  chart: {
    type: "line",
    height: 60,
    sparkline: { enabled: true }
  },
  series: [
    { data: doc.counts    }
  ],
  stroke: {
    width: 2,
    curve: "smooth"
  },
  markers: { size: 0 },
  colors: dataColors ? dataColors.split(",") : colors,
  tooltip: {
    fixed: { enabled: false },
    x: { show: false },
    y: {
      title: {
        formatter: function(value) {
          return "";
        }
      }
    },
    marker: { show: false }
  }
};

new ApexCharts(document.querySelector("#new-leads-chart"), options2).render();


