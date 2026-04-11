# CatBurger — Project Survey Report

**Date:** 2026-04-10  
**Location:** `C:\Users\omnid\github\CatBurger`

---

## What the App Does

CatBurger is a quirky, cat-themed burger-ordering demo app. Users can:

- **Create** named burgers (e.g., "Keyboard Cat on Rye")
- **Devour** an undevoured burger (toggle its status to devoured)
- **Regurgitate** a devoured burger (toggle back)
- **Cremate** (delete) any burger

The UI is a three-column Bootstrap dashboard: undevoured burgers on the left, a creation form in the middle, devoured burgers on the right. All mutations are AJAX calls that reload the page on completion.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Runtime | Node.js | (unspecified) |
| Web framework | Express | 4.16.4 |
| Templating | Express-Handlebars | 3.0.2 |
| Database driver | mysql (legacy) | 2.17.1 |
| Env config | dotenv | 8.0.0 |
| Frontend CSS | Bootstrap | 4.3.1 (CDN) |
| Frontend JS | jQuery | (CDN, version unspecified) |

All npm dependencies are ~6–7 years old with no updates since initial development.

---

## Project Structure

```
CatBurger/
├── config/
│   ├── connection.js         # DB connection (local + JawsDB/Heroku)
│   └── orm.js               # Hand-rolled ORM (SELECT/INSERT/UPDATE/DELETE)
├── controllers/
│   └── burgersController.js  # Express Router — 4 routes
├── db/
│   ├── schema.sql            # Creates catburger_db and burgers table
│   └── seeds.sql             # 6 sample burgers
├── models/
│   └── burger.js             # Thin wrapper around ORM
├── public/assets/
│   ├── css/style.css         # Cat/burger colour scheme
│   ├── img/catburger.png     # Background image
│   └── js/burgers.js         # jQuery AJAX handlers
├── views/
│   ├── index.handlebars      # Main page template
│   ├── layouts/main.handlebars
│   └── partials/burgers/
│       ├── burger-block.handlebars   # Devour/Regurgitate button
│       └── burger-delete.handlebars  # "Cremate me!" button
├── server.js                 # App entry point (port 3030)
├── package.json
├── package-lock.json
├── .gitignore                # Includes .env
└── LICENSE                   # GNU GPLv3
```

**Architecture:** Clean MVC — Express Router in controllers, a custom ORM in config/orm.js, model wrappers in models/, Handlebars partials in views/.

---

## API Routes

| Method | Path | Action |
|---|---|---|
| GET | `/` | Render index with all burgers |
| POST | `/api/burgers` | Create new burger |
| PUT | `/api/burgers/:id` | Toggle devoured status |
| DELETE | `/api/burgers/:id` | Delete burger |

---

## Database Schema

```sql
-- Database: catburger_db
CREATE TABLE burgers (
  id          INT NOT NULL AUTO_INCREMENT,
  name        VARCHAR(255) NOT NULL,
  devoured    BOOLEAN DEFAULT false,
  PRIMARY KEY (id)
);
```

No timestamps, no categories, no user association — intentionally minimal.

---

## Configuration & Environment

`config/connection.js` supports two modes via `dotenv`:

- **Heroku/JawsDB:** reads `JAWSDB_GRAY_URL` (a full MySQL connection URL)
- **Local:** reads `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`

**There is no `.env` file and no `.env.example`** — new developers must guess the required variable names from reading the source code.

---

## What's Working

- Full CRUD flow is implemented end-to-end
- MVC separation is correct and clean for a learning project
- Handlebars partials and layouts used properly
- Parameterized queries on INSERT (`orm.js` uses `?` placeholders)
- Static asset serving, JSON middleware, URL-encoded body parsing all configured
- dotenv loaded for environment-based DB switching
- Seeds and schema SQL included for easy local setup

---

## What's Broken / Missing

### Hosting (the "Offline" badge on the portfolio)

The app was deployed to Heroku using the JawsDB MySQL add-on. **Heroku ended its free tier in November 2022**, so the app is permanently offline unless migrated to a new host. There is also **no `Procfile`**, which would be required for any Heroku-style deployment.

### Security Issues

| Issue | Location | Detail |
|---|---|---|
| SQL injection | `config/orm.js` — `update()`, `delete()` | WHERE conditions are string-concatenated, not parameterized. `req.params.id` flows directly into the query. |
| No input validation | `burgersController.js` | Burger names are not length-checked, sanitized, or validated before insertion. |
| No CSRF protection | All mutating routes | No CSRF tokens on the forms. |
| No rate limiting | All routes | Unlimited requests accepted. |
| No security headers | `server.js` | No `helmet` or equivalent. |

### Code Quality Issues

- `style.css` line ~50: `text: bold;` — invalid CSS property, should be `font-weight: bold;`
- `burgersController.js`: `console.log(hbsObject)` left in the GET route (debug noise on every page load)
- `burgers.js`: multiple `console.log` statements left in production client code
- No error handling anywhere — database errors bubble up as unhandled rejections

### Outdated Dependencies

The `mysql` package (v2) is deprecated and unmaintained. The rest of the stack is 6–7 years old with known CVEs in older Express and Handlebars versions.

### Missing Entirely

- `README.md` — no setup instructions, no local dev guide
- `.env.example` — required env vars are undocumented
- `Procfile` — no Heroku (or any PaaS) deployment config
- Test suite — `npm test` just prints an error and exits
- Error handling middleware
- Any form of logging beyond `console.log`

---

## Opportunities

| Opportunity | Effort | Value |
|---|---|---|
| Add `.env.example` with all required vars | Trivial | Unblocks any new contributor immediately |
| Add `README.md` with setup steps | Low | Makes the repo presentable on the portfolio |
| Fix SQL injection in `orm.js` | Low | Parameterize `update`/`delete` WHERE clauses |
| Fix CSS typo (`text: bold`) | Trivial | Stops a silent style failure |
| Remove debug `console.log` calls | Trivial | Clean production output |
| Replace `mysql` with `mysql2` | Low | Maintained driver, supports promises/async-await |
| Add a `Procfile` + deployment docs | Low | Documents how the Heroku deploy was intended to work |
| Migrate hosting | Medium | Render.com, Railway, or Fly.io all offer free MySQL+Node tiers |
| Upgrade Express + Handlebars | Medium | Removes known CVEs, modernizes the stack |
| Add `express-validator` for inputs | Low | Closes the input validation gap |

---

## Summary

CatBurger is a solid bootcamp-era MVC exercise that demonstrates the Node/Express/MySQL/Handlebars pattern clearly. The architecture is intentionally simple and pedagogically clean. It's offline because Heroku killed its free tier, not because the code itself is broken — the core CRUD loop is functional. The main liabilities are the SQL injection vulnerability in the custom ORM's condition strings, the complete absence of documentation, and an entirely outdated dependency tree.
