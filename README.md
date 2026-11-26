# Dare-To-Dream

An anonymous, real-time peer-matching chat for university students. Students say how they feel (Lonely, Sad, Anxious, Stressed, or just want to talk) and are matched in real time with another student who feels the same way. No signup or login is needed.

Built for Rwandan university students, where counselors are overloaded and stigma stops many students from asking for help.

- **Live app:** [https://dare-to-dream-seven.vercel.app/]
- **Demo video:** [https://drive.google.com/file/d/18YCXBWdqe6CrkEhUau9mXJ6uO-BcN9AD/view?usp=sharing]
- **SRS (v0.4):** [(https://docs.google.com/document/d/1UAUnQA7F9gApYwkbKKLTENfL1eVfPNi-UYXQZVjcjKY/edit?usp=sharing)]

## Features

- Anonymous use: no signup or login
- Onboarding preferences ("What should we avoid?": talking a lot, being asked lots of questions, boring small talk)
- Optional profile: name, age, hobbies/interests
- Feeling check-in (Lonely, Sad, Anxious, Stressed, Just want to talk) with an optional note
- Real-time matching with another user who feels the same way
- Real-time one-to-one chat
- Notifications
- Crisis language detection that shows help resources

Features planned for later (mood tracker, offline journaling, coping exercises, counselor dashboard, accounts, Kinyarwanda localization) are listed in Section 6 of the SRS.

## Tech stack

| Part | Technology |
|---|---|
| Front end | React + Vite (JavaScript) |
| Back end | Python (Flask) |
| Database / real-time | Firebase Firestore |
| Hosting | Vercel (front end)  Render |

## Project structure

```
Dare-To-Dream/
  public/             static files
  src/                React source code
  index.html          app entry page
  package.json        front-end dependencies and scripts
  vite.config.js      Vite configuration
  requirements.txt    Python (Flask) dependencies
  start_backend.sh    script that starts the Flask back end
  cors.json           CORS configuration
  eslint.config.js    lint rules
```

## Prerequisites

Install these first:

1. **Git**: https://git-scm.com/downloads
2. **Node.js 18 or newer** (includes npm): https://nodejs.org
3. **Python 3.9 or newer** (with pip): https://www.python.org/downloads
4. A **Firebase project** with Firestore enabled: https://console.firebase.google.com

Check your versions:

```bash
git --version
node --version
npm --version
python3 --version
```

## Setup: run the project locally

### 1. Clone the repository

```bash
git clone https://github.com/Hparadis/Dare-To-Dream.git
cd Dare-To-Dream
```

### 2. Create a Firebase project (one time)

1. Go to the Firebase console and click **Add project**.
2. In the project, open **Build, then Firestore Database** and click **Create database** (start in test mode for local development).
3. Open **Project settings, then General**, scroll to **Your apps**, click the web icon (`</>`), register an app, and copy the config values (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId).

### 3. Set up the front end

Install dependencies:

```bash
npm install
```

Create a file named `.env` in the project root (same folder as `package.json`) and paste your Firebase values. **Never commit this file.** It is already in `.gitignore`.

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=http://localhost:5000
```

> The variable names above must match the ones used in `src/` (search for `import.meta.env`). If your code uses different names, use those instead.

### 4. Set up the back end (Flask)

Create and activate a virtual environment, then install the dependencies.

macOS / Linux:

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Windows (PowerShell):

```powershell
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

If the back end needs a Firebase service-account key: in the Firebase console open **Project settings, then Service accounts, then Generate new private key**, save the JSON file somewhere outside the repository, and set the path in your environment (for example `GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json`). **Never commit this key.**

### 5. Start the back end

```bash
bash start_backend.sh
```

The API starts on http://localhost:5000 (check the output for the exact port).

### 6. Start the front end

Open a **second terminal** in the project folder and run:

```bash
npm run dev
```

Open the address shown in the terminal (usually http://localhost:5173).

## How to try it (matching needs two users)

Matching pairs two people, so you need two sessions:

1. Open the app in a normal browser window.
2. Open it again in an **Incognito/Private window** (or on your phone).
3. In each window, complete the onboarding and choose the **same feeling** (for example "Anxious").
4. Both windows are matched and can chat in real time.
5. Type a crisis-related phrase in the chat to see the crisis/help resources appear.

## Build for production

```bash
npm run build
npm run preview
```

## Deployment

- **Front end:** connected to Vercel; every push to `main` deploys automatically. Add the same `VITE_...` variables under **Vercel, Project Settings, Environment Variables**.
- **Back end:** deployed on render.

## Troubleshooting

| Problem | Fix |
|---|---|
| `npm install` fails | Update Node.js to version 18 or newer. |
| Blank page or Firebase errors | Check that every `VITE_FIREBASE_...` value in `.env` is correct, then restart `npm run dev`. |
| Chat or matching does not work locally | Make sure the Flask back end is running and `VITE_API_URL` points to it. |
| CORS error in the browser console | Check `cors.json` and that the front-end address is allowed. |
| `pip` says "externally managed environment" | Use the virtual environment from step 4. |

## Known limitations

- Messages are protected in transit (HTTPS) but are not end-to-end encrypted.
- Matching needs at least two users online at the same time.
- crisis-detection system might miss some words

## Development process

Built with Agile/Scrum in sprints reviewed with student testers: Sprint 0 discovery interviews, then iterative prototype sprints. Work is done on feature branches and merged into `main` through pull requests.

## Contributors

- Hirwa Paradis Cesar ([@Hparadis](https://github.com/Hparadis))
- Paradis007-bit

## License

MIT License. See the [LICENSE](LICENSE) file.

## Important note

Dare-To-Dream is a peer-support tool. It is not a substitute for professional or emergency care. If you or someone you know is in danger, contact local emergency services or a mental health professional right away.
