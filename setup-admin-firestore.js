import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Try to load service account - if not available, use credentials from environment
let credentials;

try {
  // Try loading from file first
  const credPath = path.join(__dirname, "firebase-key.json");
  if (fs.existsSync(credPath)) {
    credentials = JSON.parse(fs.readFileSync(credPath, "utf-8"));
  } else {
    // Fallback: create from Firebase CLI authenticated session
    console.log("📝 Using Firebase CLI authenticated session...\n");
  }
} catch (e) {
  console.log("📝 Using Firebase CLI authenticated session...\n");
}

// Initialize Firebase Admin
if (credentials) {
  admin.initializeApp({
    credential: admin.credential.cert(credentials),
    projectId: "qiyas-5da06",
  });
} else {
  // Use application default credentials from Firebase CLI login
  admin.initializeApp({
    projectId: "qiyas-5da06",
  });
}

const db = admin.firestore();

async function createAdmin() {
  try {
    const uid = "VLr9B3Yc1GOqgox3A7uptwGWOwH3";
    const email = "admin@qiyas.local";

    console.log("🔧 Setting up admin user in Firestore...\n");

    // Check if already exists
    const docRef = db.collection("admins").doc(uid);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      console.log("⚠️  Admin user already exists! Updating...\n");
    }

    // Create or update admin document
    await docRef.set({
      email: email,
      role: "super_admin",
      isActive: true,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    });

    console.log("✅ Admin user created successfully!\n");
    console.log("📧 Credentials:");
    console.log(`   Email: ${email}`);
    console.log(`   Password: (the one you set in Firebase Auth)`);
    console.log(`   Role: super_admin`);
    console.log(`   Status: Active\n`);
    console.log("🚀 You can now login at: /admin/login\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

createAdmin();
