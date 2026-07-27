(() => {
  const sites = window.juswrkCoverageSites || [];
  const summary = window.juswrkCoverageSummary || {};
  if (!sites.length) return;

  const map = document.getElementById("coverageMap");
  const zones = [...document.querySelectorAll(".coverage-zone")];
  const search = document.getElementById("coverageSearch");
  const reset = document.getElementById("coverageReset");
  const list = document.getElementById("coverageSiteList");
  const detail = document.getElementById("coverageSiteDetail");
  const selectionLabel = document.getElementById("coverageSelectionLabel");
  const selectionTitle = document.getElementById("coverageSelectionTitle");
  const resultCount = document.getElementById("coverageResultCount");
  let activeRegion = "North West";
  let activeSiteId = "";

  const escapeHtml = value => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const slug = value => String(value).toLowerCase()
    .replaceAll("&", "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const formatBytes = bytes => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const regionCount = region => sites.filter(site => site.region === region).length;

  const addDensityDots = zone => {
    const count = regionCount(zone.dataset.region);
    const dots = Math.min(12, Math.max(3, Math.ceil(count / 3)));
    const field = document.createElement("i");
    field.className = "coverage-density";
    for (let index = 0; index < dots; index += 1) {
      const dot = document.createElement("i");
      dot.style.setProperty("--dot-x", `${16 + ((index * 29 + count * 7) % 68)}%`);
      dot.style.setProperty("--dot-y", `${18 + ((index * 43 + count * 11) % 62)}%`);
      dot.style.setProperty("--dot-delay", `${(index % 5) * 0.12}s`);
      field.append(dot);
    }
    zone.append(field);
  };

  zones.forEach(zone => {
    const count = regionCount(zone.dataset.region);
    const counter = zone.querySelector("[data-zone-count]");
    if (counter) counter.textContent = count;
    addDensityDots(zone);
  });

  document.getElementById("coverageProjectRecords").textContent = summary.projectRecords || "418";
  document.getElementById("coverageLocations").textContent = summary.mappedLocations || sites.length;
  document.getElementById("coveragePlans").textContent = summary.rolloutPlans || "141";
  document.getElementById("coverageReports").textContent = summary.dailyReports || "99";

  const renderDetail = site => {
    if (!site) {
      detail.innerHTML = `
        <small>Choose a site</small>
        <h3>Project evidence appears here.</h3>
        <p>Select a location to see the store reference and matching archive records.</p>
      `;
      return;
    }
    const files = (site.files || []).slice(0, 4).map(file => `<li>${escapeHtml(file)}</li>`).join("");
    detail.innerHTML = `
      <small>${escapeHtml(site.region)} - ${escapeHtml(site.id)}</small>
      <h3>${escapeHtml(site.name)}</h3>
      <div class="coverage-detail-facts">
        <span><b>${escapeHtml(site.store || "Archive")}</b> store reference</span>
        <span><b>${site.evidence || 1}</b> matching record${site.evidence === 1 ? "" : "s"}</span>
      </div>
      <p>The original source documents remain outside the public website.</p>
      ${files ? `<strong class="coverage-file-label">Archive matches</strong><ul>${files}</ul>` : ""}
    `;
  };

  const filteredSites = () => {
    const query = search.value.trim().toLowerCase();
    return sites.filter(site => {
      const regionMatch = activeRegion === "All coverage" || site.region === activeRegion;
      const queryMatch = !query || `${site.name} ${site.store} ${site.region}`.toLowerCase().includes(query);
      return regionMatch && queryMatch;
    });
  };

  const render = () => {
    const filtered = filteredSites();
    selectionLabel.textContent = search.value.trim() ? "Search results" : "Selected region";
    selectionTitle.textContent = activeRegion;
    resultCount.textContent = filtered.length;
    reset.textContent = activeRegion === "All coverage" ? "All 139 shown" : `Show all ${sites.length}`;
    zones.forEach(zone => zone.classList.toggle("is-active", zone.dataset.region === activeRegion));

    if (!filtered.length) {
      list.innerHTML = '<p class="coverage-loading">No mapped site matches that search.</p>';
      activeSiteId = "";
      renderDetail(null);
      return;
    }

    list.innerHTML = filtered.map(site => `
      <button class="coverage-site-button${site.id === activeSiteId ? " is-active" : ""}" type="button" data-site-id="${escapeHtml(site.id)}">
        <span><small>${escapeHtml(site.store || "Archive")}</small><strong>${escapeHtml(site.name)}</strong></span>
        <b>${site.evidence || 1}</b>
      </button>
    `).join("");

    const activeSite = filtered.find(site => site.id === activeSiteId) || filtered[0];
    activeSiteId = activeSite.id;
    list.querySelector(`[data-site-id="${activeSiteId}"]`)?.classList.add("is-active");
    renderDetail(activeSite);
  };

  const selectRegion = region => {
    activeRegion = region;
    activeSiteId = "";
    search.value = "";
    history.replaceState(null, "", region === "All coverage" ? "#all" : `#${slug(region)}`);
    render();
  };

  map.addEventListener("click", event => {
    const zone = event.target.closest(".coverage-zone");
    if (zone) selectRegion(zone.dataset.region);
  });

  list.addEventListener("click", event => {
    const button = event.target.closest("[data-site-id]");
    if (!button) return;
    activeSiteId = button.dataset.siteId;
    list.querySelectorAll(".coverage-site-button").forEach(item => item.classList.toggle("is-active", item === button));
    renderDetail(sites.find(site => site.id === activeSiteId));
  });

  search.addEventListener("input", () => {
    activeRegion = "All coverage";
    activeSiteId = "";
    render();
  });

  reset.addEventListener("click", () => selectRegion("All coverage"));

  const hash = location.hash.slice(1);
  const hashRegion = zones.find(zone => slug(zone.dataset.region) === hash)?.dataset.region;
  if (hashRegion) activeRegion = hashRegion;
  if (hash === "all") activeRegion = "All coverage";
  render();
})();
