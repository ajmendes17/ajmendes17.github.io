const sectionDetails = {
  workflow: {
    number: "01",
    kicker: "THE STUDY LOOP",
    title: "Learning is a loop, not a pile of notes.",
    copy: "Start with a topic or course source. Study it, try a question, see feedback, and return for review. Local Learning Studio connects each step so learners can see what they worked on and what to do next.",
    flow: ["Choose a topic", "Study & practice", "Review evidence"],
  },
  "knowledge-base": {
    number: "02",
    kicker: "THE KNOWLEDGE BASE",
    title: "One brain for a whole class.",
    copy: "LLS can export a linked class knowledge base to Obsidian, connecting courses, topics, sources, assessments, and progress. The app remains the study workspace; Obsidian is an optional, one-way export.",
    flow: ["Courses", "Topics & sources", "Progress notes"],
  },
  "maps-lessons": {
    number: "03",
    kicker: "MAPS & LESSONS",
    title: "See a course take shape, then work through an idea.",
    copy: "Review a proposed course map with modules, concepts, prerequisites, objectives, assessments, and source references. Then save lessons with explanations, analogies, worked examples, and knowledge checks.",
    flow: ["Map a course", "Choose a concept", "Save a lesson"],
  },
  "practice-evidence": {
    number: "04",
    kicker: "PRACTICE & EVIDENCE",
    title: "Every attempt adds context.",
    copy: "Practice records answers, confidence, hint use, and feedback. Progress views show activity and recent results, while recall reviews can be suggested at 1-, 3-, and 7-day intervals. These are review signals, not calibrated mastery estimates.",
    flow: ["Answer", "Reflect", "Review again"],
  },
  architecture: {
    number: "05",
    kicker: "LOCAL ARCHITECTURE",
    title: "Personal data, on your machine.",
    copy: "The React interface, Fastify local service, and SQLite database store course files and learner records locally by default. AI-supported tasks use the learner’s authenticated Codex installation, and structured results are validated before saving.",
    flow: ["React / TypeScript", "Fastify", "SQLite"],
  },
  status: {
    number: "06",
    kicker: "STATUS & NEXT",
    title: "A personal tool, growing one learning loop at a time.",
    copy: "LLS is an actively developed personal application, not a hosted multi-user platform. Current boundaries include no scanned-document OCR, no calibrated mastery estimates, and one-way Obsidian export.",
    flow: ["In development", "Personal app", "More to build"],
  },
};

const detail = document.querySelector(".graph-detail");
const graphSvg = document.querySelector(".knowledge-network");
const topicNodes = [
  { id: "workflow", label: "Study workflow", wide: [23, 23], narrow: [24, 17] },
  { id: "knowledge-base", label: "Brain", wide: [50, 50], narrow: [50, 48], brain: true },
  { id: "maps-lessons", label: "Maps & lessons", wide: [77, 23], narrow: [76, 17] },
  { id: "practice-evidence", label: "Practice & evidence", wide: [27, 74], narrow: [24, 68] },
  { id: "architecture", label: "Local architecture", wide: [72, 72], narrow: [76, 68] },
  { id: "status", label: "Status & next", wide: [88, 49], narrow: [50, 88] },
];
const noteNodes = [
  { id: "n1", wide: [12, 14], narrow: [10, 12], r: 3 },
  { id: "n2", wide: [34, 10], narrow: [34, 8], r: 4 },
  { id: "n3", wide: [44, 19], narrow: [43, 26], r: 2.5 },
  { id: "n4", wide: [62, 11], narrow: [65, 8], r: 4 },
  { id: "n5", wide: [90, 15], narrow: [91, 14], r: 3 },
  { id: "n6", wide: [11, 47], narrow: [9, 40], r: 4 },
  { id: "n7", wide: [39, 34], narrow: [39, 38], r: 3 },
  { id: "n8", wide: [66, 40], narrow: [63, 40], r: 2.5 },
  { id: "n9", wide: [92, 35], narrow: [92, 39], r: 4 },
  { id: "n10", wide: [9, 81], narrow: [10, 84], r: 3 },
  { id: "n11", wide: [42, 91], narrow: [35, 91], r: 4 },
  { id: "n12", wide: [61, 88], narrow: [67, 91], r: 3 },
  { id: "n13", wide: [91, 81], narrow: [91, 84], r: 4 },
  { id: "n14", wide: [34, 55], narrow: [35, 55], r: 2.5 },
  { id: "n15", wide: [64, 57], narrow: [65, 56], r: 3.5 },
  { id: "n16", wide: [51, 29], narrow: [50, 32], r: 2.5 },
  { id: "n17", wide: [49, 74], narrow: [50, 76], r: 2.5 },
];
const graphEdges = [
  ["workflow", "knowledge-base"], ["knowledge-base", "maps-lessons"],
  ["knowledge-base", "practice-evidence"], ["knowledge-base", "architecture"],
  ["knowledge-base", "status"], ["workflow", "maps-lessons"],
  ["maps-lessons", "practice-evidence"], ["practice-evidence", "architecture"],
  ["architecture", "status"], ["workflow", "practice-evidence"],
  ["n1", "workflow"], ["n1", "n2"], ["n2", "workflow"], ["n2", "n3"],
  ["n3", "knowledge-base"], ["n3", "n7"], ["n4", "maps-lessons"],
  ["n4", "n2"], ["n4", "n5"], ["n5", "maps-lessons"], ["n5", "n9"],
  ["n6", "workflow"], ["n6", "practice-evidence"], ["n6", "n10"],
  ["n7", "workflow"], ["n7", "knowledge-base"], ["n7", "n14"],
  ["n8", "knowledge-base"], ["n8", "maps-lessons"], ["n8", "n15"],
  ["n9", "maps-lessons"], ["n9", "status"], ["n10", "practice-evidence"],
  ["n10", "n11"], ["n11", "practice-evidence"], ["n11", "n12"],
  ["n12", "architecture"], ["n12", "n13"], ["n13", "architecture"],
  ["n13", "status"], ["n14", "practice-evidence"], ["n14", "knowledge-base"],
  ["n15", "architecture"], ["n15", "knowledge-base"], ["n16", "workflow"],
  ["n16", "maps-lessons"], ["n16", "knowledge-base"], ["n17", "practice-evidence"],
  ["n17", "architecture"], ["n17", "knowledge-base"],
];
let selectedSection = "workflow";

function renderGraph() {
  const focusedId = graphSvg.querySelector(".graph-topic:focus")?.dataset.section;
  const width = Math.max(1, graphSvg.clientWidth);
  const height = Math.max(1, graphSvg.clientHeight);
  const narrow = width < 560;
  const allNodes = [...topicNodes, ...noteNodes];
  const positions = new Map(allNodes.map((node) => {
    const [x, y] = narrow ? node.narrow : node.wide;
    return [node.id, { x: x * width / 100, y: y * height / 100 }];
  }));
  const svgElement = (tag, attrs = {}) => {
    const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
    return element;
  };

  graphSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  graphSvg.replaceChildren();

  const edgeLayer = svgElement("g", { "aria-hidden": "true" });
  graphEdges.forEach(([from, to], index) => {
    const a = positions.get(from);
    const b = positions.get(to);
    edgeLayer.append(svgElement("line", {
      x1: a.x, y1: a.y, x2: b.x, y2: b.y,
      class: `graph-edge${index > 8 ? " secondary" : ""}`,
    }));
  });
  graphSvg.append(edgeLayer);

  const noteLayer = svgElement("g", { "aria-hidden": "true" });
  noteNodes.forEach((node) => {
    const point = positions.get(node.id);
    noteLayer.append(svgElement("circle", { cx: point.x, cy: point.y, r: node.r, class: "graph-note" }));
  });
  graphSvg.append(noteLayer);

  topicNodes.forEach((node) => {
    const point = positions.get(node.id);
    const anchor = svgElement("a", {
      href: `#${node.id}`,
      class: `graph-topic${node.brain ? " brain" : ""}`,
      "data-section": node.id,
      "aria-label": node.brain ? "Brain: knowledge base" : node.label,
      ...(selectedSection === node.id ? { "aria-current": "location" } : {}),
    });
    anchor.append(svgElement("circle", {
      cx: point.x, cy: point.y, r: node.brain ? 25 : 17, class: "topic-halo",
    }));
    anchor.append(svgElement("circle", {
      cx: point.x, cy: point.y, r: node.brain ? 12 : 6, class: "topic-dot",
    }));
    const label = svgElement("text", {
      x: point.x, y: point.y + (node.brain ? 45 : 34), class: "topic-label",
    });
    label.textContent = node.brain ? "BRAIN" : node.label;
    anchor.append(label);
    anchor.addEventListener("click", (event) => {
      event.preventDefault();
      selectedSection = node.id;
      selectSection(selectedSection);
      renderGraph();
      graphSvg.querySelector(`[data-section="${node.id}"]`)?.focus({ preventScroll: true });
    });
    graphSvg.append(anchor);
  });

  if (focusedId) graphSvg.querySelector(`[data-section="${focusedId}"]`)?.focus({ preventScroll: true });
}

function selectSection(id) {
  const data = sectionDetails[id];
  if (!data) return;

  selectedSection = id;
  detail.querySelector("[data-detail-number]").textContent = data.number;
  detail.querySelector("[data-detail-kicker]").textContent = data.kicker;
  detail.querySelector("#detail-title").textContent = data.title;
  detail.querySelector("[data-detail-copy]").textContent = data.copy;
  const flow = detail.querySelector("[data-detail-flow]");
  flow.replaceChildren(...data.flow.flatMap((label, index) => {
    const item = document.createElement("span");
    item.textContent = label;
    if (index === data.flow.length - 1) return [item];
    const arrow = document.createElement("i");
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "→";
    return [item, arrow];
  }));
}

if (window.location.hash) {
  const initialId = window.location.hash.slice(1);
  if (sectionDetails[initialId]) selectSection(initialId);
}

renderGraph();
if ("ResizeObserver" in window) new ResizeObserver(renderGraph).observe(graphSvg.parentElement);
else window.addEventListener("resize", renderGraph);
