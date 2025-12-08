@echo off
cd /d D:\code\e-lapor-kab-kupang
if not exist "app\api\settings" mkdir "app\api\settings"
if not exist "app\(admin)\adm\settings" mkdir "app\(admin)\adm\settings"
echo Directories created successfully!
echo.
echo Now running node setup script...
node setup-settings.js
pause
