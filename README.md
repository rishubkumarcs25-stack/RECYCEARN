# Recyearn / RecycEarn — Local presentation guide

This is the complete React + Vite source-code project. Open it in VS Code and run it on localhost for your presentation.

## Before you start
Install these two tools on the presentation laptop:
1. **Node.js (LTS):** https://nodejs.org/
2. **Visual Studio Code:** https://code.visualstudio.com/

After installing Node.js, close and reopen VS Code.

## Open the project in VS Code
1. If you received a zip: right-click it → **Extract All** (or open it with 7-Zip / WinRAR → Extract). If you cloned from GitHub, skip this step.
2. Open VS Code.
3. Choose **File → Open Folder**.
4. Select the extracted `Recyearn` folder (the folder containing `package.json`).
5. In VS Code, choose **Terminal → New Terminal**.

## Run on localhost
In the VS Code terminal, run these commands one at a time:

```bash
npm install
npm run dev
```

Wait for Vite to show a local address, usually `http://localhost:5173/`.
Hold **Ctrl** and click that address, or copy it into Chrome.

Keep the terminal running while presenting. To stop the website, click the terminal and press **Ctrl + C**.

## Quick start on Windows
You can also double-click `START-LOCALHOST-WINDOWS.bat` after extracting the folder. It installs dependencies if needed and starts the local development server. Keep its window open during the demo.

## Push to GitHub (from VS Code)
1. Create an empty repository on https://github.com/new (no README, no .gitignore).
2. In the VS Code terminal, inside the `Recyearn` folder:

```bash
git init
git add .
git commit -m "Recyearn / RecycEarn initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

`node_modules/` is excluded by `.gitignore`. Anyone who clones the repo just runs `npm install` and `npm run dev`.

## Demo accounts
| Area | Email | Password |
|---|---|---|
| Customer | customer@recycearn.in | demo123 |
| Agent | agent@recycearn.in | demo123 |
| Admin | admin@recycearn.in | admin123 |

Use the app's login page to switch between the three roles. For a clean repeatable demo, use **Reset demo data** in the sidebar if available.

## Important notes
- The app uses demo/mock data stored in this browser's local storage; it does not require a backend or login to an external service.
- The source code is included in `src/` and the project configuration files are included at the project root.
- `localhost` is available only on the computer running the server. Your teacher should open the URL on that same laptop.
- Do not close the terminal until the presentation is finished.
