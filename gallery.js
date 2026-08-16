import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getFirestore, collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const firebaseReady = !Object.values(firebaseConfig).some(value => String(value).includes("YOUR_"));
const gallery = document.querySelector("#dynamicGallery");
const empty = document.querySelector("#galleryEmpty");

function render(items) {
  if (!gallery) return;
  gallery.innerHTML = "";
  empty?.classList.toggle("hidden", items.length > 0);
  items.forEach(item => {
    const card = document.createElement("article");
    card.className = "media-card";
    card.dataset.kind = item.kind || "image";
    const media = item.kind === "video"
      ? `<video src="${item.url}" controls preload="metadata" playsinline></video>`
      : `<img src="${item.url}" alt="${escapeHtml(item.title || "Izhar Electronics project")}" loading="lazy">`;
    card.innerHTML = `${media}<div class="media-caption"><span>${escapeHtml(item.title || "Izhar Electronics Project")}</span><small>${item.kind === "video" ? "PROJECT VIDEO" : "PROJECT PHOTO"}</small></div>`;
    gallery.appendChild(card);
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
}

if (firebaseReady) {
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
    onSnapshot(q, snapshot => render(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
  } catch (error) {
    console.error("Gallery connection error:", error);
  }
}
