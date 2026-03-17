# VAMS ELD Project Context
You are working on the **Valor Academy Middle School (VAMS) ELD Database & AI Application**. 
- **Domain**: California English Language Development (ELD) standards, tracking, and education.
- **Key Feature**: AI-powered application that automatically generates and applies linguistic scaffolds to student assignments based on their ELD levels.
- **Tech Stack**: Next.js (React), Tailwind CSS, Supabase (SQL DB/Auth). 

# Agent Tool & Skill Guidelines
To conserve token context, do **not** load all skills at once. Use `.claude/skills/<skill-name>/SKILL.md` to load specific instructions only when the task requires it. 

## Skill Index (Switchboard)
Categorized mapping of tools in `.claude/skills/`:

### 🏗️ Build & Dev
- `building-with-claude` / `building-openclaw`: General build guidelines
- `gsd-frontend` / `gsd-swiftui`: Frontend dev & styling
- `gsd-debug-expert` / `handling-errors`: Deep debugging & error resolution
- `supabase-sql`: Database schema, RLS, and queries
- `gstack` / `gstack-upgrade`: Tech stack and dependencies
- `setup-browser-cookies`: Web scraping / auth preparation

### 🎨 Design & Content
- `brand-identity`: Valor Academy/ELD visual guidelines and tone
- `design-consultation` / `excalidraw-diagram`: UI/UX design operations
- `humanizing-text`: AI text generation tuning (crucial for ELD scaffolds)
- `communicating-classvox`: Communication norms

### 🔎 Planning & QA
- `plan-ceo-review` / `plan-design-review` / `plan-eng-review`: Task planning phases
- `qa` / `qa-design-review` / `qa-only` / `gsd-test`: Testing & QA workflows
- `review` / `gsd-review` / `gsd-lint`: Code review & linting
- `retro`: Sprint/task retrospectives

### 🚀 Git, CLI & Deployment
- `managing-git-workflow` / `gsd-github`: Source control & PRs
- `cli-anything` / `browse` / `searching-tavily`: Web & terminal execution
- `ship` / `document-release`: Deployment and release notes

### 🤖 Agentic Operations
- `finding-skills` / `creating-skills`: Expanding agent capabilities
- `acting-proactively` / `improving-self`: Autonomous operation heuristics
- `managing-obsidian` / `managing-telegram` / `managing-google-workspace`: External integrations

# Workflow Directives
1. **Analyze**: Understand the ELD educational context before writing AI scaffolds.
2. **Select**: Identify the 1-2 skills needed from the index above.
3. **Load**: Read the specific `.claude/skills/<skill_name>/SKILL.md` file explicitly.
4. **Execute**: Implement efficiently, minimizing conversational verbosity.
