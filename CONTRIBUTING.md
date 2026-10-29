# Team Contributing & Git Workflow Guide
> **KrishiMitra AI Hackathon Rules for Members 1, 2, and 3**

Welcome team! In a fast-paced 10-hour hackathon, clear file ownership is the secret to moving rapidly without merge conflicts.

---

## 🗂️ 1. File Ownership Rules (Strict!)

* **Member 1 (Team Leader):**
  * Owns: `src/core/`, `src/shared/`, root configs (`package.json`, `vite.config.js`, etc.).
  * Role: Oversees layout, navigation, shared contracts, and PR merges.
* **Member 2:**
  * Owns **ONLY**: `src/modules/market-prices/`, `src/modules/buyer-matching/`, `src/modules/net-return/`, and `src/data/mandiPrices.json`, `src/data/buyers.json`.
  * Do NOT edit `src/core/` files.
* **Member 3:**
  * Owns **ONLY**: `src/modules/crop-doctor/`, `src/modules/fpo-support/`, `src/modules/logistics/`, `src/modules/hindi-assistant/`, and `src/data/fpos.json`, `src/data/logistics.json`.
  * Do NOT edit `src/core/` files.

---

## 🌿 2. Git Branch Strategy

* `main` branch: Always clean, tested, and working. Never commit directly to `main` without checking.
* Each member works on their dedicated feature branch:
  * Member 1: `feature/core-dashboard`
  * Member 2: `feature/market-buyers-net`
  * Member 3: `feature/doctor-fpo-logistics`

---

## 🔄 3. Daily Git Workflow (Step-by-Step)

### Step A: Before starting work (Every time!)
Always pull the latest changes from `main`:
```bash
git checkout main
git pull origin main
git checkout your-feature-branch
git merge main
```

### Step B: Save work frequently (Commit small and often)
```bash
git status
git add src/modules/your-module/
git commit -m "feat(market-prices): add mandi comparison cards"
```

### Step C: Push your branch to GitHub
```bash
git push -u origin your-feature-branch
```

### Step D: Open a Pull Request (PR)
1. Go to the GitHub repository page.
2. Click **"Compare & pull request"**.
3. Team Leader (Member 1) tests and merges into `main`.

---

## ⚠️ 4. Safety & Golden Rules
1. **Never use destructive commands:** No `git push --force` or `git reset --hard`.
2. **Never commit secrets:** Keep `.env` in `.gitignore`. Use `.env.example`.
3. **Always label mock data:** Use `<SimulatedDataBadge />` on every screen.
4. **Test before pushing:** Run `npm run build` and `npm test` to verify zero errors before opening a PR.
