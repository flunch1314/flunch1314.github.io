const MANIFEST_URL = "https://raw.githubusercontent.com/flunch1314/flunch1314.github.io/main/images.json";
const IMAGE_BASE = "https://raw.githubusercontent.com/flunch1314/flunch1314.github.io/main/";

function filenameToTitle(filename) {
  const withoutExt = filename.replace(/\.[^/.]+$/, "");
  const withoutPrefix = withoutExt.replace(/^kobe_?/i, "");
  const cleaned = withoutPrefix.replace(/_/g, " ");
  return cleaned.length ? cleaned : "Kobe";
}

function createPreviewItem(filename) {
  const li = document.createElement("li");
  const img = document.createElement("img");
  img.loading = "lazy";
  img.decoding = "async";
  img.alt = filenameToTitle(filename);
  img.src = IMAGE_BASE + filename;
  li.appendChild(img);
  return li;
}

async function initHome() {
  let files = [];
  try {
    const res = await fetch(MANIFEST_URL, { cache: "no-store" });
    if (res.ok) files = await res.json();
  } catch {}
  if (!Array.isArray(files) || files.length === 0) return;

  // Pick a small preview set: original + 7 highlights if available
  const set = new Set(files);
  const picks = [];
  if (set.has("kobe.jpg")) picks.push("kobe.jpg");

  const preferred = [
    "kobe_LEGO.png",
    "kobe_Simpson.png",
    "kobe_Steampunk.png",
    "kobe_Caricature.png",
    "kobe_GTA.png",
    "kobe_Rubber_Hose.png",
    "kobe_Peanuts.png",
    "kobe_SpongeBob.png",
  ].filter((f) => set.has(f));

  for (const f of preferred) {
    if (picks.length >= 8) break;
    picks.push(f);
  }
  // Fill with any remaining if less than 8
  for (const f of files) {
    if (picks.length >= 8) break;
    if (!picks.includes(f)) picks.push(f);
  }

  const ul = document.getElementById("preview");
  const fragment = document.createDocumentFragment();
  for (const f of picks) fragment.appendChild(createPreviewItem(f));
  ul.appendChild(fragment);
}

initHome();

