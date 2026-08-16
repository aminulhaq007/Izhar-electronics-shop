import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { getFirestore, collection, addDoc, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, getDoc } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-storage.js";
import { firebaseConfig } from "./firebase-config.js";

const ready = !Object.values(firebaseConfig).some(value => String(value).includes("YOUR_"));
const loginPanel = document.querySelector("#loginPanel");
const dashboard = document.querySelector("#dashboard");
const loginForm = document.querySelector("#loginForm");
const loginMessage = document.querySelector("#loginMessage");
const fileInput = document.querySelector("#fileInput");
const adminGallery = document.querySelector("#adminGallery");
const adminEmpty = document.querySelector("#adminEmpty");
const countBadge = document.querySelector("#countBadge");
const modal = document.querySelector("#warningModal");
let pendingDelete = null;
let unsubscribe = null;

function message(text, type="") { loginMessage.textContent = text; loginMessage.className = `admin-message ${type}`; }
function formatBytes(bytes) { if (!bytes) return "0 B"; const units=["B","KB","MB","GB"]; const i=Math.floor(Math.log(bytes)/Math.log(1024)); return `${(bytes/Math.pow(1024,i)).toFixed(i ? 1 : 0)} ${units[i]}`; }
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c])); }

if (!ready) {
  message("Firebase is not connected yet. Open README.md and complete the Firebase setup first.", "error");
} else {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);

  loginForm.addEventListener("submit", async event => {
    event.preventDefault();
    message("Signing in…");
    try {
      await signInWithEmailAndPassword(auth, document.querySelector("#email").value.trim(), document.querySelector("#password").value);
    } catch (error) {
      message("Sign in failed. Check the owner email/password and Firebase Authentication settings.", "error");
    }
  });

  onAuthStateChanged(auth, async user => {
    if (!user) { loginPanel.classList.remove("hidden"); dashboard.classList.add("hidden"); return; }
    try {
      const adminDoc = await getDoc(doc(db, "admins", user.uid));
      if (!adminDoc.exists() || adminDoc.data().role !== "admin") {
        await signOut(auth);
        message("This account is not authorized as the website owner.", "error");
        return;
      }
      loginPanel.classList.add("hidden"); dashboard.classList.remove("hidden"); message(""); listenGallery();
    } catch (error) {
      await signOut(auth);
      message("Admin verification failed. Make sure your UID exists in Firestore /admins with role=admin.", "error");
    }
  });

  document.querySelector("#logoutBtn").addEventListener("click", () => signOut(auth));

  function listenGallery() {
    if (unsubscribe) unsubscribe();
    const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
    unsubscribe = onSnapshot(q, snapshot => {
      const items = snapshot.docs.map(d => ({ id:d.id, ...d.data() }));
      countBadge.textContent = `${items.length} item${items.length===1?"":"s"}`;
      adminEmpty.classList.toggle("hidden", items.length > 0);
      adminGallery.innerHTML = items.map(item => {
        const media = item.kind === "video" ? `<video src="${item.url}" controls preload="metadata" playsinline></video>` : `<img src="${item.url}" alt="${escapeHtml(item.title || "Project")}">`;
        return `<article class="admin-media"><div class="admin-media-preview">${media}</div><div class="admin-media-info"><div><b>${escapeHtml(item.title || "Izhar Electronics Project")}</b><small>${item.kind === "video" ? "VIDEO" : "PHOTO"} • ${formatBytes(item.size || 0)}</small></div><button class="delete-btn" data-id="${item.id}" data-path="${escapeHtml(item.path || "")}" data-title="${escapeHtml(item.title || "this project")}">Remove</button></div></article>`;
      }).join("");
      adminGallery.querySelectorAll(".delete-btn").forEach(button => button.addEventListener("click", () => openDelete(button.dataset)));
    });
  }

  fileInput.addEventListener("change", async event => {
    const files = [...event.target.files];
    if (!files.length) return;
    for (const file of files) await uploadFile(file);
    fileInput.value = "";
  });

  async function uploadFile(file) {
    if (!(file.type.startsWith("image/") || file.type.startsWith("video/"))) return alert("Only image and video files are allowed.");
    const maxSize = file.type.startsWith("video/") ? 100 * 1024 * 1024 : 15 * 1024 * 1024;
    if (file.size > maxSize) return alert(`This file is too large. Maximum is ${file.type.startsWith("video/") ? "100 MB" : "15 MB"}.`);
    const title = prompt("Project title (optional):", file.name.replace(/\.[^/.]+$/, "").replace(/[_-]+/g," ")) || "Izhar Electronics Project";
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g,"-");
    const path = `gallery/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
    const storageRef = ref(storage, path);
    const progressWrap = document.querySelector("#uploadProgress");
    const bar = document.querySelector("#progressBar");
    const text = document.querySelector("#progressText");
    progressWrap.classList.remove("hidden");
    return new Promise((resolve, reject) => {
      const task = uploadBytesResumable(storageRef, file, { contentType: file.type, customMetadata: { title } });
      task.on("state_changed", snap => { const pct = Math.round(snap.bytesTransferred / snap.totalBytes * 100); bar.style.width = `${pct}%`; text.textContent = `Uploading ${file.name} — ${pct}%`; }, error => { text.textContent = "Upload failed."; alert("Upload failed. Check your Firebase Storage rules and quota."); reject(error); }, async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          await addDoc(collection(db, "gallery"), { title, url, path, kind: file.type.startsWith("video/") ? "video" : "image", size: file.size, contentType: file.type, createdAt: serverTimestamp() });
          text.textContent = `${file.name} uploaded successfully.`; bar.style.width = "100%"; resolve();
        } catch (error) { alert("The file uploaded, but its gallery record could not be saved."); reject(error); }
      });
    });
  }

  function openDelete(data) { pendingDelete = data; modal.classList.remove("hidden"); }
  document.querySelector("#cancelDelete").addEventListener("click", () => { pendingDelete=null; modal.classList.add("hidden"); });
  document.querySelector("#confirmDelete").addEventListener("click", async () => {
    if (!pendingDelete) return;
    const data = pendingDelete; modal.classList.add("hidden"); pendingDelete=null;
    try {
      if (data.path) await deleteObject(ref(storage, data.path));
      await deleteDoc(doc(db, "gallery", data.id));
    } catch (error) { alert("The item could not be removed. Check your Firebase rules and try again."); }
  });
}
