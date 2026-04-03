import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";

// -------------------------
// helpers
// -------------------------
const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);

// 🔹 agora o ref depende do slug
function getRef(slug = "geral") {
  return doc(db, "siteSettings", slug);
}

// -------------------------
// deep merge (mantém igual)
// -------------------------
export function deepMerge(base, incoming) {
  if (Array.isArray(base)) return Array.isArray(incoming) ? incoming : base;
  if (!isObj(base)) return incoming ?? base;

  const out = { ...base };
  if (!isObj(incoming)) return out;

  for (const key of Object.keys(incoming)) {
    const a = base[key];
    const b = incoming[key];

    if (Array.isArray(a) && Array.isArray(b)) out[key] = b;
    else if (isObj(a) && isObj(b)) out[key] = deepMerge(a, b);
    else out[key] = b;
  }
  return out;
}

// -------------------------
// fetch por slug
// -------------------------
export async function fetchLandingContent(slug = "geral") {
  const snap = await getDoc(getRef(slug));
  return snap.exists() ? snap.data() : null;
}

// -------------------------
// save por slug
// -------------------------
export async function saveLandingContent(slug = "geral", data) {
  await setDoc(
    getRef(slug),
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
