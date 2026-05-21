# Project Spine v1 Apps Subproject Application: flashcard-e

Date: 2026-05-21
Operator: Janus / Hermes

## Result

Moved `/Users/0xozen/Others/FlashCard-E` to `/Users/0xozen/Projects/apps/subprojects/flashcard-e` and added Project Spine v1 anchors.

## Final canonical path

`/Users/0xozen/Projects/apps/subprojects/flashcard-e`

## Move

- Source before move: `/Users/0xozen/Others/FlashCard-E`
- Destination after move: `/Users/0xozen/Projects/apps/subprojects/flashcard-e`
- Source exists after move: no
- Destination exists after move: yes

## Anchors added or preserved

Created or confirmed:
- `PROJECT.md`
- `AGENTS.md`
- `project.yaml`
- `ops/README.md`
- `ops/TODO.md`
- `ops/STATUS.md`
- `ops/ROADMAP.md`
- `ops/DECISIONS.md`
- `ops/RUNBOOK.md`
- `docs/README.md`
- `evidence/README.md`
- `state/README.md`
- `archive/README.md`
- `subprojects/README.md`
- `README.md append: Project Spine v1 Location`

Skipped because already present:
- none

## Nested Git state

Branch: `main`
Remote:

```text
origin	https://github.com/0xOzen/Flashcard.git (fetch)
origin	https://github.com/0xOzen/Flashcard.git (push)
```

Current status after move and spine anchor writes:

```text
M README.md
 M index.html
 M public/manifest.webmanifest
 M public/sw.js
 M server/index.mjs
 M src/App.tsx
 M src/AppContext.tsx
 M src/Flashcard.tsx
 M src/components/StudyModeShell.tsx
 M src/extendedLists.ts
 M src/grammarData.ts
 M src/index.css
 M src/lib/appState.ts
 M src/screens/Dashboard.tsx
 M src/screens/FlashcardMode.tsx
 M src/screens/GrammarHub.tsx
 M src/screens/MatchMode.tsx
 M src/screens/QuizMode.tsx
 M src/screens/WordEditorItem.tsx
 M src/screens/WriteMode.tsx
 M src/types.ts
?? AGENTS.md
?? PROJECT.md
?? archive/
?? docs/
?? evidence/
?? ops/
?? project.yaml
?? public/icons/app-icon-192.png
?? public/icons/app-icon-512.png
?? public/icons/apple-touch-icon.png
?? public/icons/favicon-32.png
?? src/data/
?? src/lib/germanLearning.ts
?? src/lib/offlineDictionary.ts
?? src/screens/ArticleFinder.tsx
?? src/screens/ContextImport.tsx
?? src/screens/RedemittelLab.tsx
?? src/screens/TextReader.tsx
?? src/screens/Translator.tsx
?? src/services/articleLookup.ts
?? src/services/germanTools.ts
?? state/
?? subprojects/
?? test-results/
?? worker/
?? wrangler.jsonc
```

Important: the repository had pre-existing modified and untracked files before the move. They were preserved. No cleanup, commit, push, PR, deploy, or publish was performed.

## Verification

```text
missing=none
yaml_id=apps.flashcard-e
yaml_anchor_todo=ops/TODO.md
source_exists=False
dest_exists=True
nested_git=True
package_json=ok
trailing_ws=none
todo_duplicate_ids=none
git_diff_check=pass
npm_run_lint=pass
npm_run_build=pass_with_vite_chunk_size_warning
test_results_ignored=True
```

## Safety boundary

External deployment, credential use, public publishing, push, PR, and destructive deletion remain approval-gated.
