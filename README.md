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

---

# DesignGate ICT — Design Review MVP (`design-review.html`)

Phase-gated design review for telecom/ICT engineering documents. Static page, no backend, no API key. Open `design-review.html` in a browser.

| Phase | Review depth | Gate threshold | Phase-specific tool |
|---|---|---|---|
| 1 Scoping (DBSP) | High-level | 70% | TR-per-floor-area rule (TIA-569) |
| 2 Proposal | Light, high-level | 75% | 90 m reach / estimate-class rules |
| 3 Detailed design | Detailed | 85% | Fibre loss budget (TIA-568.3 vs IEEE 802.3) |
| 4 Construction | Civils, catalogue, integration | 90% | Product catalogue match table |
| 5 Closeout | All items must be Yes | 100% | Punch list tracker |

Outputs per phase: weighted score (Critical 5 / Major 3 / Minor 1), coverage, decision code
(A Approved · B Approved as noted · C Revise & resubmit · Review incomplete), and a numbered comment
register typed **Command** (shall), **Highlight** (risk) or **Recommendation** (should), copyable to Excel.

Learning loop (rules-based, stored in browser `localStorage`): lessons-learned checks per phase,
Useful/Not-useful rating per comment, review snapshots with score trend and top recurring findings,
JSON export/import to share the knowledge base.

Standards are cited by document name without edition; confirm the edition adopted by the AHJ/contract.
