// List of image files to include in the gallery (fallback if manifest fetch fails).
// Using only files that start with "kobe" (plus the base kobe.jpg).
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

function createCard(filename) {
  const title = filenameToTitle(filename);
  const li = document.createElement("li");
  li.className = "card";

  const figure = document.createElement("figure");

  // Thumbnail wrapper to allow overlay badges
  const thumb = document.createElement("div");
  thumb.className = "thumb";

  const img = document.createElement("img");
  img.src = filename;
  img.loading = "lazy";
  img.alt = title;
  img.decoding = "async";
  img.addEventListener("click", () => openLightbox(filename, title));
  thumb.appendChild(img);

  // Add a small tag for the original source image
  if (filename.toLowerCase() === "kobe.jpg") {
    const badge = document.createElement("span");
    badge.className = "badge badge-original";
    badge.textContent = "Original";
    badge.title = "Original source image";
    thumb.appendChild(badge);
  }

  const caption = document.createElement("figcaption");
  caption.textContent = title;

  figure.appendChild(thumb);
  figure.appendChild(caption);
  li.appendChild(figure);
  return li;
}

function renderGallery(filterText = "") {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  const normalized = filterText.trim().toLowerCase();
  const files = normalized
    ? imageFiles.filter((f) => filenameToTitle(f).toLowerCase().includes(normalized))
    : imageFiles;

  const fragment = document.createDocumentFragment();
  for (const file of files) fragment.appendChild(createCard(file));
  gallery.appendChild(fragment);
}

// Try to load a manifest of images if served over HTTP. If it fails (e.g., file://),
// we keep using the fallback list above.
async function tryLoadManifestAndRender() {
  // Initial render with fallback so the page feels instant
  renderGallery();
  try {
    const res = await fetch("images.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch images.json");
    const files = await res.json();
    if (Array.isArray(files) && files.length) {
      imageFiles = files;
      renderGallery((document.getElementById("searchInput").value || ""));
    }
  } catch (err) {
    // Silently ignore; fallback list is already rendered.
  }
}

// Lightbox logic
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");

function openLightbox(src, caption) {
  lightboxImg.src = src;
  lightboxImg.alt = caption;
  lightboxCaption.textContent = caption;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  // Defer clearing src to allow transition (if any)
  setTimeout(() => (lightboxImg.src = ""), 150);
}

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
lightboxClose.addEventListener("click", closeLightbox);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
});

// Search
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", (e) => renderGallery(e.target.value));

// Initial render + manifest load
tryLoadManifestAndRender();

