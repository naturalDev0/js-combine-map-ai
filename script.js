document.addEventListener("DOMContentLoaded", function () {
    const mapConfig = initMap(1.2938, 103.8540, "singapore-map");

    // Tab switching
    const tabBtns = document.querySelectorAll(".tab-btn");
    tabBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {
            const tabName = btn.getAttribute("data-tab");

            tabBtns.forEach(function (b) { b.classList.remove("active"); });
            document.querySelectorAll(".tab-content").forEach(function (content) {
                content.classList.remove("active");
            });

            btn.classList.add("active");
            document.querySelector("#" + tabName + "-tab").classList.add("active");
        });
    });

    const searchBtn = document.querySelector("#search-btn");
    searchBtn.addEventListener("click", async function () {
        try {
            const searchTerms = document.querySelector("#search-terms").value;
            const center = mapConfig.map.getBounds().getCenter();
            const response = await search(center.lat, center.lng, searchTerms);
            displayResults(mapConfig, response.results);
        } catch (error) {
            console.error(error);
        }
    })

    const recommendBtn = document.querySelector("#recommend-btn");
    recommendBtn.addEventListener("click", async function () {
        const recommendLoading = document.querySelector("#recommend-loading");
        const recommendError = document.querySelector("#recommend-error");
        const recommendResults = document.querySelector("#recommend-results");

        recommendLoading.innerHTML = "Getting recommendations...";
        recommendError.innerHTML = "";
        recommendResults.innerHTML = "";

        try {
            const recommendTerms = document.querySelector("#recommend-terms").value;
            const center = mapConfig.map.getBounds().getCenter();
            const response = await recommend(center.lat, center.lng, recommendTerms);
            displayRecommendations(mapConfig, response);
            recommendLoading.innerHTML = "";
        } catch (error) {
            recommendLoading.innerHTML = "";
            recommendError.innerHTML = "Error: " + error.message;
        }
    })
})