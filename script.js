const sheetURL = "YOUR_CSV_LINK_HERE";

fetch(sheetURL)
  .then(response => response.text())
  .then(data => {

    const rows = data.split("\n").map(row => row.split(","));

    const headerRow = rows[0];
    const monthSelect = document.getElementById("monthSelect");

    // Populate dropdown with months (starting from column 1)
    for (let i = 1; i < headerRow.length; i++) {
      if (headerRow[i]) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = headerRow[i];
        monthSelect.appendChild(option);
      }
    }

    function updateDashboard(monthIndex) {
      let total = 0;
      let verified = 0;
      let notStarted = 0;

      rows.forEach(row => {
        const metric = row[0]?.trim();
        const value = row[monthIndex]?.trim();

        if (metric === "Total Registration") {
          total = parseInt(value) || 0;
        }

        if (metric === "KYC Verified") {
          verified = parseInt(value) || 0;
        }

        if (metric === "KYC not started") {
          notStarted = parseInt(value) || 0;
        }
      });

      const pendingRate = total > 0
        ? ((notStarted / total) * 100).toFixed(1)
        : 0;

      document.getElementById("total").innerText = total;
      document.getElementById("verified").innerText = verified;
      document.getElementById("notStarted").innerText = notStarted;
      document.getElementById("pending").innerText = pendingRate + "%";
    }

    // Load latest month automatically
    const latestMonthIndex = headerRow.length - 1;
    monthSelect.value = latestMonthIndex;
    updateDashboard(latestMonthIndex);

    // Change when dropdown changes
    monthSelect.addEventListener("change", function() {
      updateDashboard(this.value);
    });

  });
