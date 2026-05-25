const triStates = ["Unknown", "Yes", "No"];
const lvoSites = ["Unknown", "None", "ICA", "M1", "M2", "M3", "ACA", "PCA", "Basilar", "Vertebral", "Other"];
const acuteDecisions = ["Pending more data", "Give TNK", "Give alteplase", "No IVT", "EVT now", "Transfer for EVT", "No EVT"];
const secondaryPlans = [
  "Pending mechanism/workup",
  "Aspirin/SAPT",
  "DAPT aspirin+clopidogrel",
  "DAPT aspirin+ticagrelor",
  "Oral anticoagulation",
  "Antiplatelet or anticoagulation for dissection",
  "Defer pending 24h imaging",
  "Other"
];

const storageKey = "stroke-code-decision-registry-v1";
const fields = [
  "caseID", "patientID", "fellow", "lastKnownWell", "arrival", "decisionTime", "age", "weightKg",
  "nihss", "prestrokeMRS", "disablingDeficit", "hemorrhage", "ivtContraindication", "bpControlledForIVT",
  "glucoseMgDL", "receivedIVT", "lvoSite", "aspects", "pcAspects", "massEffect", "wakeupUnknownOnset",
  "advancedImagingMismatch", "salvageableTissue", "noncardioembolic", "highRiskTIA", "afOrCardioembolic",
  "cervicalDissection", "infarctPattern", "largeArteryStenosis", "highRiskCardiacSource", "corticalInfarct",
  "multipleTerritories", "lacunarSyndrome", "smallDeepInfarct", "otherDeterminedCause",
  "otherCauseType", "workupComplete", "finalIVTDecision", "finalEVTDecision", "finalSecondaryPlan",
  "comments"
];

let registry = loadRegistry();
let currentCase = blankCase();

function $(id) {
  return document.getElementById(id);
}

function fillSelect(id, values) {
  const select = $(id);
  select.innerHTML = values.map((value) => `<option value="${escapeHTML(value)}">${escapeHTML(value)}</option>`).join("");
}

function initialize() {
  [
    "disablingDeficit", "hemorrhage", "ivtContraindication", "bpControlledForIVT", "receivedIVT",
    "massEffect", "wakeupUnknownOnset", "advancedImagingMismatch", "salvageableTissue",
    "noncardioembolic", "highRiskTIA", "afOrCardioembolic", "cervicalDissection",
    "largeArteryStenosis", "highRiskCardiacSource", "corticalInfarct", "multipleTerritories",
    "lacunarSyndrome", "smallDeepInfarct", "otherDeterminedCause", "workupComplete"
  ].forEach((id) => fillSelect(id, triStates));
  fillSelect("lvoSite", lvoSites);
  fillSelect("finalIVTDecision", acuteDecisions);
  fillSelect("finalEVTDecision", acuteDecisions);
  fillSelect("finalSecondaryPlan", secondaryPlans);

  fields.forEach((id) => {
    $(id).addEventListener("input", () => {
      currentCase = readForm();
      renderAssessment();
    });
    $(id).addEventListener("change", () => {
      currentCase = readForm();
      renderAssessment();
    });
  });

  $("newCaseButton").addEventListener("click", () => {
    currentCase = blankCase();
    writeForm(currentCase);
    renderAssessment();
    showToast("New case ready");
  });

  $("saveCaseButton").addEventListener("click", () => {
    currentCase = readForm();
    saveCurrentCase();
  });

  $("exportCSVButton").addEventListener("click", exportCSV);
  $("copyNoteButton").addEventListener("click", copyFellowNote);

  writeForm(currentCase);
  renderAssessment();
  renderRegistry();
}

function blankCase() {
  const now = new Date();
  const lkw = new Date(now.getTime() - 60 * 60 * 1000);
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    savedAt: "",
    caseID: "",
    patientID: "",
    fellow: "",
    lastKnownWell: toLocalInput(lkw),
    arrival: toLocalInput(now),
    decisionTime: toLocalInput(now),
    age: "",
    weightKg: "",
    nihss: "",
    prestrokeMRS: "",
    disablingDeficit: "Unknown",
    hemorrhage: "Unknown",
    ivtContraindication: "Unknown",
    bpControlledForIVT: "Unknown",
    glucoseMgDL: "",
    receivedIVT: "Unknown",
    lvoSite: "Unknown",
    aspects: "",
    pcAspects: "",
    massEffect: "Unknown",
    wakeupUnknownOnset: "No",
    advancedImagingMismatch: "Unknown",
    salvageableTissue: "Unknown",
    noncardioembolic: "Unknown",
    highRiskTIA: "Unknown",
    afOrCardioembolic: "Unknown",
    cervicalDissection: "Unknown",
    largeArteryStenosis: "Unknown",
    highRiskCardiacSource: "Unknown",
    corticalInfarct: "Unknown",
    multipleTerritories: "Unknown",
    lacunarSyndrome: "Unknown",
    smallDeepInfarct: "Unknown",
    otherDeterminedCause: "Unknown",
    otherCauseType: "None",
    workupComplete: "Unknown",
    infarctPattern: "Unknown",
    finalIVTDecision: "Pending more data",
    finalEVTDecision: "Pending more data",
    finalSecondaryPlan: "Pending mechanism/workup",
    comments: ""
  };
}

function readForm() {
  const next = { ...currentCase };
  fields.forEach((id) => {
    next[id] = $(id).value;
  });
  return next;
}

function writeForm(strokeCase) {
  fields.forEach((id) => {
    $(id).value = strokeCase[id] ?? "";
  });
}

function saveCurrentCase() {
  currentCase.savedAt = new Date().toISOString();
  const existingIndex = registry.findIndex((item) => item.id === currentCase.id);
  if (existingIndex >= 0) {
    registry[existingIndex] = { ...currentCase };
  } else {
    registry.unshift({ ...currentCase });
  }
  localStorage.setItem(storageKey, JSON.stringify(registry));
  renderRegistry();
  showToast("Case saved to browser registry");
}

function loadRegistry() {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || "[]");
  } catch {
    return [];
  }
}

function renderAssessment() {
  const c = currentCase;
  const result = evaluate(c);
  $("summaryCase").textContent = c.caseID || "Unsaved case";
  $("hoursFromLKW").textContent = formatNumber(hoursFromLKW(c), 2);
  $("tnkDose").textContent = tnkDose(c) == null ? "--" : `${formatNumber(tnkDose(c), 1)} mg`;

  const cards = [
    ["TNK / IVT", result.ivtStatus, result.ivtRationale, result.ivtTone],
    ["Mechanical Thrombectomy", result.evtStatus, result.evtRationale, result.evtTone],
    ["Early Secondary Prevention", result.secondaryStatus, result.secondaryRationale, result.secondaryTone],
    ["TOAST Etiology", result.etiologyStatus, result.etiologyRationale, result.etiologyTone],
    ["Etiology-Based Secondary Prevention", result.etiologyPreventionStatus, result.etiologyPreventionRationale, result.etiologyPreventionTone]
  ];
  $("decisionCards").innerHTML = cards.map(([title, status, detail, tone]) => `
    <article class="decision-card ${tone}">
      <h3>${escapeHTML(title)}</h3>
      <strong>${escapeHTML(status)}</strong>
      <p>${escapeHTML(detail)}</p>
    </article>
  `).join("");
  $("fellowNote").value = generateFellowNote(c, result);
}

function evaluate(c) {
  const ivt = evaluateIVT(c);
  const evt = evaluateEVT(c);
  const secondary = evaluateSecondary(c);
  const etiology = evaluateEtiology(c);
  const etiologyPrevention = secondaryByEtiology(c, etiology.category);
  return {
    ivtStatus: ivt.status,
    ivtRationale: ivt.rationale,
    ivtTone: ivt.tone,
    evtStatus: evt.status,
    evtRationale: evt.rationale,
    evtTone: evt.tone,
    secondaryStatus: secondary.status,
    secondaryRationale: secondary.rationale,
    secondaryTone: secondary.tone,
    etiologyStatus: etiology.status,
    etiologyRationale: etiology.rationale,
    etiologyTone: etiology.tone,
    etiologyPreventionStatus: etiologyPrevention.status,
    etiologyPreventionRationale: etiologyPrevention.rationale,
    etiologyPreventionTone: etiologyPrevention.tone
  };
}

function evaluateIVT(c) {
  const hours = hoursFromLKW(c);
  if (!hasNumber(c.nihss)) {
    return result("Need missing acute data", "Enter NIHSS and clinical eligibility data. Weight is only needed to calculate TNK dose.", "warn");
  }
  if (c.hemorrhage === "Yes") {
    return result("No IVT", "Hemorrhage on CT/MRI is flagged.", "stop");
  }
  if (c.ivtContraindication === "Yes") {
    return result("No IVT", "Contraindication is flagged; review full exclusion checklist and local protocol.", "stop");
  }
  if (c.bpControlledForIVT !== "Yes") {
    return result("Optimize BP / eligibility", "BP must be controlled for IV thrombolysis before treatment.", "warn");
  }
  if (hours <= 4.5 && c.disablingDeficit === "Yes") {
    const doseText = tnkDose(c) == null
      ? "Enter weight to calculate TNK dose."
      : `Calculated dose: ${formatNumber(tnkDose(c), 1)} mg.`;
    return result(
      "IVT recommended if otherwise eligible",
      `TNK 0.25 mg/kg max 25 mg is guideline-supported. ${doseText}`,
      "good"
    );
  }
  if (hours <= 4.5 && c.disablingDeficit !== "Yes") {
    return result("No routine IVT for non-disabling deficit", "Trials have not shown benefit for non-disabling deficits; consider DAPT if eligible.", "warn");
  }
  if (hours > 4.5 && hours <= 9 && (c.wakeupUnknownOnset === "Yes" || c.advancedImagingMismatch === "Yes") && c.salvageableTissue === "Yes") {
    return result("Extended-window IVT may be reasonable", "Advanced imaging selection supports consideration of IVT in selected 4.5-9h or wake-up stroke patients.", "warn");
  }
  return result("No routine IVT by listed criteria", "No embedded thrombolysis pathway is met. Final decision should document reason.", "stop");
}

function evaluateEVT(c) {
  const hours = hoursFromLKW(c);
  const nihss = numberOrNull(c.nihss);
  const mrs = numberOrNull(c.prestrokeMRS);
  const aspects = numberOrNull(c.aspects);
  const pcAspects = numberOrNull(c.pcAspects);
  const age = numberOrNull(c.age);
  if (nihss == null) {
    return result("Need NIHSS", "NIHSS is required for the embedded EVT pathways.", "warn");
  }
  if (c.lvoSite === "Basilar") {
    if (hours <= 24 && nihss >= 10 && mrs != null && mrs <= 1 && pcAspects != null && pcAspects >= 6) {
      return result("EVT recommended", "Basilar occlusion within 24h, mRS 0-1, NIHSS >=10, PC-ASPECTS >=6.", "good");
    }
    return result("Review posterior criteria", "Basilar pathway needs time, mRS, NIHSS, and PC-ASPECTS confirmation.", "warn");
  }
  if (c.lvoSite === "ICA" || c.lvoSite === "M1") {
    if (hours <= 6 && nihss >= 6 && mrs != null && mrs <= 1 && aspects != null && aspects >= 3 && aspects <= 10) {
      return result("EVT recommended", "Anterior ICA/M1 LVO <=6h, NIHSS >=6, mRS 0-1, ASPECTS 3-10.", "good");
    }
    if (age != null && age < 80 && hours <= 6 && nihss >= 6 && mrs != null && mrs <= 1 && aspects != null && aspects <= 2 && c.massEffect !== "Yes") {
      return result("EVT reasonable in selected patient", "Selected age <80 ICA/M1 very-large-core pathway: <=6h, ASPECTS 0-2, no significant mass effect.", "warn");
    }
    if (age != null && age < 80 && hours > 6 && hours <= 24 && nihss >= 6 && mrs != null && mrs <= 1 && aspects != null && aspects >= 3 && aspects <= 5 && c.massEffect !== "Yes") {
      return result("EVT recommended in selected patient", "Selected age <80 ICA/M1 6-24h large-core pathway: ASPECTS 3-5, no significant mass effect.", "good");
    }
    return result("EVT not automatic; review imaging/trial fit", "ICA/M1 LVO is present, but embedded core criteria are incomplete or not met.", "warn");
  }
  if (["M2", "M3", "ACA", "PCA"].includes(c.lvoSite)) {
    return result("Distal/MeVO: individualize", "Routine EVT benefit is not established for the embedded distal/MeVO pathways; discuss case-by-case.", "warn");
  }
  if (c.lvoSite === "None") {
    return result("No EVT indication", "No LVO is entered.", "stop");
  }
  return result("Need vascular imaging review", "Enter CTA/MRA occlusion site and imaging scores.", "info");
}

function evaluateSecondary(c) {
  const nihss = numberOrNull(c.nihss);
  if (c.receivedIVT === "Yes") {
    return result("Defer antiplatelet pending 24h imaging unless compelling indication", "First-24-hour antiplatelet risk after IVT is uncertain.", "warn");
  }
  if (c.cervicalDissection === "Yes") {
    return result("Antiplatelet or anticoagulation for at least 3 months is reasonable", "Individualize based on imaging, thrombus, hemorrhage risk, and local practice.", "info");
  }
  if (c.afOrCardioembolic === "Yes") {
    return result("Consider oral anticoagulation timing by severity/bleeding risk", "Early anticoagulation can be reasonable in carefully selected milder AIS with AF.", "info");
  }
  if (c.noncardioembolic === "Yes" && ((nihss != null && nihss <= 3) || c.highRiskTIA === "Yes")) {
    return result("DAPT aspirin+clopidogrel early, then SAPT, if no IVT and eligible", "Minor noncardioembolic AIS/high-risk TIA pathway; confirm bleeding risk.", "good");
  }
  if (c.noncardioembolic === "Yes") {
    return result("Antiplatelet preferred over oral anticoagulation", "Agent should be individualized by risk factors, cost, tolerance, and efficacy.", "info");
  }
  return result("Mechanism workup pending", "Long-term prevention requires mechanism classification and dedicated secondary prevention guidance.", "warn");
}

function evaluateEtiology(c) {
  const scores = {
    "Large-Artery Atherosclerosis (LAA)": 0,
    "Cardioembolism (CE)": 0,
    "Small-Vessel Occlusion (SVO/Lacunar)": 0,
    "Other Determined Etiology": 0
  };
  const reasons = [];

  switch (c.infarctPattern) {
    case "Cortical infarction":
      scores["Cardioembolism (CE)"] += 2;
      scores["Large-Artery Atherosclerosis (LAA)"] += 2;
      reasons.push("cortical infarction favors embolic/LAA mechanism");
      break;
    case "Borderzone/watershed infarction":
      scores["Large-Artery Atherosclerosis (LAA)"] += 3;
      reasons.push("borderzone/watershed pattern suggests low-flow or artery-to-artery LAA");
      break;
    case "Single small subcortical infarction <=1.5 cm":
      scores["Small-Vessel Occlusion (SVO/Lacunar)"] += 5;
      reasons.push("single small subcortical infarct <=1.5 cm");
      break;
    case "Single large subcortical infarction >1.5 cm":
      scores["Large-Artery Atherosclerosis (LAA)"] += 3;
      scores["Small-Vessel Occlusion (SVO/Lacunar)"] += 1;
      reasons.push("large single subcortical infarct suggests parent-artery plaque/BAD or microatheroma");
      break;
    case "Multiple subcortical infarctions":
      scores["Cardioembolism (CE)"] += 3;
      scores["Other Determined Etiology"] += 2;
      reasons.push("multiple subcortical infarcts raise microemboli/systemic cause concern");
      break;
    case "Mixed cortical-subcortical infarctions":
      scores["Cardioembolism (CE)"] += 3;
      scores["Large-Artery Atherosclerosis (LAA)"] += 2;
      reasons.push("mixed cortical-subcortical pattern favors embolic source or LAA");
      break;
  }

  if (c.largeArteryStenosis === "Yes") {
    scores["Large-Artery Atherosclerosis (LAA)"] += 4;
    reasons.push("relevant >=50% large-artery stenosis");
  }
  if (["ICA", "M1", "Vertebral", "Basilar"].includes(c.lvoSite)) {
    scores["Large-Artery Atherosclerosis (LAA)"] += 1;
  }

  if (c.highRiskCardiacSource === "Yes" || c.afOrCardioembolic === "Yes") {
    scores["Cardioembolism (CE)"] += 4;
    reasons.push("high-risk cardiac source/AF");
  }
  if (c.corticalInfarct === "Yes") {
    scores["Cardioembolism (CE)"] += 1;
    scores["Large-Artery Atherosclerosis (LAA)"] += 1;
  }
  if (c.multipleTerritories === "Yes") {
    scores["Cardioembolism (CE)"] += 2;
    reasons.push("multiple vascular territories");
  }

  if (c.lacunarSyndrome === "Yes") {
    scores["Small-Vessel Occlusion (SVO/Lacunar)"] += 3;
    reasons.push("classic lacunar syndrome");
  }
  if (c.smallDeepInfarct === "Yes") {
    scores["Small-Vessel Occlusion (SVO/Lacunar)"] += 3;
    reasons.push("small deep infarct <1.5 cm");
  }
  if (c.corticalInfarct === "Yes") {
    scores["Small-Vessel Occlusion (SVO/Lacunar)"] -= 2;
  }

  if (c.otherDeterminedCause === "Yes" || c.cervicalDissection === "Yes") {
    scores["Other Determined Etiology"] += 5;
    reasons.push(c.otherCauseType && c.otherCauseType !== "None" ? c.otherCauseType : "other determined cause");
  }

  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topScore = ranked[0][1];
  const closeCompetitors = ranked.filter(([, score]) => score >= 4 && topScore - score <= 1);

  if (topScore <= 0) {
    if (c.workupComplete === "Yes") {
      return { ...result("Cryptogenic / Undetermined: negative evaluation", "No strong TOAST signal entered despite completed work-up.", "warn"), category: "Undetermined" };
    }
    return { ...result("Undetermined: incomplete work-up", "Etiology prediction needs vessel imaging, cardiac evaluation, infarct pattern, and selected labs.", "warn"), category: "Undetermined" };
  }

  if (closeCompetitors.length >= 2) {
    return { ...result(
      "Undetermined: two or more plausible causes",
      `${closeCompetitors.map(([name]) => name).join(" vs ")} are both strongly supported. Key signals: ${reasons.join(", ") || "mixed findings"}.`,
      "warn"
    ), category: "Multiple" };
  }

  const likely = ranked[0][0];
  const confidence = topScore >= 5 ? "High" : topScore >= 3 ? "Moderate" : "Low";
  const workupNote = c.workupComplete === "Yes" ? "Work-up marked complete." : "Work-up not marked complete, so treat as provisional.";
  return { ...result(
    `Most likely: ${likely}`,
    `${confidence} confidence. Key signals: ${reasons.join(", ") || "pattern-based scoring"}. ${workupNote}`,
    confidence === "High" ? "good" : "info"
  ), category: likely };
}

function secondaryByEtiology(c, category) {
  if (c.receivedIVT === "Yes") {
    return result("Acute hold: wait for post-IVT safety step", "After IVT, antithrombotic timing should follow 24h imaging/local protocol before etiology-based prevention is started.", "warn");
  }
  if (category === "Cardioembolism (CE)") {
    return result("Anticoagulation pathway", "For AF/high-risk cardioembolic source, oral anticoagulation is usually recommended if no contraindication; timing depends on infarct size, hemorrhage risk, and procedures. Avoid routine antiplatelet addition unless another indication exists.", "good");
  }
  if (category === "Large-Artery Atherosclerosis (LAA)") {
    const stenosisText = c.largeArteryStenosis === "Yes"
      ? "Evaluate symptomatic extracranial carotid/intracranial stenosis for intensive medical therapy and possible revascularization pathway."
      : "Confirm vessel imaging severity and culprit relationship.";
    return result("Antiplatelet + high-intensity vascular risk reduction", `${stenosisText} Use antiplatelet therapy, high-intensity statin when indicated, BP/DM/smoking management, and short-term DAPT only for selected minor stroke/TIA or severe symptomatic intracranial stenosis scenarios.`, "good");
  }
  if (category === "Small-Vessel Occlusion (SVO/Lacunar)") {
    return result("Single antiplatelet + strict risk factor control", "Lacunar/SVO prevention generally emphasizes antiplatelet therapy, BP control, diabetes management, lipid therapy, smoking cessation, and avoiding long-term DAPT.", "good");
  }
  if (category === "Other Determined Etiology") {
    return result("Cause-specific prevention", "Treat the identified mechanism: dissection may use antiplatelet or anticoagulation for a defined period; vasculitis, APS, malignancy-associated thrombosis, moyamoya, FMD, or RCVS need mechanism-specific specialist management.", "info");
  }
  if (category === "Multiple") {
    return result("Resolve competing mechanisms before committing", "When two or more plausible causes coexist, prevention may need combined prioritization, but routine antiplatelet plus anticoagulation is usually avoided unless a separate indication exists.", "warn");
  }
  return result("Cryptogenic / incomplete work-up pathway", "Complete vascular imaging, telemetry/Holter, echo, and selected labs. For ESUS/noncardioembolic cryptogenic stroke, antiplatelet therapy is generally used rather than empiric anticoagulation unless a specific indication emerges.", "warn");
}

function result(status, rationale, tone) {
  return { status, rationale, tone };
}

function renderRegistry() {
  if (!registry.length) {
    $("registryList").innerHTML = `<div class="registry-empty">No saved cases yet.</div>`;
    return;
  }
  $("registryList").innerHTML = registry.map((item) => {
    const assessment = evaluate(item);
    return `
      <button class="registry-item" type="button" data-id="${escapeHTML(item.id)}">
        <strong>${escapeHTML(item.caseID || "Untitled case")}</strong>
        <span>${escapeHTML(assessment.ivtStatus)} | ${escapeHTML(assessment.evtStatus)}</span>
        <span>Final: ${escapeHTML(item.finalIVTDecision)} / ${escapeHTML(item.finalEVTDecision)}</span>
      </button>
    `;
  }).join("");
  document.querySelectorAll(".registry-item").forEach((button) => {
    button.addEventListener("click", () => {
      const found = registry.find((item) => item.id === button.dataset.id);
      if (!found) return;
      currentCase = { ...found };
      writeForm(currentCase);
      renderAssessment();
      showToast("Loaded saved case");
    });
  });
}

function exportCSV() {
  if (!registry.length) {
    showToast("No cases to export");
    return;
  }
  const header = [
    "Case_ID", "Patient_ID", "Fellow", "Hours_From_LKW", "Age", "Weight_kg", "NIHSS", "Disabling_Deficit",
    "LVO_Site", "Infarct_Pattern", "ASPECTS", "PC_ASPECTS", "TNK_Dose_mg", "Auto_IVT", "Auto_EVT",
    "Auto_Secondary", "Predicted_TOAST", "Etiology_Based_Prevention", "Final_IVT", "Final_EVT",
    "Final_Secondary", "Comments"
  ];
  const rows = registry.map((c) => {
    const assessment = evaluate(c);
    return [
      c.caseID, c.patientID, c.fellow, formatNumber(hoursFromLKW(c), 2), c.age, c.weightKg, c.nihss,
      c.disablingDeficit, c.lvoSite, c.infarctPattern, c.aspects, c.pcAspects, tnkDose(c) == null ? "" : formatNumber(tnkDose(c), 1),
      assessment.ivtStatus, assessment.evtStatus, assessment.secondaryStatus, assessment.etiologyStatus, assessment.etiologyPreventionStatus,
      c.finalIVTDecision, c.finalEVTDecision, c.finalSecondaryPlan, c.comments
    ];
  });
  const csv = [header, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "stroke-code-registry.csv";
  link.click();
  URL.revokeObjectURL(url);
  showToast("CSV exported");
}

async function copyFellowNote() {
  const note = $("fellowNote").value;
  try {
    await navigator.clipboard.writeText(note);
    showToast("Fellow note copied");
  } catch {
    $("fellowNote").select();
    document.execCommand("copy");
    showToast("Fellow note selected/copied");
  }
}

function generateFellowNote(c, assessment) {
  const patientLabel = c.patientID ? `Patient ID/MRN: ${c.patientID}` : "Patient ID/MRN: [not entered]";
  const caseLabel = c.caseID ? `Case ID: ${c.caseID}` : "Case ID: [not entered]";
  const fellow = c.fellow ? c.fellow : "[fellow not entered]";
  const tnkText = tnkDose(c) == null ? "not calculated because weight is not entered" : `${formatNumber(tnkDose(c), 1)} mg`;
  const ageText = c.age || "[not entered]";
  const weightText = c.weightKg ? `${c.weightKg} kg` : "[not entered]";
  const nihssText = c.nihss || "[not entered]";
  const mrsText = c.prestrokeMRS || "[not entered]";
  const lkwText = formatDateTime(c.lastKnownWell);
  const arrivalText = formatDateTime(c.arrival);
  const decisionText = formatDateTime(c.decisionTime);
  const aspectsText = c.aspects || "[not entered]";
  const pcAspectsText = c.pcAspects || "[not entered]";
  const finalIVT = c.finalIVTDecision || "Pending more data";
  const finalEVT = c.finalEVTDecision || "Pending more data";
  const finalSecondary = c.finalSecondaryPlan || "Pending mechanism/workup";
  const comments = c.comments ? c.comments : "None entered.";

  return [
    "VASCULAR NEUROLOGY FELLOW STROKE CODE NOTE",
    "",
    `${caseLabel}`,
    `${patientLabel}`,
    `Fellow: ${fellow}`,
    "",
    "Reason for stroke code:",
    "Acute focal neurologic deficit concerning for acute ischemic stroke. I reviewed the available history, examination, imaging, and acute treatment eligibility at the time of stroke code activation.",
    "",
    "Key times:",
    `- Last known well/onset: ${lkwText}`,
    `- Arrival: ${arrivalText}`,
    `- Treatment decision time: ${decisionText}`,
    `- Time from last known well to decision: ${formatNumber(hoursFromLKW(c), 2)} hours`,
    "",
    "Clinical data:",
    `- Age: ${ageText}`,
    `- Weight: ${weightText}`,
    `- NIHSS: ${nihssText}`,
    `- Pre-stroke mRS: ${mrsText}`,
    `- Disabling deficit: ${c.disablingDeficit}`,
    `- Hemorrhage on CT/MRI: ${c.hemorrhage}`,
    `- IV thrombolysis contraindication flagged: ${c.ivtContraindication}`,
    `- Blood pressure controlled for IV thrombolysis: ${c.bpControlledForIVT}`,
    `- Glucose: ${c.glucoseMgDL || "[not entered]"} mg/dL`,
    "",
    "Imaging / vascular data:",
    `- LVO site: ${c.lvoSite}`,
    `- Infarct pattern: ${c.infarctPattern || "Unknown"}`,
    `- ASPECTS: ${aspectsText}`,
    `- PC-ASPECTS: ${pcAspectsText}`,
    `- Significant mass effect: ${c.massEffect}`,
    `- Wake-up/unknown onset: ${c.wakeupUnknownOnset}`,
    `- Advanced imaging mismatch: ${c.advancedImagingMismatch}`,
    `- Salvageable tissue: ${c.salvageableTissue}`,
    "",
    "Acute reperfusion assessment:",
    `- IVT/TNK decision support: ${assessment.ivtStatus}`,
    `  Rationale: ${assessment.ivtRationale}`,
    `- Calculated tenecteplase dose: ${tnkText}`,
    `- Final IVT decision: ${finalIVT}`,
    `- EVT decision support: ${assessment.evtStatus}`,
    `  Rationale: ${assessment.evtRationale}`,
    `- Final EVT decision: ${finalEVT}`,
    "",
    "Etiology assessment:",
    `- Predicted TOAST etiology: ${assessment.etiologyStatus}`,
    `  Rationale: ${assessment.etiologyRationale}`,
    `- Relevant large-artery stenosis >=50%: ${c.largeArteryStenosis}`,
    `- High-risk cardiac source / AF: ${c.highRiskCardiacSource}; AF/cardioembolic source: ${c.afOrCardioembolic}`,
    `- Cortical infarct/signs: ${c.corticalInfarct}`,
    `- Multiple vascular territories: ${c.multipleTerritories}`,
    `- Lacunar syndrome: ${c.lacunarSyndrome}`,
    `- Small deep infarct <1.5 cm: ${c.smallDeepInfarct}`,
    `- Other determined cause: ${c.otherDeterminedCause}${c.otherCauseType && c.otherCauseType !== "None" ? ` (${c.otherCauseType})` : ""}`,
    `- Work-up complete: ${c.workupComplete}`,
    "",
    "Secondary prevention assessment:",
    `- Early secondary prevention support: ${assessment.secondaryStatus}`,
    `  Rationale: ${assessment.secondaryRationale}`,
    `- Etiology-based prevention recommendation: ${assessment.etiologyPreventionStatus}`,
    `  Rationale: ${assessment.etiologyPreventionRationale}`,
    `- Final secondary prevention plan: ${finalSecondary}`,
    "",
    "Plan / comments:",
    comments,
    "",
    "Note: This decision support is based on entered data and guideline-derived logic. Final management should follow bedside clinical judgment, full contraindication review, imaging review, local stroke protocol, and patient/surrogate discussion when feasible."
  ].join("\n");
}

function formatDateTime(value) {
  if (!value) return "[not entered]";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "[not entered]";
  return date.toLocaleString([], {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function hoursFromLKW(c) {
  const lkw = new Date(c.lastKnownWell);
  const decision = new Date(c.decisionTime);
  if (Number.isNaN(lkw.getTime()) || Number.isNaN(decision.getTime())) return 0;
  return Math.max(0, (decision - lkw) / 36e5);
}

function tnkDose(c) {
  const weight = numberOrNull(c.weightKg);
  if (weight == null) return null;
  return Math.min(weight * 0.25, 25);
}

function numberOrNull(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && value !== "" ? parsed : null;
}

function hasNumber(value) {
  return numberOrNull(value) != null;
}

function toLocalInput(date) {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function formatNumber(value, digits) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "--";
  return number.toFixed(digits);
}

function csvEscape(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

let toastTimer;
function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

initialize();
