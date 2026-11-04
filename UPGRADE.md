# Meg’s Fit upgrade — review before publishing

Implemented on branch `upgrade/ppl-pilates`, based on public main commit `077e82ab6593c12ec10ad4c70a2e9251c54c5540`. The supplied ZIP and pre-existing workspace index/sw matched that source. Nothing has been pushed or deployed.

## Changes

- Exact PULL/PUSH/LEGS program, available anytime; expandable cards retain the existing coral visual identity.
- One pounds field per exercise, per-DB labels, optional added load for bodyweight, optional single-arm pulldown, and an explicit Finish session action.
- Persisted unfinished workouts; each completed workout gets a unique ID, completion timestamp, and exercises/weights. Repeated and unchanged-weight workouts count as separate sessions.
- Lift / Pilates / Log / Activity / Ask navigation. Log deduplicates lateral raises, keeps old lifts accessible, and distinguishes new dated history from legacy weekly records. The redundant Progress screen is removed.
- One reusable 25-day Pilates checklist, Next Up, per-day check/uncheck, and confirmed Uncheck all. No explicit rounds or calendar dates. All 25 IDs/titles were retrieved from the official YouTube playlist on November 3, 2026 and checked against their numbered titles. Full original titles remain in `pilates.js`; the UI omits repetitive challenge/day prefixes.
- Original protein keypad and date-based notes retained. Standalone wrist blurb removed at review; AI wrist precautions retained. Dated phase generation and program-apply controls retired; old data/chats stay in storage.
- Credential-free JSON backup download and file/paste restore.
- Restored relative manifest and v10 service worker with a complete local offline shell and network-first updates.

## Data preservation and restore behavior

No automatic destructive migration and no localStorage clearing. `weight_*`, `wt_history`, legacy `checks_*`, loaded programs, overrides and chat history are not rewritten merely by opening the app or finishing workouts. The new `megfit_v5` key stores drafts, sessions, and Pilates checks. Existing equivalent exercise IDs supply the first prefills; different rows/curls/machines get distinct IDs. Weight history is recorded only on Finish session, never merely on displaying a prefill or toggling a check.

Restore validates supported v2/v5 data before writing. Existing legacy weights/overrides win conflicts. Session IDs deduplicate; existing unfinished workouts win conflicts; Pilates checks combine; lists and weekly records merge without identical duplicates. Protein entries merge and totals recalculate. Conflicting notes append with a restored-note label. The UI explains the merge before confirmation. API keys are ignored on restore and omitted/redacted on export. Export before restoring if you want a separate rollback copy. Restoring an older backup intentionally does not uncheck current Pilates days; use the checklist or Uncheck all to do that.

The supplied private backup was used only in an in-memory local test. It and its credentials are not included in the source, ZIP, patch, or test fixtures. Local preview contains synthetic test records; it is a different origin from the iPhone app.

## Validation

Run from this checkout:

```sh
node --test tests/*.test.cjs
```

Twenty-one automated tests cover exact workout counts/identity distinctions, playlist endpoints and uniqueness, legacy prefills without historical writes, optional skip, bodyweight, reload/undo, same-week repeated sessions, unchanged and changed weights, duplicate finish protection, log rendering, Pilates completion/reset/persistence, credential exclusion, idempotent restore, malformed backup rejection, protein, AI request success/error mocks, failed storage writes, HTML escaping, and service-worker install/cache/update/offline routing.

To also exercise a private legacy backup locally without copying it into the repo:

```sh
LEGACY_BACKUP=/absolute/path/to/meg-fit-backup.json node --test tests/*.test.cjs
```

Passed with the supplied backup. Browser QA at 390×844 and 320×640 verified all workout cards, input/check persistence after reload, optional skip and bodyweight finish, session history, all five tabs, Pilates check/undo/Next Up, legacy backup paste/merge, actual backup download, protein, and scrolling/navigation. No horizontal overflow at 320px; bottom targets were 64×71px. No browser console errors observed. AI transport and errors were mocked; no paid Anthropic request was sent. Offline behavior was tested in a service-worker harness; a real iPhone Home Screen upgrade still needs device verification after approved publication.

## AI security tradeoff

The existing direct-browser Anthropic integration remains: the user-configured key is in localStorage and sent in an HTTPS request header to Anthropic. Scripts running on the same origin can read it, as can someone with access to browser developer tools. The settings UI discloses this. No key is committed, exported, or logged. A server-side proxy would change the requested architecture and is not introduced.

## Review and publishing — approval required

Authenticated CLI identity was verified as `meganbeatty`. GitHub Pages settings were read successfully: legacy build, branch `main`, path `/`, URL `https://meganbeatty.github.io/meg-fit/`. No settings were changed.

Before publication, on the existing iPhone shortcut, export a fresh backup via **Ask AI → API Key → Data Backup → Export All Data** and keep it securely. The old app may include its API key in that file; do not upload it to GitHub or share it publicly.

After explicit review/approval, either publish the reviewed branch with authenticated Git or use the manual path:

1. Extract `meg-fit-upgrade-files.zip` locally.
2. Sign into GitHub as **meganbeatty** and open `meganbeatty/meg-fit`.
3. Choose **Add file → Upload files**. Upload the seven application files at the repository root: `index.html`, `app.js`, `legacy-names.js`, `pilates.js`, `upgrade.css`, `manifest.json`, `sw.js`. Do not upload the ZIP itself, private backups, or a surrounding folder. The documentation/tests may be uploaded too, but are not required to run the app.
4. Commit to a new branch and review the comparison. Merge into `main` only after approval. That merge triggers the live Pages deployment. Keep `index_v2.html` unchanged.
5. Wait for the Pages build, then verify the live URL and all seven assets under `/meg-fit/`.
6. On the iPhone, open the existing Home Screen shortcut online, close it fully, and reopen it so the newly installed worker/app can take control. If necessary repeat once. **Do not delete the shortcut, reinstall, clear site data, or clear localStorage.** Check familiar weights, legacy history, a new session and Pilates persistence on the device before relying on it offline.

For local preview: `python3 -m http.server 8765 --bind 127.0.0.1` from this folder, then open `http://127.0.0.1:8765/`. No install/build required.

Rollback source is the original main commit above. If reverting after deployment, publish the old UI with a newly bumped service-worker cache version so devices receive it. Preserve the new `megfit_v5` key; never erase storage as a rollback method. Old UI will not display new sessions, but those records remain available when the upgraded UI is restored.

## Review refinements

Weight inputs now sit in a fixed, right-aligned column beside each lift, reducing row height. Log includes a protein calendar with months as rows and days as columns, horizontally scrollable on phones. Years with logged data are selectable. Colors represent 120g+, 100–119g, 80–99g, and under 80g; unlogged days are neutral, and future/nonexistent dates are blank. Tapping a cell shows its date and exact total. The overlapping ranges in the feedback were interpreted as these nonoverlapping bands. Historical protein records are read directly and never rewritten by the calendar.

Additional tests verify band boundaries (including 80, 100 and 120), unlogged versus zero, leap days, future dates, calendar reads without data mutation, and the four-tab order. Rechecked the attached backup locally; credentials remain excluded. Revised UI tested at 390px and 320px, including persisted weight input and day detail selection.

## Weekly activity and calendar follow-up

Protein now proactively offers 2027 (and the next calendar year as time advances). The 2026 view shows November–December only; January–October records remain in storage and backups.

Activity shows 12 Monday-based weeks per page with Pull, Push, Legs and Pilates counts. Earlier/Later navigation and tappable week details expose actual completion dates. Existing dated lifting sessions are included; legacy week/check records are not misrepresented as sessions. New completions save a local calendar date to keep week grouping stable across time zones.

Pilates now adds optional `pilatesEvents` and `pilatesActive` fields to the existing version-5 state without changing storage keys or rewriting old records on read. Individual undo timestamps a cancellation so it is removed from weekly totals; reset-all clears the checklist association while retaining completed activity for future passes. Old checked days without dates remain undated. Backup restore merges events by ID; cancellation records prevent stale backups from resurrecting undone activity.

Four added tests cover the proactive year/hidden months, Pilates completion/undo/reset/repeat persistence, Monday boundaries across New Year, and backward-compatible/idempotent activity restore. Browser QA confirmed year options, hidden months, weekly details, undo updates, paging and no horizontal overflow at 320px. All 21 tests pass. Nothing has been deployed.

## Simplified Activity boxes

Each week now has three read-only automatic lift checkboxes (Pull/Push/Legs) and one numeric Pilates total. Finishing at least one session checks the relevant lift; additional saved sessions remain intact in history but do not change the checkbox. The displayed weekly target is one of each lift plus 5–6 Pilates sessions. Removed count-based shading, aggregate completion heading, and tap-for-dates controls. Pilates reset/undo behavior is unchanged. Updated coverage verifies the binary lift display with repeated sessions, the Pilates total, and absence of drill-down controls. All 21 tests pass; mobile checks confirm no overflow at 320px.

Pilates weekly totals now use coral for 0, yellow for 1–3, light green for 4, and rich green for 5 or more (including the 5–6 target). Numeric totals remain visible. All 22 tests pass, including threshold boundaries.

## Verified Pilates subtitles

All 25 day links and Next Up now show `Minutes | Focus | Equipment`. Removed promotional title suffixes. Full video lengths were retrieved from each official YouTube watch page’s player metadata and rounded to the nearest minute for display; exact seconds are stored in `pilates.js` and available in the link tooltip. The UI explains rounding and that equipment lists exclude a mat. Titles/descriptions verify props for 23 videos; Day 15’s spoken intro at 0:35 confirms no equipment, and Day 20’s intro at 0:26–0:37 plus 1:45–1:48 confirms weights, one per hand. See `PILATES_SOURCES.md` for all 25 linked sources, exact runtimes and equipment evidence. Original titles, video IDs, ordering and checkbox storage are unchanged.

All 23 tests pass, including metadata completeness and subtitle rendering. All 25 stored runtimes were compared with the retrieved official metadata. Browser review at 390px and 320px confirms the condensed labels and no horizontal overflow. No deployment has occurred.
