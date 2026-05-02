# smile.ai — ICT & Telecom Learning Assistant

An AI-powered learning app for ICT and Telecom students, built with Claude AI.

## Project Structure

```
smile-ai/
├── public/
│   └── index.html      ← Frontend (the app UI)
├── api/
│   └── chat.js         ← Backend (keeps your API key secret)
├── vercel.json         ← Deployment configuration
└── README.md
```

## Deploy to Vercel (Step by Step)

### 1. Create a GitHub account
- Go to https://github.com and sign up free

### 2. Create a new repository
- Click the "+" button → "New repository"
- Name it: `smile-ai`
- Keep it public
- Click "Create repository"

### 3. Upload your files
- Click "uploading an existing file"
- Drag and drop ALL files from this folder (keeping the folder structure)
- Click "Commit changes"

### 4. Deploy on Vercel
- Go to https://vercel.com
- Sign up with your GitHub account
- Click "Add New Project"
- Select your `smile-ai` repository
- Click "Deploy"

### 5. Add your API Key (IMPORTANT)
- In Vercel, go to your project → Settings → Environment Variables
- Add a new variable:
  - Name: `ANTHROPIC_API_KEY`
  - Value: your key from https://console.anthropic.com
- Click "Save"
- Go to Deployments → click the 3 dots → "Redeploy"

### 6. Connect your smile.ai domain
- In Vercel → Settings → Domains
- Add your domain: `smile.ai` or `www.smile.ai`
- Vercel will show you DNS records to add
- Go to your domain registrar and add those records
- Wait 10-30 minutes for it to go live!

## Get your Anthropic API Key
1. Go to https://console.anthropic.com
2. Sign up / log in
3. Go to "API Keys" → "Create Key"
4. Copy the key and add it to Vercel (step 5 above)

## That's it! 🎉
Your smile.ai app will be live at your domain.
