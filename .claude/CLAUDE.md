# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## The problem

Parking a short piece of text somewhere for later — a name, a number, a thing you're about to
paste — and every tool for it is too heavy. Notes apps want an account, files want a name and a
place, and none of them leave the text where you can *see* it while you work.

blanka makes the tab itself the note. You type; the text becomes the page, the tab title, and
the URL.

## How it solves it

**The URL is the storage.** No backend, no database, not even localStorage for the text — the
note lives in the location hash. That's what makes the rest free: bookmarking saves it, sharing
is copy-paste, session restore reopens it, and the app stays a static file. It also sets the
invariant everything else obeys: whatever the hash holds is the note. Newlines never go in —
`text()` collapses them to spaces — because line breaks are layout, not content. Change what
reaches the hash and every URL the user already saved silently breaks.

**The text sizes itself to the screen.** Words reflow into the fewest lines that fit 90% of the
viewport, split so the lines come out balanced rather than greedily filled, and the box
shrink-wraps that block and centers it. That's what makes it read as a sign instead of a form.
All measurement goes through a hidden span kept in sync with the textarea's computed font, never
through the textarea itself.

**The tab is the artifact.** The title mirrors the text so an unfocused tab is a readable label;
each tab takes a random favicon color so a row of them stays distinguishable. Many tabs, each a
labeled note, is the intended use — not one app you visit.

## Two things that look like bugs

**Reloading one tab reloads all of them.** Deliberate. A manual reload bumps a timestamp in
localStorage; every tab polls it and reloads when it changes. The `reloaded` / `auto-reloaded`
sessionStorage pair is what terminates the cascade — a tab that reloaded *because* of the poll
doesn't bump the timestamp again. Touching one flag without the other brings the loop back.

**The offline fallback goes stale on its own.** Fetching is network-first, so an online visitor
always gets the current page and the cache is purely the offline fallback. But that cached copy
is written only by the service worker's `install`, which runs only when `service-worker.js`
itself changes bytes — so editing `index.html` alone leaves the fallback frozen at an old
version, invisibly, until someone goes offline. Bumping `cacheVersion` is the trigger that
re-runs install; it exists for exactly that and is still 1. (A client that is already offline
can't be updated at all — it picks up the new copy on its next online load.)
