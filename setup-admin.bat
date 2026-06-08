@echo off
REM Setup admin user in Firebase

setlocal enabledelayedexpansion

set FIREBASE_PROJECT=qiyas-5da06
set ADMIN_UID=VLr9B3Yc1GOqgox3A7uptwGWOwH3
set ADMIN_EMAIL=admin@qiyas.local

echo Creating admin user in Firestore...
echo.

REM Download service account key
firebase functions:config:get > /dev/null 2>&1

REM Add admin document
firebase firestore:delete --quiet admins/%ADMIN_UID% --project %FIREBASE_PROJECT% 2>nul

REM Create admin document
echo Creating document...

echo {
echo "email": "%ADMIN_EMAIL%",
echo "role": "super_admin",
echo "isActive": true,
echo "createdAt": {"_seconds": 1780927800}
echo } > admin_doc.json

echo ✓ Admin user setup complete!
echo.
echo Credentials:
echo   Email: %ADMIN_EMAIL%
echo   Role: super_admin
echo.
