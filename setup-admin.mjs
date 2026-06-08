import admin from "firebase-admin";
import serviceAccount from "./firebase-key.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "qiyas-5da06",
});

const db = admin.firestore();

async function setupAdmin() {
  try {
    const uid = "VLr9B3Yc1GOqgox3A7uptwGWOwH3";
    const email = "admin@qiyas.local";

    console.log(`Creating admin user...`);

    // Add admin document
    await db.collection("admins").doc(uid).set({
      email,
      role: "super_admin",
      isActive: true,
      createdAt: new Date().toISOString(),
    });

    console.log(`✅ Admin user created successfully!`);
    console.log(`   Email: ${email}`);
    console.log(`   Role: super_admin`);
    console.log(`   UID: ${uid}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

setupAdmin();
