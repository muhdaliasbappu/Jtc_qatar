// public/assets/js/pages/demo.dashboard.wallet.js

(function (a) {
    "use strict";
  
    // Dashboard Wallet Constructor
    function DashboardWallet() {}
  
    // 'init' will do the fetch from /api/dashboard and store that data in 'this'
    DashboardWallet.prototype.init = async function () {

      try {
        
  
        // Now actually initialize the chart
        await this.initMonthBalance();
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };
  
    DashboardWallet.prototype.initMonthBalance = async function () {
      // Access categories/data from 'this'
      const categories = reportData?.categories || ["Jan", "Feb", "Mar"];
      const data       = reportData?.data       || [0, 0, 0];
  
    
  
      const chartElement = document.querySelector("#month-balance-chart");
      if (!chartElement) {
        console.error("Chart element not found");
        return;
      }
  
      const options = {
        chart: {
          type: "area",
          height: 350,
          toolbar: { show: false }
        },
        colors: ["#0acf97"],
        dataLabels: { enabled: false },
        stroke: { width: 1 },
        series: [
          {
            data: data,
            name: "Projects Cost"
          }
        ],
        markers: { size: 0, style: "hollow" },
        xaxis: {
          categories: categories,
          tickAmount: 6
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              return "QAR " + value;
            }
          }
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0,
            stops: [0, 100]
          }
        }
      };
  
      new ApexCharts(chartElement, options).render();
    };
  
    // Attach our constructor to the global object
    a.DashboardWallet = new DashboardWallet();
    a.DashboardWallet.Constructor = DashboardWallet;
  
    // On DOMContentLoaded, run 'init'
    document.addEventListener("DOMContentLoaded", async function () {
      await a.DashboardWallet.init();
    });
  })(window.jQuery);
  
