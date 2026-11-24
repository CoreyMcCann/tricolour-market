const research = [
  {
    "title": "FTC amended complaint against Amazon.com, Inc.",
    "date": "September 20, 2023",
    "location": "PDF pages 47–55, historical desktop Iliad flow (¶¶127–155)",
    "url": "https://www.ftc.gov/system/files/ftc_gov/pdf/2023-09-20-067-AmendedComplaint%28redacted%29.pdf#page=47",
    "copy": "The FTC alleged that the historical desktop Iliad process took four pages, at least six clicks and presented fifteen options. We adapt the management menu, a benefits reminder, an offer and repeated decisions. These are allegations about a historical interface. The fictional routes use their own screens, offers and terms."
  },
  {
    "title": "FTC Secures Historic $2.5 Billion Settlement Against Amazon",
    "date": "September 25, 2025",
    "location": "Press release, monetary judgment and changes to Prime",
    "url": "https://www.ftc.gov/news-events/news/press-releases/2025/09/ftc-secures-historic-25-billion-settlement-against-amazon",
    "copy": "The FTC reports a settlement addressing both Prime enrollment and cancellation. The total combines a $1 billion civil penalty and $1.5 billion in consumer redress. The settlement provides case context for the historical complaint."
  },
  {
    "title": "Sheil et al., Staying at the Roach Motel: Cross-Country Analysis of Manipulative Subscription and Cancellation Flows",
    "date": "CHI 2024 (preprint revised March 14, 2024)",
    "location": "§§3.3, 4.2.2, 4.3.2, 4.4.2, 4.6 and 5.1",
    "url": "https://arxiv.org/html/2309.17145v3",
    "copy": "The researchers document obstacles such as extra decisions and offers, and discuss examples of prominent cancellation controls and clear confirmations. The findings describe the news sites and personas studied at the time. They inform our comparison without measuring the effect of our redesign."
  },
  {
    "title": "Which?, Dark Patterns 2026",
    "date": "November 5, 2026",
    "location": "Methodology and Findings, “Subscription traps” and Figure 5",
    "url": "https://www.which.co.uk/policy-and-insight/article/dark-patterns-2026-aCroI9S4updG",
    "copy": "In this self-reported UK survey, 29% of respondents who had tried to cancel or change a subscription in the preceding year found cancellation difficult. Figure 5 reports barriers for that subgroup (769 respondents). This evidence provides UK context and does not estimate Canadian or global experience."
  }
];
const disclosure = [
  {
    "title": "First website build",
    "date": "November 24, 2026",
    "tool": "Codex",
    "copy": "Codex implemented the HTML, CSS, and JavaScript, drafted interface wording and annotations, and created SVG illustrations and diagrams."
  }
];

const plan = Object.freeze({
  customer: "Alex Sample", email: "alex.sample@example.invalid",
  price: "$6.99", discount: "$3.49", start: "November 24, 2026",
  renewal: "December 24, 2026", accessEnds: "December 23, 2026",
  reminder: "December 21, 2026", regularPriceResumes: "January 24, 2027"
});

const demos = {
  signup: {
    name: "Signup",
    scenes: { offer: "Membership offer", review: "Review signup", joined: "Signup complete" }
  },
  obstructive: {
    name: "Obstructive cancellation",
    scenes: {
      account: "Membership account", benefits: "Benefits reminder", offer: "Retention offer",
      decision: "Final decision", cancelled: "Cancellation complete",
      kept: "Membership kept", reminder: "Reminder scheduled", discount: "Discount applied"
    }
  },
  direct: {
    name: "Direct cancellation",
    scenes: {
      account: "Membership account", confirm: "Confirm cancellation", cancelled: "Cancellation complete",
      kept: "Membership kept", discount: "Discount applied"
    }
  }
};
const annotations = {
  signup: {
    offer: "The monthly price and automatic renewal are visible before signup.",
    review: "A single, explicit signup button follows a review of the recurring charge.",
    joined: "The receipt confirms enrolment and names the next billing date."
  },
  obstructive: {
    account: "The cancellation entry is inside the management menu.",
    benefits: "The first cancellation screen emphasizes benefits and makes staying the strongest action.",
    offer: "The discount gets the gold button. Continuing to cancel requires another decision.",
    decision: "Keeping the membership is the prominent choice. Only Confirm cancellation stops renewal.",
    cancelled: "The receipt gives the last day of access and confirms that billing stops.",
    kept: "Leaving the flow with Keep membership preserves automatic renewal.",
    reminder: "A reminder schedules a prompt while leaving automatic renewal on.",
    discount: "The discount changes one bill. The membership remains active."
  },
  direct: {
    account: "A labelled Cancel membership button is visible on the same membership account.",
    confirm: "The primary button completes cancellation. The optional discount is available on this screen.",
    cancelled: "The receipt gives the same access and billing outcome as the obstructive route.",
    kept: "Leaving the confirmation preserves automatic renewal.",
    discount: "The optional discount changes one bill and keeps the membership active."
  }
};

const icons = {
  box: '<path d="m3 7 9-4 9 4v10l-9 4-9-4V7Zm0 0 9 4 9-4m-9 4v10M7.5 5l9 4"/>',
  book: '<path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1Zm0 0v15"/>',
  tag: '<path d="M3 4h8l10 10-7 7L4 11 3 4Z"/><circle cx="8" cy="8" r="1"/>',
  sliders: '<path d="M4 6h16M4 12h16M4 18h16"/><path stroke-width="4" d="M8 4v4m8 2v4m-5 2v4"/>',
  check: '<path d="m4 12 5 5L20 6"/>'
};
function icon(name) {
  return '<svg aria-hidden="true" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">' + icons[name] + '</svg>';
}

const benefits = [
  ["box", "Campus delivery on eligible orders"],
  ["book", "Member prices on selected textbooks"],
  ["tag", "Offers on chargers, dorm essentials and campus clothing"]
];
const state = {};
const lastScene = {};
let route;
let clean = false;
const content = document.querySelector("#content");
const toolbar = document.querySelector("#recording");
const restore = document.querySelector("#restore");
const demoSelect = document.querySelector("#demo-select");
const sceneSelect = document.querySelector("#scene-select");
const annotate = document.querySelector("#annotate");
const accountLink = document.querySelector("#account-link");
const documents = { home: "Demo hub", diagrams: "Comparison diagrams", references: "References", disclosure: "AI disclosure", search: "Search" };

function firstScene(demo) {
  return Object.keys(demos[demo].scenes)[0];
}

function parseRoute() {
  const [page, scene, extra] = location.hash.slice(1).split("/");
  if (Object.hasOwn(demos, page) && !extra) {
    return { page, scene: Object.hasOwn(demos[page].scenes, scene) ? scene : firstScene(page) };
  }
  return { page: Object.hasOwn(documents, page) ? page : "home" };
}

// A direct scene link supplies an illustrative snapshot. Buttons update only their own demo.
function sceneState(demo, scene) {
  if (demo === "signup") return { status: scene === "joined" ? "active" : "inactive" };
  return {
    status: scene === "cancelled" ? "cancelled" : "active",
    reminder: scene === "reminder",
    discount: scene === "discount"
  };
}

function readRoute() {
  route = parseRoute();
  const { page, scene } = route;
  if (scene) {
    const saved = history.state;
    state[page] = saved?.page === page && saved.scene === scene ? saved.membership : sceneState(page, scene);
  }
  render(true);
}

function navigate(page, scene, membership = scene && sceneState(page, scene)) {
  const hash = location.pathname + "#" + page + (scene ? "/" + scene : "");
  const snapshot = scene ? { page, scene, membership } : null;
  if (scene) state[page] = membership;
  if (location.pathname + location.search + location.hash === hash) history.replaceState(snapshot, "", hash);
  else history.pushState(snapshot, "", hash);
  route = { page, scene };
  render(true);
}

function button(label, scene, style = "", effect = "") {
  return '<button class="button ' + style + '" type="button" data-scene="' + scene + '" data-effect="' + effect + '">' + label + '</button>';
}
function link(label, hash, style = "") {
  return '<a class="button ' + style + '" href="#' + hash + '">' + label + '</a>';
}
function actions(...items) {
  return '<div class="actions">' + items.join("") + '</div>';
}
function facts(rows) {
  return '<dl class="facts">' + rows.map(([name, value]) => '<div><dt>' + name + '</dt><dd>' + value + '</dd></div>').join("") + '</dl>';
}
function benefitList() {
  return '<ul class="benefits">' + benefits.map(([name, label]) => '<li>' + icon(name) + label + '</li>').join("") + '</ul>';
}
function heading(kicker, title, copy) {
  return '<p class="kicker">' + kicker + '</p><h1>' + title + '</h1><p>' + copy + '</p>';
}
function priceSummary(page) {
  const membership = state[page];
  const active = membership.status === "active";
  const cancelled = membership.status === "cancelled";
  const nextCharge = membership.discount ? plan.discount : plan.price;
  const rows = [["Member", plan.customer], ["Billing", "Monthly"]];
  const statuses = { active: "Active", inactive: "Not enrolled", cancelled: "Cancelled" };
  if (active) rows.push(["Next payment", plan.renewal], ["Next charge", nextCharge + " CAD"]);
  if (active && membership.discount) rows.push(["Regular price resumes", plan.regularPriceResumes]);
  if (active && membership.reminder) rows.push(["Reminder", plan.reminder]);
  if (cancelled) rows.push(["Access through", plan.accessEnds], ["Future payments", "None"]);
  return '<aside class="panel side" aria-label="Plan summary"><div class="plan-brand">Tricolour<span class="plus">+</span></div>'
    + '<p class="price">' + plan.price + ' <small>CAD / month</small></p>'
    + '<span class="status ' + (active ? "" : "cancelled") + '">' + statuses[membership.status] + '</span>'
    + facts(rows) + '</aside>';
}
function cancellationTerms() {
  return 'Your Tricolour+ benefits are available through <strong>' + plan.accessEnds
    + '</strong>. Your membership will not renew and there will be no further payments.';
}
function keepButton() {
  return button("Keep membership", "kept", "primary");
}
function remindButton() {
  return button("Remind me before renewal", "reminder", "", "reminder");
}
function discountCopy() {
  return 'Pay <strong>' + plan.discount + ' CAD</strong> on ' + plan.renewal
    + '. The membership stays active and returns to ' + plan.price + ' CAD per month on ' + plan.regularPriceResumes + '.';
}
function offerChoice(style = "") {
  return button("Apply one-month discount", "discount", style, "discount");
}

function signupScene(scene) {
  switch (scene) {
    case "offer":
      return heading("Tricolour+ membership", "Make campus shopping easier", plan.price + " CAD per month. Renews automatically each month until you cancel.")
        + benefitList() + actions(button("Review membership", "review", "primary"));
    case "review":
      return heading("Tricolour+ membership", "Review your signup", "These prefilled details are demo data. No personal or payment information is required.")
        + facts([["Customer", plan.customer], ["Demo email", plan.email], ["Payment method", "Simulated payment"], ["Due on " + plan.start, plan.price + " CAD"], ["Next automatic charge", plan.price + " CAD on " + plan.renewal]])
        + '<p class="notice">Renews at ' + plan.price + ' CAD per month until you cancel. To cancel, go to My account → Tricolour+.</p>'
        + actions(button("Start paid membership", "joined", "primary", "join"), button("Back to offer", "offer", "text"));
    case "joined":
      return heading("Membership confirmed", "Welcome to Tricolour+", "Your membership is active. Your next automatic payment is <strong>" + plan.price + " CAD on " + plan.renewal + "</strong>.")
        + '<div class="notice">This was a demonstration. No payment was collected.</div>'
        + actions(link("Return to demo hub", "home"));
  }
}

function cancellationScene(page, scene) {
  switch (scene) {
    case "account": {
      const membership = state[page];
      const account = heading("Account / Membership", "Your Tricolour+ membership", "Manage the monthly membership on your Tricolour Market account.");
      if (membership.status === "cancelled") {
        return account + '<div class="notice">Your membership is cancelled. Benefits are available through ' + plan.accessEnds + '.</div>'
          + actions(button("View cancellation receipt", "cancelled"));
      }
      const manage = page === "direct"
        ? actions(button("Cancel membership", "confirm", "primary"))
        : '<details class="manage"><summary>Manage membership</summary>' + button("End membership", "benefits") + '</details>';
      return account + benefitList() + manage;
    }
    case "benefits":
      return heading("Tricolour+ membership", "Review your membership benefits", "Here’s what is included in your current membership.")
        + benefitList() + actions(keepButton(), remindButton(), button("Continue to cancel", "offer", "text"));
    case "offer":
      return heading("Tricolour+ membership", "Save on your next month", "You can keep your current benefits at a lower price for one billing cycle.")
        + '<div class="notice offer">' + discountCopy() + '</div>'
        + actions(offerChoice("primary"), keepButtonSecondary(), button("Continue to cancel", "decision", "text"));
    case "decision":
      return heading("Tricolour+ membership", "Choose what to do with your membership", "If you confirm cancellation, access continues through <strong>" + plan.accessEnds + "</strong> and there will be no further payments.")
        + actions(keepButton(), remindButton())
        + '<div class="secondary-exit">' + button("Confirm cancellation", "cancelled", "text", "cancel") + '</div>';
    case "confirm":
      return heading("Tricolour+ membership", "Cancel your membership?", "If you confirm cancellation, access continues through <strong>" + plan.accessEnds + "</strong> and there will be no further payments.")
        + actions(button("Confirm cancellation", "cancelled", "primary", "cancel"), keepButtonSecondary())
        + '<div class="notice"><h3>Optional one-month discount</h3><p>' + discountCopy() + '</p>' + actions(offerChoice()) + '</div>';
    case "cancelled":
      return heading("Cancellation confirmed", "Your membership is cancelled", cancellationTerms())
        + actions(button("Back to membership", "account"));
    case "kept":
      return heading("Membership active", "Your membership is still active", "Automatic renewal is still on. Your next payment is on <strong>" + plan.renewal + "</strong>.")
        + actions(button("Back to membership", "account"));
    case "reminder":
      return heading("Membership active", "Your reminder is scheduled", "In this demo, a reminder is scheduled for <strong>" + plan.reminder + "</strong>. Automatic renewal is still on for <strong>" + plan.renewal + "</strong>. No actual reminder is sent.")
        + actions(button("Back to membership", "account"));
    case "discount":
      return heading("Membership active", "Your discount is applied", discountCopy())
        + actions(button("Back to membership", "account"));
  }
}

function keepButtonSecondary() {
  return button("Keep membership", "kept");
}

function renderDemo(page, scene) {
  const copy = page === "signup" ? signupScene(scene) : cancellationScene(page, scene);
  return '<div class="wrap demo-body"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="#home">Demo hub</a><span aria-hidden="true">/</span>' + demos[page].name + '</nav>'
    + '<aside id="annotation" class="annotation"' + (clean || !annotate.checked ? ' hidden' : '') + '><strong>Design annotation.</strong> ' + annotations[page][scene] + '</aside>'
    + '<div class="scene-grid"><section class="panel">' + copy + '</section>' + priceSummary(page) + '</div></div>';
}

function renderHome() {
  const cards = [
    ["book", "Signup", "Review the monthly plan and start a simulated membership.", "signup/offer", "Start signup"],
    ["sliders", "Obstructive cancellation", "Find the exit through a management menu and retention offers.", "obstructive/account", "Open obstructive demo"],
    ["check", "Direct cancellation", "Cancel from the membership account with one confirmation.", "direct/account", "Open direct demo"]
  ];
  return '<div class="wrap home-content"><section class="hero"><div class="hero-copy">'
    + '<p class="kicker">The campus marketplace</p><h1>Campus essentials, delivered.</h1><p>Textbooks, tech and dorm essentials with campus delivery. Explore how Tricolour+ membership works.</p>'
    + link("Explore Tricolour+", "signup/offer", "primary")
    + '</div><img src="./market.svg" width="640" height="460" alt="An illustrated delivery box with a textbook, charger and water bottle"></section>'
    + '<section aria-labelledby="demos"><div class="section-top"><h2 id="demos">Membership demonstrations</h2><p>One monthly plan. Two ways to cancel.</p></div><div class="cards">'
    + cards.map(([shape, title, copy, hash, label]) => '<a class="card" href="#' + hash + '"><span class="glyph">' + icon(shape) + '</span><h3>' + title + '</h3><p>' + copy + '</p><span class="card-action">' + label + '</span></a>').join("")
    + '</div></section><nav class="resources-row" aria-label="Demonstration resources"><a href="#diagrams">Comparison diagrams</a><a href="#references">References</a><a href="#disclosure">AI disclosure</a></nav></div>';
}

function renderDocument(page) {
  const intro = '<section class="wrap document"><h1>' + documents[page] + '</h1>';
  if (page === "diagrams") {
    const diagrams = [
      ["routes.svg", "Cancellation routes", "The obstructive route runs from the membership account through the management menu, benefits reminder, retention offer and final decision. The direct route uses a visible cancellation button and one confirmation. Both end with the same receipt. Keep membership, reminder and discount branches leave renewal on."],
      ["decision.svg", "Decision screens", "The retention-focused screen emphasizes Keep membership and places Confirm cancellation after other choices. The direct screen makes Confirm cancellation prominent and puts the optional discount below it."]
    ];
    return intro + '<p>These diagrams compare our fictional demonstrations.</p>' + diagrams.map(([file, title, description]) =>
      '<article class="resource"><h2>' + title + '</h2><p>' + description + '</p><figure class="diagram"><img src="./' + file + '" alt="' + title + '"></figure><div class="actions"><a class="button" href="./' + file + '" download>Download ' + title.toLowerCase() + ' SVG</a></div></article>').join("") + '</section>';
  }
  if (page === "references") {
    return intro + '<p>Sources for the CISC 497 position video demonstrations.</p>'
      + '<article class="resource"><h2>About the fictional demo</h2><p>The marketplace, customer, prices and billing dates are fictional. Tricolour Market is an independent student project. The obstructive demo adapts historical interaction patterns in a new interface. The direct flow is our proposed redesign: a visible cancellation control, an optional offer, and confirmation of access and billing outcomes.</p></article>'
      + research.map(source => '<article class="resource"><h2><a href="' + source.url + '">' + source.title + '</a></h2><p class="muted">' + source.date + ' · ' + source.location + '</p><p>' + source.copy + '</p></article>').join("")
      + '<div class="actions"><a href="./references.md">Read the Markdown reference file</a></div></section>';
  }
  if (page === "disclosure") {
    return intro + '<p>Working log for group review. Review and update this log before preparing the video disclosure.</p>'
      + disclosure.map(entry => '<article class="resource"><h2>' + entry.title + '</h2>' + facts([["Date", entry.date], ["Tool", entry.tool]]) + '<p>' + entry.copy + '</p></article>').join("")
      + '<div class="actions"><a href="./ai-disclosure.md">Read the Markdown disclosure log</a></div></section>';
  }
  const query = new URLSearchParams(location.search).get("q")?.trim().toLowerCase() ?? "";
  const products = [
    ["Course textbooks", "books textbook textbooks course"], ["USB-C chargers", "tech usb cable charger chargers"],
    ["Dorm essentials", "dorm essentials bedding home"], ["Campus clothing", "campus clothing apparel hoodie"]
  ].filter(([title, tags]) => query && query.split(/\s+/).every(term => (title.toLowerCase() + " " + tags).includes(term)));
  return intro + (products.length
    ? '<ul class="benefits">' + products.map(([title]) => '<li>' + icon("tag") + title + '</li>').join("") + '</ul>'
    : '<p>No matching demo categories. Try textbooks, chargers, dorm essentials or clothing.</p>') + '</section>';
}

function renderControls() {
  const { page, scene } = route;
  toolbar.hidden = !scene || clean;
  restore.hidden = !scene || !clean;
  accountLink.href = '#' + (page === "obstructive" ? page : "direct") + '/account';
  if (!scene) return;
  demoSelect.value = page;
  sceneSelect.replaceChildren(...Object.entries(demos[page].scenes).map(([key, label]) => new Option(label, key)));
  sceneSelect.value = scene;
}

function render(focus = false) {
  const { page, scene } = route;
  renderControls();
  if (scene) lastScene[page] = scene;
  content.innerHTML = scene ? renderDemo(page, scene) : page === "home" ? renderHome() : renderDocument(page);
  document.title = (scene ? demos[page].scenes[scene] : documents[page]) + " | Tricolour Market";
  if (focus) {
    content.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
}

function setClean(value) {
  clean = value;
  renderControls();
  const annotation = document.querySelector("#annotation");
  if (annotation) annotation.hidden = clean || !annotate.checked;
  (clean ? restore : document.querySelector("#clean")).focus();
}
content.addEventListener("click", event => {
  const control = event.target.closest("button[data-scene]");
  if (!control) return;
  const { page } = route;
  const membership = { ...state[page] };
  const { scene, effect } = control.dataset;
  if (effect === "join") membership.status = "active";
  if (effect === "cancel") membership.status = "cancelled";
  if (effect === "reminder") membership.reminder = true;
  if (effect === "discount") membership.discount = true;
  navigate(page, scene, membership);
});
demoSelect.replaceChildren(...Object.entries(demos).map(([key, demo]) => new Option(demo.name, key)));
demoSelect.addEventListener("change", () => {
  const page = demoSelect.value;
  const membership = state[page];
  // Resume the destination demo from its last named scene.
  const scene = lastScene[page] ?? firstScene(page);
  navigate(page, scene, membership);
});
sceneSelect.addEventListener("change", () => navigate(route.page, sceneSelect.value));
document.querySelector("#restart").addEventListener("click", () => navigate(route.page, firstScene(route.page)));
document.querySelector("#clean").addEventListener("click", () => setClean(true));
restore.addEventListener("click", () => setClean(false));
annotate.addEventListener("change", () => {
  document.querySelector("#annotation").hidden = clean || !annotate.checked;
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && clean && route.scene) setClean(false);
});
document.querySelector(".skip").addEventListener("click", event => {
  event.preventDefault();
  content.focus();
});
document.querySelector("#search").addEventListener("submit", event => {
  event.preventDefault();
  const query = document.querySelector("#query").value.trim();
  if (!query) return;
  history.pushState(null, "", "?q=" + encodeURIComponent(query) + "#search");
  readRoute();
});
accountLink.addEventListener("click", event => {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  const page = route.page === "obstructive" ? "obstructive" : "direct";
  navigate(page, "account", state[page]);
});
window.addEventListener("hashchange", readRoute);
window.addEventListener("popstate", () => {
  const next = parseRoute();
  if (next.page === route.page && next.scene === route.scene) readRoute();
});
readRoute();
