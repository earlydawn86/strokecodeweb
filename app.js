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

const nihssItems = [
  {
    id: "nihss1a",
    title: "1a. Level of Consciousness",
    prompt: "Observe alertness. If full evaluation is blocked by tube/language/trauma, still choose the best response. Score 3 only for no movement except reflexive posturing to noxious stimulation.",
    options: [["0", "0 Alert; keenly responsive"], ["1", "1 Not alert, arousable by minor stimulation"], ["2", "2 Repeated/strong/painful stimulation needed"], ["3", "3 Reflex/autonomic response only or unresponsive"]]
  },
  {
    id: "nihss1b",
    title: "1b. LOC Questions",
    prompt: "Ask month and age. No partial credit for close answers. Initial answer only; do not cue.",
    options: [["0", "0 Both correct"], ["1", "1 One correct"], ["2", "2 Neither correct"]]
  },
  {
    id: "nihss1c",
    title: "1c. LOC Commands",
    prompt: "Ask patient to open/close eyes and grip/release nonparetic hand. Substitute one-step command if needed. Score first attempt.",
    options: [["0", "0 Both tasks correct"], ["1", "1 One task correct"], ["2", "2 Neither task correct"]]
  },
  {
    id: "nihss2",
    title: "2. Best Gaze",
    prompt: "Test horizontal eye movements. Use voluntary or reflexive movements; calorics not done.",
    options: [["0", "0 Normal"], ["1", "1 Partial gaze palsy"], ["2", "2 Forced deviation or total gaze paresis"]]
  },
  {
    id: "nihss3",
    title: "3. Visual Fields",
    prompt: "Test upper/lower quadrants by confrontation, finger counting, or threat. Perform double simultaneous stimulation.",
    options: [["0", "0 No visual loss"], ["1", "1 Partial hemianopia"], ["2", "2 Complete hemianopia"], ["3", "3 Bilateral hemianopia/blind"]]
  },
  {
    id: "nihss4",
    title: "4. Facial Palsy",
    prompt: "Ask patient to show teeth, raise eyebrows, and close eyes. Use grimace to noxious stimulus if poorly responsive.",
    options: [["0", "0 Normal symmetrical movement"], ["1", "1 Minor paralysis"], ["2", "2 Partial lower facial paralysis"], ["3", "3 Complete unilateral/bilateral paralysis"]]
  },
  {
    id: "nihss5a",
    title: "5a. Motor Arm - Left",
    prompt: "Arm palms down 90 degrees sitting or 45 degrees supine for 10 seconds. Test nonparetic side first when possible.",
    options: [["0", "0 No drift for 10 seconds"], ["1", "1 Drift, does not hit bed/support"], ["2", "2 Some effort against gravity"], ["3", "3 No effort against gravity"], ["4", "4 No movement"], ["0", "UN amputation/joint fusion"]]
  },
  {
    id: "nihss5b",
    title: "5b. Motor Arm - Right",
    prompt: "Arm palms down 90 degrees sitting or 45 degrees supine for 10 seconds. Score drift if arm falls before 10 seconds.",
    options: [["0", "0 No drift for 10 seconds"], ["1", "1 Drift, does not hit bed/support"], ["2", "2 Some effort against gravity"], ["3", "3 No effort against gravity"], ["4", "4 No movement"], ["0", "UN amputation/joint fusion"]]
  },
  {
    id: "nihss6a",
    title: "6a. Motor Leg - Left",
    prompt: "Leg at 30 degrees supine for 5 seconds. Score drift if leg falls before 5 seconds.",
    options: [["0", "0 No drift for 5 seconds"], ["1", "1 Drift, does not hit bed"], ["2", "2 Some effort against gravity"], ["3", "3 No effort against gravity"], ["4", "4 No movement"], ["0", "UN amputation/joint fusion"]]
  },
  {
    id: "nihss6b",
    title: "6b. Motor Leg - Right",
    prompt: "Leg at 30 degrees supine for 5 seconds. Test each limb in turn.",
    options: [["0", "0 No drift for 5 seconds"], ["1", "1 Drift, does not hit bed"], ["2", "2 Some effort against gravity"], ["3", "3 No effort against gravity"], ["4", "4 No movement"], ["0", "UN amputation/joint fusion"]]
  },
  {
    id: "nihss7",
    title: "7. Limb Ataxia",
    prompt: "Finger-nose-finger and heel-shin with eyes open. Score ataxia only if out of proportion to weakness.",
    options: [["0", "0 Absent"], ["1", "1 Present in one limb"], ["2", "2 Present in two limbs"], ["0", "UN amputation/joint fusion"]]
  },
  {
    id: "nihss8",
    title: "8. Sensory",
    prompt: "Pinprick or noxious stimulus. Score only sensory loss attributed to stroke; test face, arms, legs, trunk as needed.",
    options: [["0", "0 Normal"], ["1", "1 Mild-to-moderate sensory loss"], ["2", "2 Severe or total sensory loss"]]
  },
  {
    id: "nihss9",
    title: "9. Best Language",
    prompt: "Ask patient to describe picture, name items, and read sentences. Judge comprehension from the whole exam.",
    options: [["0", "0 No aphasia"], ["1", "1 Mild-to-moderate aphasia"], ["2", "2 Severe aphasia"], ["3", "3 Mute/global aphasia/no commands"]]
  },
  {
    id: "nihss10",
    title: "10. Dysarthria",
    prompt: "Obtain speech sample by reading/repeating words or spontaneous speech if aphasic. Do not tell patient why tested.",
    options: [["0", "0 Normal"], ["1", "1 Mild-to-moderate dysarthria"], ["2", "2 Severe dysarthria/anarthric"], ["0", "UN intubated/physical barrier"]]
  },
  {
    id: "nihss11",
    title: "11. Extinction and Inattention",
    prompt: "Use prior testing plus double simultaneous stimulation. Visual, tactile, auditory, spatial, or personal neglect counts.",
    options: [["0", "0 No abnormality"], ["1", "1 Inattention/extinction in one modality"], ["2", "2 Profound hemi-inattention or >1 modality"]]
  }
];

const checklistGroups = {
  ivtIndications: [
    { id: "disablingDeficit45", label: "Disabling AIS deficit within 4.5 hours", note: "Treat rapidly if otherwise eligible; NIHSS can be low if deficit is disabling." },
    { id: "wakeUpMismatch", label: "Wake-up/unknown onset with DWI-FLAIR or perfusion mismatch", note: "Supports selected extended-window thrombolysis." },
    { id: "salvageablePenumbra", label: "4.5-9 hours with automated perfusion-defined salvageable penumbra", note: "Use advanced imaging selection and local protocol." },
    { id: "noHemorrhageImaging", label: "Initial CT/MRI excludes intracranial hemorrhage", note: "Required before IVT." },
    { id: "bpTreatable", label: "BP is controlled or treatable to IVT threshold", note: "Document treatment if BP required lowering." }
  ],
  ivtContra: [
    { id: "ich", label: "Intracranial hemorrhage on CT/MRI", level: "hard", note: "Do not give IV thrombolysis." },
    { id: "nonDisabling", label: "Non-disabling symptoms", level: "caution", note: "IVT benefit not established; DAPT may be preferred if eligible." },
    { id: "bpUncontrolled", label: "Persistent BP above IVT threshold despite treatment", level: "hard", note: "Optimize BP before IVT." },
    { id: "activeBleeding", label: "Active internal bleeding or recent serious bleeding", level: "hard", note: "Requires fellow/attending review." },
    { id: "plateletsLow", label: "Platelets <100,000/mm3", level: "hard", note: "If known before treatment." },
    { id: "inrHigh", label: "INR >1.7 or PT/aPTT significantly elevated", level: "hard", note: "If known or anticoagulant exposure suspected." },
    { id: "doacRecent", label: "Recent DOAC use without reassuring labs/reversal pathway", level: "hard", note: "Follow local anticoagulant protocol." },
    { id: "recentIntracranialSurgery", label: "Recent intracranial/spinal surgery or significant head trauma", level: "hard", note: "High hemorrhage risk." },
    { id: "recentMajorSurgery", label: "Recent major surgery or noncompressible arterial puncture", level: "caution", note: "Relative risk-benefit review." },
    { id: "suspectedEndocarditis", label: "Suspected infective endocarditis", level: "hard", note: "High hemorrhagic complication concern." },
    { id: "aorticDissection", label: "Suspected aortic dissection", level: "hard", note: "Do not give IVT until excluded." },
    { id: "glucoseMimic", label: "Persistent stroke mimic concern such as severe hypoglycemia", level: "caution", note: "Correct glucose/mimic when clinically indicated." }
  ],
  evtIndications: [
    { id: "anteriorLVO6h", label: "Anterior ICA/M1 LVO within 6 hours", note: "NIHSS >=6, mRS 0-1, ASPECTS 3-10 supports EVT." },
    { id: "largeCoreSelected", label: "Selected ICA/M1 large-core pathway", note: "Age <80, ASPECTS 3-5 at 6-24h or ASPECTS 0-2 <=6h, no significant mass effect." },
    { id: "basilar24h", label: "Basilar occlusion within 24 hours", note: "mRS 0-1, NIHSS >=10, PC-ASPECTS >=6 supports EVT." },
    { id: "lvoConfirmed", label: "CTA/MRA/angiography confirms treatable LVO", note: "Activate neurointerventional pathway." },
    { id: "ivTNoDelay", label: "IVT candidate; EVT evaluation should not delay IVT", note: "Bridge when eligible and indicated." }
  ],
  evtContra: [
    { id: "noTreatableLVO", label: "No treatable LVO identified", level: "hard", note: "EVT not indicated without target occlusion." },
    { id: "intracranialHemorrhage", label: "Intracranial hemorrhage or alternative diagnosis", level: "hard", note: "Reassess pathway." },
    { id: "severeMassEffect", label: "Significant mass effect/herniation concern", level: "hard", note: "Large-core selected pathways require no significant mass effect." },
    { id: "veryPoorBaseline", label: "Severe pre-stroke disability or goals of care inconsistent with EVT", level: "caution", note: "Individualized risk-benefit discussion." },
    { id: "noSalvageableTissue", label: "No salvageable tissue / completed infarct by local imaging review", level: "caution", note: "Review with neurointerventional team." },
    { id: "uncontrolledMedicalInstability", label: "Uncontrolled medical instability prohibiting procedure", level: "caution", note: "Airway/hemodynamic stabilization may be needed." },
    { id: "accessImpossible", label: "Vascular access/anatomy prohibitive", level: "caution", note: "Neurointerventional assessment required." },
    { id: "outsideWindowNoSelection", label: "Outside guideline window without favorable imaging selection", level: "hard", note: "Document reason if proceeding." },
    { id: "distalMevoRoutine", label: "Distal/MeVO case without individualized benefit rationale", level: "caution", note: "Routine EVT benefit not established in embedded logic." }
  ]
};

const storageKey = "stroke-code-decision-registry-v1";
const fields = [
  "caseID", "age", "sex", "patientID", "fellow", "lastKnownWell", "arrival", "decisionTime",
  "bpSystolic", "bpDiastolic", "glucoseMgDL", "prestrokeMRS", "weightKg", "nihss",
  "pastMedicalHistory", "medications", "disablingDeficit", "hemorrhage", "ivtContraindication", "bpControlledForIVT",
  "receivedIVT", "lvoSite", "aspects", "pcAspects", "massEffect", "wakeupUnknownOnset",
  "advancedImagingMismatch", "salvageableTissue", "noncardioembolic", "highRiskTIA", "afOrCardioembolic",
  "cervicalDissection", "infarctPattern", "largeArteryStenosis", "highRiskCardiacSource", "corticalInfarct",
  "multipleTerritories", "lacunarSyndrome", "smallDeepInfarct", "otherDeterminedCause",
  "otherCauseType", "workupComplete", "tiaClinicalFeature", "tiaDuration", "tiaDiabetes",
  "finalIVTDecision", "finalEVTDecision", "finalSecondaryPlan", "comments"
];
const checklistFieldNames = Object.keys(checklistGroups);

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
    "lacunarSyndrome", "smallDeepInfarct", "otherDeterminedCause", "workupComplete", "tiaDiabetes"
  ].forEach((id) => fillSelect(id, triStates));
  fillSelect("lvoSite", lvoSites);
  fillSelect("finalIVTDecision", acuteDecisions);
  fillSelect("finalEVTDecision", acuteDecisions);
  fillSelect("finalSecondaryPlan", secondaryPlans);
  renderNIHSS();
  renderChecklists();

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

  document.querySelectorAll("[data-check-group]").forEach((box) => {
    box.addEventListener("change", () => {
      currentCase = readForm();
      renderAssessment();
    });
  });

  document.querySelectorAll("[data-nihss-item]").forEach((select) => {
    select.addEventListener("change", () => {
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
    sex: "Unknown",
    patientID: "",
    fellow: "",
    lastKnownWell: toLocalInput(lkw),
    arrival: toLocalInput(now),
    decisionTime: toLocalInput(now),
    age: "",
    bpSystolic: "",
    bpDiastolic: "",
    weightKg: "",
    nihss: "",
    nihssItems: Object.fromEntries(nihssItems.map((item) => [item.id, "0"])),
    prestrokeMRS: "",
    disablingDeficit: "Unknown",
    hemorrhage: "Unknown",
    ivtContraindication: "Unknown",
    bpControlledForIVT: "Unknown",
    glucoseMgDL: "",
    pastMedicalHistory: "",
    medications: "",
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
    tiaClinicalFeature: "None/other",
    tiaDuration: "<10 minutes",
    tiaDiabetes: "Unknown",
    finalIVTDecision: "Pending more data",
    finalEVTDecision: "Pending more data",
    finalSecondaryPlan: "Pending mechanism/workup",
    comments: "",
    ivtIndications: [],
    ivtContra: [],
    evtIndications: [],
    evtContra: []
  };
}

function renderChecklists() {
  renderChecklist("ivtIndicationChecklist", "ivtIndications");
  renderChecklist("ivtContraChecklist", "ivtContra");
  renderChecklist("evtIndicationChecklist", "evtIndications");
  renderChecklist("evtContraChecklist", "evtContra");
}

function renderNIHSS() {
  $("nihssItems").innerHTML = nihssItems.map((item) => `
    <section class="score-item">
      <div>
        <h3>${escapeHTML(item.title)}</h3>
        <p>${escapeHTML(item.prompt)}</p>
      </div>
      <label>
        Score
        <select data-nihss-item="${escapeHTML(item.id)}">
          ${item.options.map(([value, label]) => `<option value="${escapeHTML(value)}">${escapeHTML(label)}</option>`).join("")}
        </select>
      </label>
    </section>
  `).join("");
}

function renderChecklist(containerID, groupName) {
  $(containerID).innerHTML = checklistGroups[groupName].map((item) => `
    <label class="check-item">
      <input type="checkbox" data-check-group="${groupName}" value="${escapeHTML(item.id)}" />
      <span>${escapeHTML(item.label)}<small>${escapeHTML(item.note || "")}</small></span>
    </label>
  `).join("");
}

function readForm() {
  const next = { ...currentCase };
  fields.forEach((id) => {
    next[id] = $(id).value;
  });
  next.nihssItems = {};
  document.querySelectorAll("[data-nihss-item]").forEach((select) => {
    next.nihssItems[select.dataset.nihssItem] = select.value;
  });
  next.nihss = String(calculateNIHSS(next));
  $("nihss").value = next.nihss;
  checklistFieldNames.forEach((group) => {
    next[group] = Array.from(document.querySelectorAll(`[data-check-group="${group}"]:checked`)).map((box) => box.value);
  });
  return next;
}

function writeForm(strokeCase) {
  fields.forEach((id) => {
    $(id).value = strokeCase[id] ?? "";
  });
  const selectedNIHSS = strokeCase.nihssItems || {};
  document.querySelectorAll("[data-nihss-item]").forEach((select) => {
    select.value = selectedNIHSS[select.dataset.nihssItem] ?? "0";
  });
  $("nihss").value = String(calculateNIHSS(strokeCase));
  checklistFieldNames.forEach((group) => {
    const selected = new Set(strokeCase[group] || []);
    document.querySelectorAll(`[data-check-group="${group}"]`).forEach((box) => {
      box.checked = selected.has(box.value);
    });
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
  const abcd2 = calculateABCD2(c);
  $("summaryCase").textContent = c.caseID || "Unsaved case";
  $("hoursFromLKW").textContent = formatNumber(hoursFromLKW(c), 2);
  $("tnkDose").textContent = tnkDose(c) == null ? "--" : `${formatNumber(tnkDose(c), 1)} mg`;
  $("abcd2Score").textContent = `ABCD2: ${abcd2.score}`;
  $("abcd2Recommendation").textContent = abcd2.recommendation;

  const cards = [
    ["TNK / IVT", result.ivtStatus, result.ivtRationale, result.ivtTone],
    ["Mechanical Thrombectomy", result.evtStatus, result.evtRationale, result.evtTone],
    ["Early Secondary Prevention", result.secondaryStatus, result.secondaryRationale, result.secondaryTone],
    ["TOAST Etiology", result.etiologyStatus, result.etiologyRationale, result.etiologyTone],
    ["Etiology-Based Secondary Prevention", result.etiologyPreventionStatus, result.etiologyPreventionRationale, result.etiologyPreventionTone],
    ["TIA ABCD2", `Score ${abcd2.score}`, abcd2.recommendation, abcd2.tone]
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
  const hardContra = checkedItems(c, "ivtContra").filter((item) => item.level === "hard");
  const cautionContra = checkedItems(c, "ivtContra").filter((item) => item.level === "caution");
  const supportive = checkedItems(c, "ivtIndications");
  if (!hasNumber(c.nihss)) {
    return result("Need missing acute data", "Enter NIHSS and clinical eligibility data. Weight is only needed to calculate TNK dose.", "warn");
  }
  if (hardContra.length) {
    return result("No IVT: contraindication checked", `Checked hard stop(s): ${hardContra.map((item) => item.label).join("; ")}.`, "stop");
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
  const checklistText = supportive.length ? ` Supportive checklist: ${supportive.map((item) => item.label).join("; ")}.` : "";
  const cautionText = cautionContra.length ? ` Caution flag(s): ${cautionContra.map((item) => item.label).join("; ")}.` : "";
  if (hours <= 4.5 && c.disablingDeficit === "Yes") {
    const doseText = tnkDose(c) == null
      ? "Enter weight to calculate TNK dose."
      : `Calculated dose: ${formatNumber(tnkDose(c), 1)} mg.`;
    return result(
      "IVT recommended if otherwise eligible",
      `TNK 0.25 mg/kg max 25 mg is guideline-supported. ${doseText}${checklistText}${cautionText}`,
      cautionContra.length ? "warn" : "good"
    );
  }
  if (hours <= 4.5 && c.disablingDeficit !== "Yes") {
    return result("No routine IVT for non-disabling deficit", "Trials have not shown benefit for non-disabling deficits; consider DAPT if eligible.", "warn");
  }
  if (hours > 4.5 && hours <= 9 && (c.wakeupUnknownOnset === "Yes" || c.advancedImagingMismatch === "Yes") && c.salvageableTissue === "Yes") {
    return result("Extended-window IVT may be reasonable", `Advanced imaging selection supports consideration of IVT in selected 4.5-9h or wake-up stroke patients.${checklistText}${cautionText}`, "warn");
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
  const hardContra = checkedItems(c, "evtContra").filter((item) => item.level === "hard");
  const cautionContra = checkedItems(c, "evtContra").filter((item) => item.level === "caution");
  const supportive = checkedItems(c, "evtIndications");
  if (hardContra.length) {
    return result("No EVT: contraindication checked", `Checked hard stop(s): ${hardContra.map((item) => item.label).join("; ")}.`, "stop");
  }
  if (nihss == null) {
    return result("Need NIHSS", "NIHSS is required for the embedded EVT pathways.", "warn");
  }
  const checklistText = supportive.length ? ` Supportive checklist: ${supportive.map((item) => item.label).join("; ")}.` : "";
  const cautionText = cautionContra.length ? ` Caution flag(s): ${cautionContra.map((item) => item.label).join("; ")}.` : "";
  if (c.lvoSite === "Basilar") {
    if (hours <= 24 && nihss >= 10 && mrs != null && mrs <= 1 && pcAspects != null && pcAspects >= 6) {
      return result("EVT recommended", `Basilar occlusion within 24h, mRS 0-1, NIHSS >=10, PC-ASPECTS >=6.${checklistText}${cautionText}`, cautionContra.length ? "warn" : "good");
    }
    return result("Review posterior criteria", "Basilar pathway needs time, mRS, NIHSS, and PC-ASPECTS confirmation.", "warn");
  }
  if (c.lvoSite === "ICA" || c.lvoSite === "M1") {
    if (hours <= 6 && nihss >= 6 && mrs != null && mrs <= 1 && aspects != null && aspects >= 3 && aspects <= 10) {
      return result("EVT recommended", `Anterior ICA/M1 LVO <=6h, NIHSS >=6, mRS 0-1, ASPECTS 3-10.${checklistText}${cautionText}`, cautionContra.length ? "warn" : "good");
    }
    if (age != null && age < 80 && hours <= 6 && nihss >= 6 && mrs != null && mrs <= 1 && aspects != null && aspects <= 2 && c.massEffect !== "Yes") {
      return result("EVT reasonable in selected patient", `Selected age <80 ICA/M1 very-large-core pathway: <=6h, ASPECTS 0-2, no significant mass effect.${checklistText}${cautionText}`, "warn");
    }
    if (age != null && age < 80 && hours > 6 && hours <= 24 && nihss >= 6 && mrs != null && mrs <= 1 && aspects != null && aspects >= 3 && aspects <= 5 && c.massEffect !== "Yes") {
      return result("EVT recommended in selected patient", `Selected age <80 ICA/M1 6-24h large-core pathway: ASPECTS 3-5, no significant mass effect.${checklistText}${cautionText}`, cautionContra.length ? "warn" : "good");
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

function checkedItems(c, groupName) {
  const selected = new Set(c[groupName] || []);
  return checklistGroups[groupName].filter((item) => selected.has(item.id));
}

function checkedLabels(c, groupName) {
  const labels = checkedItems(c, groupName).map((item) => item.label);
  return labels.length ? labels.join("; ") : "None checked";
}

function calculateNIHSS(c) {
  const values = c.nihssItems || {};
  return nihssItems.reduce((sum, item) => sum + (Number(values[item.id]) || 0), 0);
}

function nihssSummary(c) {
  const values = c.nihssItems || {};
  return nihssItems.map((item) => `${item.title}: ${values[item.id] ?? "0"}`).join("; ");
}

function calculateABCD2(c) {
  let score = 0;
  if ((Number(c.age) || 0) >= 60) score += 1;
  if ((Number(c.bpSystolic) || 0) >= 140 || (Number(c.bpDiastolic) || 0) >= 90) score += 1;
  if (c.tiaClinicalFeature === "Unilateral weakness") score += 2;
  if (c.tiaClinicalFeature === "Speech disturbance without weakness") score += 1;
  if (c.tiaDuration === ">=60 minutes") score += 2;
  if (c.tiaDuration === "10-59 minutes") score += 1;
  if (c.tiaDiabetes === "Yes") score += 1;

  if (score < 3) {
    return { score, recommendation: "ABCD2 <3: outpatient TIA work-up can be considered if rapid follow-up and no other high-risk features.", tone: "info" };
  }
  if (score >= 4) {
    return { score, recommendation: "ABCD2 >=4: inpatient TIA work-up recommended/strongly considered.", tone: "warn" };
  }
  return { score, recommendation: "ABCD2 =3: intermediate risk; consider expedited observation/inpatient work-up depending on imaging, recurrent symptoms, and local protocol.", tone: "warn" };
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
    "Case_ID", "Patient_ID", "Sex", "Fellow", "Hours_From_LKW", "Age", "Weight_kg", "BP", "Glucose", "mRS",
    "NIHSS", "NIHSS_Items", "PMH", "Medications", "Disabling_Deficit",
    "LVO_Site", "Infarct_Pattern", "ASPECTS", "PC_ASPECTS", "TNK_Dose_mg", "Auto_IVT", "Auto_EVT",
    "IVT_Indication_Checks", "IVT_Contra_Checks", "EVT_Indication_Checks", "EVT_Contra_Checks",
    "Auto_Secondary", "Predicted_TOAST", "Etiology_Based_Prevention", "ABCD2", "TIA_Recommendation", "Final_IVT", "Final_EVT",
    "Final_Secondary", "Comments"
  ];
  const rows = registry.map((c) => {
    const assessment = evaluate(c);
    const abcd2 = calculateABCD2(c);
    return [
      c.caseID, c.patientID, c.sex, c.fellow, formatNumber(hoursFromLKW(c), 2), c.age, c.weightKg,
      `${c.bpSystolic || ""}/${c.bpDiastolic || ""}`, c.glucoseMgDL, c.prestrokeMRS, c.nihss,
      nihssSummary(c), c.pastMedicalHistory, c.medications,
      c.disablingDeficit, c.lvoSite, c.infarctPattern, c.aspects, c.pcAspects, tnkDose(c) == null ? "" : formatNumber(tnkDose(c), 1),
      assessment.ivtStatus, assessment.evtStatus, checkedLabels(c, "ivtIndications"), checkedLabels(c, "ivtContra"),
      checkedLabels(c, "evtIndications"), checkedLabels(c, "evtContra"), assessment.secondaryStatus, assessment.etiologyStatus, assessment.etiologyPreventionStatus,
      abcd2.score, abcd2.recommendation, c.finalIVTDecision, c.finalEVTDecision, c.finalSecondaryPlan, c.comments
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
  const abcd2 = calculateABCD2(c);
  const patientLabel = c.patientID ? `Patient ID/MRN: ${c.patientID}` : "Patient ID/MRN: [not entered]";
  const caseLabel = c.caseID ? `Case ID: ${c.caseID}` : "Case ID: [not entered]";
  const fellow = c.fellow ? c.fellow : "[fellow not entered]";
  const tnkText = tnkDose(c) == null ? "not calculated because weight is not entered" : `${formatNumber(tnkDose(c), 1)} mg`;
  const ageText = c.age || "[not entered]";
  const sexText = c.sex || "Unknown";
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
    `- Sex: ${sexText}`,
    `- Weight: ${weightText}`,
    `- BP: ${c.bpSystolic || "[not entered]"}/${c.bpDiastolic || "[not entered]"} mm Hg`,
    `- Glucose: ${c.glucoseMgDL || "[not entered]"} mg/dL`,
    `- Pre-stroke mRS: ${mrsText}`,
    `- NIHSS: ${nihssText}`,
    `- NIHSS item scores: ${nihssSummary(c)}`,
    `- Disabling deficit: ${c.disablingDeficit}`,
    `- Hemorrhage on CT/MRI: ${c.hemorrhage}`,
    `- IV thrombolysis contraindication flagged: ${c.ivtContraindication}`,
    `- Blood pressure controlled for IV thrombolysis: ${c.bpControlledForIVT}`,
    `- Past medical history: ${c.pastMedicalHistory || "None entered."}`,
    `- Medications: ${c.medications || "None entered."}`,
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
    `- IVT indication checklist: ${checkedLabels(c, "ivtIndications")}`,
    `- IVT contraindication/caution checklist: ${checkedLabels(c, "ivtContra")}`,
    `- IVT/TNK decision support: ${assessment.ivtStatus}`,
    `  Rationale: ${assessment.ivtRationale}`,
    `- Calculated tenecteplase dose: ${tnkText}`,
    `- Final IVT decision: ${finalIVT}`,
    `- EVT indication checklist: ${checkedLabels(c, "evtIndications")}`,
    `- EVT contraindication/caution checklist: ${checkedLabels(c, "evtContra")}`,
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
    "TIA ABCD2 assessment:",
    `- Clinical feature: ${c.tiaClinicalFeature}`,
    `- Duration: ${c.tiaDuration}`,
    `- Diabetes: ${c.tiaDiabetes}`,
    `- ABCD2 score: ${abcd2.score}`,
    `- Recommendation: ${abcd2.recommendation}`,
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
