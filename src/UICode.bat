@echo off
mkdir UICodeApp
mkdir UICodeApp\src
mkdir UICodeApp\src\api
echo. > UICodeApp\src\api\fileOps.ts
echo. > UICodeApp\src\api\gitCommands.ts
echo. > UICodeApp\src\api\sessionManager.ts
echo. > UICodeApp\src\api\auth.ts
mkdir UICodeApp\src\api\views
echo. > UICodeApp\src\api\views\fileOps.ejs
echo. > UICodeApp\src\api\views\gitCommands.ejs
echo. > UICodeApp\src\api\views\auth.ejs
mkdir UICodeApp\src\config
echo. > UICodeApp\src\config\dbConfig.ts
echo. > UICodeApp\src\config\serverConfig.ts
echo. > UICodeApp\src\config\oauthConfig.ts
mkdir UICodeApp\src\config\views
echo. > UICodeApp\src\config\views\dbConfig.ejs
echo. > UICodeApp\src\config\views\serverConfig.ejs
echo. > UICodeApp\src\config\views\oauthConfig.ejs
mkdir UICodeApp\src\models
echo. > UICodeApp\src\models\user.ts
echo. > UICodeApp\src\models\file.ts
echo. > UICodeApp\src\models\gitSession.ts
mkdir UICodeApp\src\models\views
echo. > UICodeApp\src\models\views\user.ejs
echo. > UICodeApp\src\models\views\file.ejs
echo. > UICodeApp\src\models\views\gitSession.ejs
mkdir UICodeApp\src\utils
echo. > UICodeApp\src\utils\errorHandler.ts
echo. > UICodeApp\src\utils\logger.ts
echo. > UICodeApp\src\utils\validator.ts
mkdir UICodeApp\src\common
echo. > UICodeApp\src\common\header.ejs
echo. > UICodeApp\src\common\footer.ejs
echo. > UICodeApp\src\common\navbar.ejs
echo. > UICodeApp\src\app.ts
mkdir UICodeApp\public
echo. > UICodeApp\.env
echo. > UICodeApp\tsconfig.json
echo. > UICodeApp\package.json
