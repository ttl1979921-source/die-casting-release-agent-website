const defaultRecommendation = {
  category: "Technical Review Required",
  why:
    "The selected combination requires more process information before recommending a release agent, lubricant or metalworking fluid.",
  applications: "Custom die casting and machining applications.",
  nextStep:
    "Contact us with alloy, machine tonnage, part drawing, die temperature, current defect photos and existing lubricant information."
};

const recommendations = {
  aluminiumStructuralLargeTonnage: {
    category: "Structural Parts Low-Residue Release Agent",
    why:
      "Large aluminium structural castings require stable film formation across wide die surfaces, strong release performance, and controlled residue to support downstream cleaning or finishing.",
    applications:
      "Integrated die casting parts, battery tray structures, large body structural components.",
    nextStep:
      "Contact us with alloy grade, machine tonnage, die temperature range, part size, current dilution ratio and defect photos."
  },
  magnesium: {
    category: "Magnesium Alloy High-Cleanliness Release Agent",
    why:
      "Magnesium die casting requires controlled release, low residue and stable lubrication under high thermal load, especially for thin-wall and precision components.",
    applications:
      "Magnesium housings, electronic components, lightweight automotive parts, smartphone magnesium back covers.",
    nextStep:
      "Contact us with part weight, wall thickness, machine tonnage and current sticking, staining or surface issue."
  },
  semiSolid: {
    category: "Semi-solid Aluminium / Magnesium Casting Release Agent",
    why:
      "Semi-solid casting applications require clean release, stable thermal behavior and low contamination to support dense, high-integrity parts with low porosity and precision surface quality.",
    applications:
      "Hydraulic brake valves, wheels, brake master cylinders, oil filter housings, door pillars, steering control arms, engine brackets, cylinder blocks and support structures.",
    nextStep:
      "Contact us with the semi-solid process route, alloy, part type, die temperature, slurry preparation method and surface quality requirement."
  },
  siliconeFree: {
    category: "Silicone-free Low-Residue Release Agent",
    why:
      "Silicone-free release technology helps reduce surface contamination risks when painting, bonding, coating or other post-casting surface treatments are required.",
    applications:
      "Electrical components, painted aluminium castings, coated structural parts, bonded assemblies.",
    nextStep:
      "Contact us with downstream process details, surface cleanliness requirements and current residue issue."
  },
  plunger: {
    category: "Low-Smoke Plunger Lubricant",
    why:
      "Plunger lubricants are designed to protect shot sleeves and plunger tips while supporting stable shot performance and reduced smoke in the foundry.",
    applications:
      "High-pressure die casting machines, shot sleeve systems, plunger tips and automated lubrication systems.",
    nextStep:
      "Contact us with shot sleeve diameter, shot frequency, current lubricant type and wear problem."
  },
  lowResidue: {
    category: "Low Residue Die Release Agent",
    why:
      "Low-residue release agents help reduce build-up, staining and residue on castings and die surfaces, supporting cleaner downstream processing.",
    applications:
      "High surface quality castings, painted parts, electrical housings, heat sinks and precision aluminium components.",
    nextStep:
      "Contact us with current release agent dilution, spray time, die temperature and residue location."
  },
  cuttingFluid: {
    category: "Metalworking Fluid / Cutting Fluid",
    why:
      "CNC machining requires stable cooling, lubrication, corrosion protection and chip removal depending on the metal and machining process.",
    applications:
      "Aluminium machining, steel machining, tapping, drilling, milling and grinding.",
    nextStep:
      "Contact us with material, operation type, tool material, water hardness and current fluid issue."
  }
};

function isLargeTonnage(tonnage) {
  return tonnage === "2000T-7000T" || tonnage === "Above 7000T";
}

function getRecommendation(selection) {
  const { process, alloy, tonnage, partType, problem } = selection;

  // Priority 1: semi-solid process is the most specialized route.
  if (process === "Semi-solid Die Casting") {
    return recommendations.semiSolid;
  }

  // Priority 2: magnesium process or material.
  if (process === "Magnesium Die Casting" || alloy === "Magnesium") {
    return recommendations.magnesium;
  }

  // Priority 3: plunger life issue.
  if (problem === "Short Plunger Life") {
    return recommendations.plunger;
  }

  // Priority 4: downstream finishing compatibility.
  if (problem === "Painting / Coating / Bonding Compatibility") {
    return recommendations.siliconeFree;
  }

  // Priority 5: residue issue.
  if (problem === "High Residue") {
    return recommendations.lowResidue;
  }

  // Priority 6: large aluminium structural die casting.
  if (
    process === "High Pressure Die Casting" &&
    alloy === "Aluminium" &&
    isLargeTonnage(tonnage) &&
    partType === "Structural Part"
  ) {
    return recommendations.aluminiumStructuralLargeTonnage;
  }

  // Priority 7: machining route.
  if (process === "CNC Machining") {
    return recommendations.cuttingFluid;
  }

  // Priority 8: default technical review.
  return defaultRecommendation;
}

function getCurrentSelection(form) {
  const formData = new FormData(form);

  return {
    process: formData.get("process"),
    alloy: formData.get("alloy"),
    tonnage: formData.get("tonnage"),
    partType: formData.get("partType"),
    problem: formData.get("problem")
  };
}

function renderRecommendation(result) {
  document.querySelector("#resultCategory").textContent = result.category;
  document.querySelector("#resultWhy").textContent = result.why;
  document.querySelector("#resultApplications").textContent = result.applications;
  document.querySelector("#resultNextStep").textContent = result.nextStep;
}

function initializeSelector() {
  const form = document.querySelector("#productSelector");

  if (!form) {
    return;
  }

  renderRecommendation(defaultRecommendation);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const selection = getCurrentSelection(form);
    renderRecommendation(getRecommendation(selection));
  });
}

if (typeof document !== "undefined") {
  initializeSelector();
}

if (typeof window !== "undefined") {
  window.getRecommendation = getRecommendation;
}
