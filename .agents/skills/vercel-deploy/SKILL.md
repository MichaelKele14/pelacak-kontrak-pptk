---
name: vercel-deploy
description: >-
  Deploy web applications, manage environment variables, inspect build logs, and link projects directly via the Vercel CLI. Use when the user requests to deploy, inspect Vercel deployments, or sync environment variables.
---

# Vercel Deployment Skill

This skill allows the agent to deploy applications and manage deployments directly using the authenticated Vercel CLI (`VERCEL_TOKEN`).

## Common Commands

### 1. Deploy to Production
To trigger an immediate production deployment:
```powershell
vercel --prod --yes
```

### 2. Deploy Preview (Staging)
To deploy a preview branch or test URL:
```powershell
vercel --yes
```

### 3. Link Existing Vercel Project
To connect the current local repository to a Vercel project:
```powershell
vercel link --yes
```

### 4. Pull Environment Variables
To download remote project environment variables to a local `.env.local`:
```powershell
vercel env pull .env.local
```

### 5. Inspect Realtime Deployment Logs
To stream or inspect build errors and function runtime logs:
```powershell
vercel logs <deployment-url>
```
