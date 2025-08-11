// Featured layout: curated highlights, and the full list below (including original).

const MANIFEST_URL = "https://raw.githubusercontent.com/flunch1314/flunch1314.github.io/main/images.json";
const IMAGE_BASE = "https://raw.githubusercontent.com/flunch1314/flunch1314.github.io/main/KobeAvatarGallery/"; // images live in the project root

// Configure which items to feature
const ORIGINAL_IMAGE = "kobe.jpg"; // shown as first item in Highlights
const HIGHLIGHTS = [
  "kobe_LEGO.png",
  "kobe_Simpson.png",
  "kobe_Steampunk.png",
  "kobe_Caricature.png",
  "kobe_GTA.png",
  "kobe_Rubber_Hose.png",
  "kobe_Peanuts.png",
  "kobe_South_Park.png",
  "kobe_SpongeBob.png",
];

// Fallback list if fetch fails (kept in sync with current repo)
let imageFiles = [
  "kobe.jpg",
  "kobe_3D_Animation.png",
  "kobe_3D_Voxel_Art.png",
  "kobe_3D_cartoon_CGI.png",
  "kobe_Adventure_Time.png",
  "kobe_Archer.png",
  "kobe_Archie.png",
  "kobe_Calvin_and_Hobbes.png",
  "kobe_Caricature.png",
  "kobe_Cel_Shaded.png",
  "kobe_Chibi.png",
  "kobe_Claymation.png",
  "kobe_Disney_1990s.png",
  "kobe_Doraemon.png",
  "kobe_DreamWorks_Animation.png",
  "kobe_Family_Guy.png",
  "kobe_Fantasy_Cartoon.png",
  "kobe_Flat.png",
  "kobe_Fortnite.png",
  "kobe_GTA.png",
  "kobe_Ghibli.png",
  "kobe_Impressionist.png",
  "kobe_LEGO.png",
  "kobe_Ligne_Claire.png",
  "kobe_Looney_Tunes.png",
  "kobe_Low_Poly.png",
  "kobe_Marvel.png",
  "kobe_Minecraft.png",
  "kobe_Modern_Anime.png",
  "kobe_Modern_Cartoon_Network.png",
  "kobe_Muppets.png",
  "kobe_Nickelodeon.png",
  "kobe_Peanuts.png",
  "kobe_Pixar_Animation_Studios.png",
  "kobe_Realistic.png",
  "kobe_Ren_and_Stimpy.png",
  "kobe_Rick_and_Morty.png",
  "kobe_Roblox.png",
  "kobe_Rubber_Hose.png",
  "kobe_Rugrats.png",
  "kobe_Scooby_Doo.png",
  "kobe_Simpson.png",
  "kobe_Snoopy.png",
  "kobe_Soft_Plush_Toy.png",
  "kobe_South_Park.png",
  "kobe_SpongeBob.png",
  "kobe_Steampunk.png",
  "kobe_Steven_Universe.png",
  "kobe_Stop_Motion.png",
  "kobe_Teen_Titans.png",
  "kobe_UPA.png",
  "kobe_Vector_Art.png",
];

function filenameToTitle(filename) {
  const withoutExt = filename.replace(/\.[^/.]+$/, "");
  const withoutPrefix = withoutExt.replace(/^kobe_?/i, "");
  const cleaned = withoutPrefix.replace(/_/g, " ");
  return cleaned.length ? cleaned : "Kobe";
}

function createCard(filename, onClick, options = {}) {
  const title = filenameToTitle(filename);
  const li = document.createElement("li");
  li.className = "card";
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  img.src = IMAGE_BASE + filename;
  img.loading = "lazy";
  img.alt = title;
  img.decoding = "async";
  img.addEventListener("click", () => onClick?.(filename, title));
  const caption = document.createElement("figcaption");
  caption.textContent = title;
  figure.appendChild(img);
  figure.appendChild(caption);
  li.appendChild(figure);

  if (options.isOriginal) {
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = "Original";
    li.appendChild(badge);
  }
  return li;
}

// hero removed

function renderHighlights(files, filterText = "") {
  const ul = document.getElementById("highlights");
  ul.innerHTML = "";
  const normalized = filterText.trim().toLowerCase();
  const list = normalized
    ? files.filter((f) => filenameToTitle(f).toLowerCase().includes(normalized))
    : files;
  const fragment = document.createDocumentFragment();
  for (const f of list) {
    const isOriginal = f === ORIGINAL_IMAGE;
    fragment.appendChild(createCard(f, openLightbox, { isOriginal }));
  }
  ul.appendChild(fragment);
}

function renderRest(files, filterText = "") {
  const ul = document.getElementById("rest");
  ul.innerHTML = "";
  const normalized = filterText.trim().toLowerCase();
  const list = normalized
    ? files.filter((f) => filenameToTitle(f).toLowerCase().includes(normalized))
    : files;
  const fragment = document.createDocumentFragment();
  for (const f of list) fragment.appendChild(createCard(f, openLightbox));
  ul.appendChild(fragment);
}

// Lightbox logic
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");

function openLightbox(src, caption) {
  lightboxImg.src = IMAGE_BASE + src;
  lightboxImg.alt = caption;
  lightboxCaption.textContent = caption;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
}
function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  setTimeout(() => (lightboxImg.src = ""), 150);
}
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
lightboxClose.addEventListener("click", closeLightbox);
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && lightbox.classList.contains("open")) closeLightbox(); });

async function init() {
  try {
    const res = await fetch(MANIFEST_URL, { cache: "no-store" });
    if (res.ok) {
      const files = await res.json();
      if (Array.isArray(files) && files.length) imageFiles = files;
    }
  } catch {}

  // Build sets
  const set = new Set(imageFiles);
  let availableHighlights = HIGHLIGHTS.filter((h) => set.has(h));
  // Prepend original to highlights if present, ensuring no duplicates
  if (set.has(ORIGINAL_IMAGE)) {
    availableHighlights = [ORIGINAL_IMAGE, ...availableHighlights.filter((f) => f !== ORIGINAL_IMAGE)];
  }
  // Exclude highlights (including original) from the rest
  const rest = imageFiles.filter((f) => !availableHighlights.includes(f));

  // Render sections
  renderHighlights(availableHighlights, "");
  renderRest(rest, "");

  // Wire up search to filter both highlights and rest
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", (e) => {
    const q = e.target.value;
    renderHighlights(availableHighlights, q);
    renderRest(rest, q);
  });
}

init();

