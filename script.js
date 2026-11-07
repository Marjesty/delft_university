/**
 * Delft University of Technology (TU Delft) Admissions & Academic Portal
 * Interactive Application & Exploration Script
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Mobile Menu Toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const primaryNav = document.querySelector("#primary-nav");

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener("click", () => {
      const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isExpanded));
      primaryNav.classList.toggle("is-open", !isExpanded);
    });

    // Close menu when clicking any nav link
    primaryNav.querySelectorAll(".nav-link, .nav-btn").forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.setAttribute("aria-expanded", "false");
        primaryNav.classList.remove("is-open");
      });
    });
  }

  // 2. Programmes Live Search & Level Filters
  const searchInput = document.querySelector("#programme-search");
  const filterPills = document.querySelectorAll(".pill-btn");
  const progCards = document.querySelectorAll(".prog-card");
  const emptyState = document.querySelector("#catalog-empty");

  let activeLevel = "all";

  function filterProgrammes() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    let visibleCount = 0;

    progCards.forEach((card) => {
      const cardLevel = card.getAttribute("data-level");
      const cardSearchData = (card.getAttribute("data-search") || "") + " " + card.textContent.toLowerCase();

      const matchesLevel = activeLevel === "all" || cardLevel === activeLevel;
      const matchesSearch = query === "" || cardSearchData.includes(query);

      const isVisible = matchesLevel && matchesSearch;
      card.hidden = !isVisible;

      if (isVisible) {
        visibleCount++;
      }
    });

    if (emptyState) {
      emptyState.hidden = visibleCount > 0;
    }
  }

  if (filterPills.length > 0) {
    filterPills.forEach((pill) => {
      pill.addEventListener("click", () => {
        filterPills.forEach((p) => {
          p.classList.remove("is-active");
          p.setAttribute("aria-selected", "false");
        });
        pill.classList.add("is-active");
        pill.setAttribute("aria-selected", "true");
        activeLevel = pill.getAttribute("data-level") || "all";
        filterProgrammes();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", filterProgrammes);
  }

  // 3. Auto-Select Programme into Application Form
  const applyTriggers = document.querySelectorAll(".apply-trigger-btn");
  const appProgrammeInput = document.querySelector("#app-programme");
  const appFacultySelect = document.querySelector("#app-faculty");
  const appLevelSelect = document.querySelector("#app-level");

  applyTriggers.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const progName = btn.getAttribute("data-prog");
      const facultyName = btn.getAttribute("data-faculty");
      const parentCard = btn.closest(".prog-card");
      const cardLevel = parentCard ? parentCard.getAttribute("data-level") : "";

      if (appProgrammeInput && progName) {
        appProgrammeInput.value = progName;
      }

      if (appLevelSelect && cardLevel) {
        if (cardLevel === "bsc") appLevelSelect.value = "Bachelor's Degree (BSc)";
        if (cardLevel === "msc") appLevelSelect.value = "Master of Science (MSc)";
        if (cardLevel === "phd") appLevelSelect.value = "Doctoral Degree (PhD)";
      }

      if (appFacultySelect && facultyName) {
        // Find closest match in faculty dropdown
        for (let i = 0; i < appFacultySelect.options.length; i++) {
          if (appFacultySelect.options[i].text.toLowerCase().includes(facultyName.toLowerCase().replace("faculty of ", ""))) {
            appFacultySelect.selectedIndex = i;
            break;
          }
        }
      }

      // Smooth scroll to application form
      const applySection = document.querySelector("#apply");
      if (applySection) {
        applySection.scrollIntoView({ behavior: "smooth" });
        if (appProgrammeInput) {
          setTimeout(() => {
            appProgrammeInput.focus();
            appProgrammeInput.classList.add("highlight-field");
            setTimeout(() => appProgrammeInput.classList.remove("highlight-field"), 1500);
          }, 600);
        }
      }
    });
  });

  // 4. Interactive Tuition & Cost Calculator
  const calcNat = document.querySelector("#calc-nationality");
  const calcLevel = document.querySelector("#calc-level");
  const calcHousing = document.querySelector("#calc-housing");

  const tuitionDisplay = document.querySelector("#tuition-display");
  const tuitionSub = document.querySelector("#tuition-sub");
  const livingDisplay = document.querySelector("#living-display");
  const scholarshipDisplay = document.querySelector("#scholarship-display");
  const scholarshipDesc = document.querySelector("#scholarship-desc");

  function calculateCosts() {
    if (!calcNat || !calcLevel || !calcHousing) return;

    const nat = calcNat.value;
    const level = calcLevel.value;
    const housing = calcHousing.value;

    let tuitionText = "€21,500 / year";
    let tuitionSubText = "Official institutional tuition fee for non-EU Master's";
    let livingText = housing === "student" ? "€12,600 / year" : "€16,200 / year";
    let scholTitle = "Justus & Louise van Effen Excellence Scholarship";
    let scholDetails = "Full tuition fee coverage + living expense allowance for outstanding international students. Highly competitive merit award.";

    if (level === "phd") {
      tuitionText = "€0 (Salaried Position)";
      tuitionSubText = "Fully funded university employee with monthly gross salary (€2,900 – €3,600/mo) under Dutch University CAO";
      scholTitle = "University Research Fellowship";
      scholDetails = "PhD candidates at TU Delft are paid university researchers with standard employment contracts, pension contributions, and holiday allowance.";
    } else if (nat === "eu") {
      tuitionText = "€2,530 / year";
      tuitionSubText = "Statutory EU/EEA tuition fee rate set by the Dutch Ministry of Education";
      scholTitle = "Erasmus+ & DUO Dutch Study Finance";
      scholDetails = "EU students under 30 who work at least 32 hours/month in the Netherlands may also qualify for Dutch student finance (basisbeurs & free public transit card).";
    } else {
      // Non-EU BSc vs MSc
      if (level === "bsc") {
        tuitionText = "€16,500 / year";
        tuitionSubText = "Annual institutional tuition fee for non-EU Bachelor of Science programmes";
        scholTitle = "NL Scholarship (Holland Scholarship)";
        scholDetails = "€5,000 grant funded by the Dutch Ministry of Education for first-year non-EEA students.";
      } else {
        tuitionText = "€21,500 / year";
        tuitionSubText = "Annual institutional tuition fee for non-EU Master of Science programmes";
        scholTitle = "Justus & Louise van Effen Excellence Scholarship";
        scholDetails = "Full tuition fee waiver + contribution towards living expenses for top-performing international students. Deadline: December 1.";
      }
    }

    if (tuitionDisplay) tuitionDisplay.textContent = tuitionText;
    if (tuitionSub) tuitionSub.textContent = tuitionSubText;
    if (livingDisplay) livingDisplay.textContent = livingText;
    if (scholarshipDisplay) scholarshipDisplay.textContent = scholTitle;
    if (scholarshipDesc) scholarshipDesc.textContent = scholDetails;
  }

  [calcNat, calcLevel, calcHousing].forEach((el) => {
    if (el) el.addEventListener("change", calculateCosts);
  });
  calculateCosts();

  // 5. Admissions Application Form Handling
  const form = document.querySelector("#application-form");
  const formStatus = document.querySelector("#form-status");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Reset field errors
      document.querySelectorAll(".field-error").forEach((el) => (el.textContent = ""));

      const nameInput = document.querySelector("#app-name");
      const emailInput = document.querySelector("#app-email");
      const phoneInput = document.querySelector("#app-phone");
      const countryInput = document.querySelector("#app-country");
      const consentInput = document.querySelector("#app-consent");

      let hasError = false;

      if (!nameInput.value.trim()) {
        document.querySelector("#err-name").textContent = "Please provide your full legal name.";
        hasError = true;
      }
      if (!emailInput.value.trim() || !emailInput.checkValidity()) {
        document.querySelector("#err-email").textContent = "Please provide a valid email address.";
        hasError = true;
      }
      if (!phoneInput.value.trim()) {
        document.querySelector("#err-phone").textContent = "Please include your international telephone number.";
        hasError = true;
      }
      if (!countryInput.value.trim()) {
        document.querySelector("#err-country").textContent = "Please specify your country of citizenship.";
        hasError = true;
      }
      if (!consentInput.checked) {
        document.querySelector("#err-consent").textContent = "Please agree to the admissions data transmission consent.";
        hasError = true;
      }

      if (hasError) {
        return;
      }

      const formData = new FormData(form);
      const refId = "TUD-" + new Date().getFullYear() + "-" + Math.random().toString(36).substring(2, 7).toUpperCase();

      const dossierLines = [
        "==================================================",
        "   DELFT UNIVERSITY OF TECHNOLOGY (TU DELFT)",
        "   OFFICIAL ADMISSIONS PRE-EVALUATION DOSSIER",
        "==================================================",
        `Reference ID: ${refId}`,
        `Submission Date: ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`,
        "",
        "--- APPLICANT PROFILE ---",
        `Full Legal Name: ${formData.get("name")}`,
        `Email Address: ${formData.get("email")}`,
        `Phone Number: ${formData.get("phone")}`,
        `Country of Citizenship: ${formData.get("country")}`,
        "",
        "--- ACADEMIC PROGRAMME SELECTION ---",
        `Study Level: ${formData.get("level")}`,
        `Intake Period: ${formData.get("intake")}`,
        `Target Faculty: ${formData.get("faculty")}`,
        `Programme of Choice: ${formData.get("programme")}`,
        "",
        "--- ACADEMIC BACKGROUND & PROFICIENCY ---",
        `Previous Degree & Institution: ${formData.get("previous_degree")}`,
        `Cumulative GPA / Honors: ${formData.get("gpa")}`,
        `English Language Proficiency: ${formData.get("english")}`,
        `Housing Assistance: ${formData.get("housing_interest")}`,
        "",
        "--- STATEMENT / QUESTIONS FOR ADMISSIONS ---",
        formData.get("statement") ? formData.get("statement").trim() : "None provided.",
        "",
        "--------------------------------------------------",
        "Admissions Office Contact: somuahvictor16@gmail.com",
        "Central University: contactcentre-esa@tudelft.nl",
        "Campus: Mekelweg 5, 2628 CD Delft, The Netherlands",
        "=================================================="
      ];

      const dossierText = dossierLines.join("\n");

      // Prepare mailto link
      const emailSubject = `[TU Delft Admissions] ${refId} - ${formData.get("programme")} - ${formData.get("name")}`;
      const mailtoUrl = `mailto:somuahvictor16@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(dossierText)}`;

      // Display on-page confirmation and copyable dossier
      if (formStatus) {
        formStatus.hidden = false;
        formStatus.className = "form-status-box status-success";
        formStatus.innerHTML = `
          <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
            <span style="font-size:20px;">🎉</span>
            <strong style="font-size:16px;">Admissions Dossier Prepared Successfully!</strong>
          </div>
          <p>Your application reference code is <strong>${refId}</strong>. An email draft to the admissions office (<a href="mailto:somuahvictor16@gmail.com" style="color:var(--navy); font-weight:700;">somuahvictor16@gmail.com</a>) has been initialized.</p>
          <p style="margin-top:6px; font-size:12.5px;">Below is your pre-formatted academic dossier. You may copy it for your records or attach it when registering in Studielink and Osiaan:</p>
          
          <pre class="dossier-preview-card" id="dossier-text">${dossierText}</pre>
          
          <div style="display:flex; gap:12px; margin-top:12px; flex-wrap:wrap;">
            <button type="button" class="copy-dossier-btn" id="copy-btn">📋 Copy Dossier to Clipboard</button>
            <a href="${mailtoUrl}" class="copy-dossier-btn" style="background:var(--primary); text-decoration:none; display:inline-block;">✉️ Open in Email App Again</a>
          </div>
        `;

        const copyBtn = document.querySelector("#copy-btn");
        if (copyBtn) {
          copyBtn.addEventListener("click", () => {
            navigator.clipboard.writeText(dossierText).then(() => {
              copyBtn.textContent = "✅ Dossier Copied!";
              setTimeout(() => (copyBtn.textContent = "📋 Copy Dossier to Clipboard"), 3000);
            });
          });
        }

        formStatus.scrollIntoView({ behavior: "smooth" });
      }

      // Launch email client
      window.location.href = mailtoUrl;
    });
  }

  // 6. Dynamic Year in Footer
  const yearEl = document.querySelector("#current-year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
});
