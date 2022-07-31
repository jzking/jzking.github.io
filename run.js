
window.onload = function() {
    onOverviewShow();
    var overviewDiv = document.getElementById("overview")
    var scatterDiv = document.getElementById("scatter");
    var regionDiv = document.getElementById("regions");
    
    var scatterButton = document.getElementById("toScatter");

    var backOverviewButton = document.getElementById("backToOverview");
    var regionButton = document.getElementById("toRegions");

    var backScatterButton = document.getElementById("backToScatter");
    var startOverButton = document.getElementById("startOver");

    scatterButton.onclick = function () {
      d3.select("svg").remove();
      overviewDiv.style.display = "none";
      scatterDiv.style.display = "block";
      regionDiv.style.display = "none";
      onScatterShow();
    };
    backOverviewButton.onclick = function () {
        d3.select("svg").remove();
        overviewDiv.style.display = "block";
        scatterDiv.style.display = "none";
        regionDiv.style.display = "none";
        onOverviewShow();
      };
      regionButton.onclick = function () {
        d3.select("svg").remove();
        overviewDiv.style.display = "none";
        scatterDiv.style.display = "none";
        regionDiv.style.display = "block";
        onRegionShow();
      };
      backScatterButton.onclick = function () {
        d3.select("svg").remove();
        overviewDiv.style.display = "none";
        scatterDiv.style.display = "block";
        regionDiv.style.display = "none";
        onScatterShow();
      };
      startOverButton.onclick = function () {
        d3.select("svg").remove();
        overviewDiv.style.display = "block";
        scatterDiv.style.display = "none";
        regionDiv.style.display = "none";
        onOverviewShow();
      };
}
