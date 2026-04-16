# CatBurger — Changes on `render-ready` branch

## Summary
The app was previously hosted on Heroku with a JawsDB MySQL add-on (both now defunct/paid-only). This branch modernizes the codebase and prepares it for redeployment on **Render** with a **Railway** MySQL database.

---

## Changes Made

### `package.json`
- Added `"start": "node server.js"` script (was missing — app couldn't be launched)
- Replaced deprecated `mysql` package with `mysql2`
- Removed inaccessible `handlebars-helper-css` devDependency
- Bumped `dotenv`, `express`, and `express-handlebars` to current major versions
- Renamed package from `mvc_design` → `catburger`, added description and author

### `config/connection.js`
- Updated require from `mysql` → `mysql2`
- Removed hardcoded Heroku `JAWSDB_GRAY_URL` check; replaced with `DATABASE_URL` (works for Railway, PlanetScale, any MySQL connection string)
- Falls back to individual `DB_HOST/PORT/USER/PASSWORD/NAME` vars for local dev with sensible localhost defaults
- Added `process.exit(1)` on connection failure so the app fails fast and clearly instead of silently

### `config/orm.js`
- Updated require from `mysql` → `mysql2`
- **Fixed SQL injection vulnerability** in `update()` and `delete()`: replaced raw string interpolation (`"WHERE id = " + condition`) with parameterized queries using `??` (identifiers) and `?` (values)
- Simplified helper functions

### `models/burger.js`
- Updated `update()` and `delete()` signatures to pass a numeric `id` directly instead of a raw SQL condition string (matching the fixed ORM)
- Removed unnecessary callback wrappers

### `controllers/burgersController.js`
- Removed debug `console.log` statements
- Added `parseInt(req.params.id, 10)` + `isNaN()` guard before passing id to model
- Added input validation on POST (empty burger name returns 400)
- Changed `result.changedRows` → `result.affectedRows` on PUT (more reliable)

### `public/assets/js/burgers.js`
- Removed `console.log` statements from all AJAX callbacks
- Added `.fail()` error handlers to all three AJAX calls (PUT, POST, DELETE) with user-facing `alert()` messages
- Added client-side empty-name validation on form submit

### `db/schema.sql`
- Fixed `### Schema` comment (invalid SQL syntax) → `-- Schema`

### New files
- **`.env.example`** — documents all required environment variables with explanations for local vs production
- **`render.yaml`** — Render deployment config (web service, Node env, build/start commands, env var stubs)
- **`README.md`** — full setup guide for local dev and Render + Railway deployment, project structure

---

## To Run Locally

1. `npm install`
2. `cp .env.example .env` and fill in your MySQL credentials
3. Run `db/schema.sql` and `db/seeds.sql` against your local MySQL
4. `npm start` → http://localhost:3030

## To Deploy

See README.md → "Deploying to Render + Railway"
