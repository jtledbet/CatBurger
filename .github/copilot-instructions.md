# CatBurger — Copilot Instructions

## Overview

CatBurger is a cat-themed burger tracker CRUD app built with Node.js, Express, MySQL, and Handlebars. Runs on port 3030. Deployed to Render (web) + Railway (MySQL).

## Quick Start

```bash
npm install
cp .env.example .env          # Fill in MySQL credentials
mysql -u root -p < db/schema.sql
mysql -u root -p catburger_db < db/seeds.sql
npm start                     # http://localhost:3030
```

No tests or linting defined.

## Architecture

### Custom MVC Pattern + Hand-Rolled ORM

```
server.js
  └── controllers/burgersController.js   (Express routes: GET /, POST/PUT/DELETE /api/burgers/:id)
        └── models/burger.js             (thin wrapper → delegates to ORM)
              └── config/orm.js          (parameterized SQL builder)
                    └── config/connection.js  (mysql2 connection)
views/
  index.handlebars           (main UI)
  layouts/main.handlebars
public/assets/js/burgers.js  (AJAX mutations: add, devour, delete)
db/
  schema.sql                 (DROP/CREATE catburger_db + burgers table)
  seeds.sql
```

### Key Convention: ORM Pattern

All SQL queries use:
- `??` for table/column identifiers (safely escaped)
- `?` for values (parameterized, safe from SQL injection)

Example (from `config/orm.js`):
```javascript
selectAll: () => connection.promise().query('SELECT * FROM ?? ', [table])
```

**Important:** Logic lives in the controller and ORM layer, not in the (intentionally thin) model.

## Database

### Local Development
Requires MySQL running locally. Schema + seeds included:
- Database: `catburger_db`
- Table: `burgers` (columns: `id`, `burger_name`, `devoured`)

### Environment Variables
Choose either `DATABASE_URL` (Render/Railway style) or individual connection vars:

| Variable | Default | Notes |
|----------|---------|-------|
| `DATABASE_URL` | — | Full connection string (`mysql://user:pass@host:port/db`). Used by Render/Railway. |
| `DB_HOST` | `localhost` | MySQL host |
| `DB_PORT` | `3306` | MySQL port |
| `DB_USER` | `root` | MySQL username |
| `DB_PASSWORD` | — | MySQL password |
| `DB_NAME` | `catburger_db` | Database name |
| `PORT` | `3030` | HTTP port |

**Precedence:** `DATABASE_URL` overrides individual vars if both are set.

## Frontend

### Views (Handlebars)
- `views/index.handlebars` — Main page (burger list + add form)
- `views/layouts/main.handlebars` — Layout wrapper (Bootstrap, CSS, scripts)

### Client-Side Logic (`public/assets/js/burgers.js`)
jQuery AJAX calls for all mutations:
- `POST /api/burgers` — Create burger
- `PUT /api/burgers/:id` — Update (devour/undevour)
- `DELETE /api/burgers/:id` — Delete

## Deployment

### Render (Web Service)
1. Connect GitHub repo to Render
2. Set environment variable: `DATABASE_URL` (Railway MySQL connection string)
3. Render auto-runs `npm install` + `npm start` (from `render.yaml`)

### Railway (MySQL)
1. Create MySQL plugin, copy connection string as `DATABASE_URL`
2. After first deploy, initialize schema:
   ```bash
   mysql -h <railway-host> -u root -p catburger_db < db/schema.sql
   mysql -h <railway-host> -u root -p catburger_db < db/seeds.sql
   ```

## Common Tasks

### Add a new burger column
1. Update `db/schema.sql` (alter table or update CREATE TABLE)
2. Update `models/burger.js` if needed (usually just passes through to ORM)
3. Update `config/orm.js` if new logic needed
4. Update `views/index.handlebars` to show/collect the column
5. Update `public/assets/js/burgers.js` if new UI interaction

### Fix a SQL query
All parameterized queries live in `config/orm.js`. Replace/update the method, then call it from `models/burger.js` or the controller.

### Debug connection issues
Check `config/connection.js` — it logs the connection string (redacted) on startup. Verify `DATABASE_URL` or individual `DB_*` variables are set correctly in `.env`.
