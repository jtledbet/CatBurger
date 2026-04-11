# ^ↀᴥↀ^ Cat Burgers! ≧◔◡◔≦

A cat-themed burger tracker built with Node.js, Express, MySQL, and Handlebars. Log your cat burgers and mark them devoured — or not.

## Tech Stack

- **Backend:** Node.js, Express
- **Database:** MySQL (via mysql2)
- **Templating:** express-handlebars
- **Frontend:** Bootstrap, jQuery

---

## Running Locally

### Prerequisites
- Node.js (v18+)
- MySQL running locally (or Docker)

### Steps

1. **Clone the repo**
   ```bash
   git clone https://github.com/jtledbet/CatBurger.git
   cd CatBurger
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your database**

   In MySQL:
   ```bash
   mysql -u root -p < db/schema.sql
   mysql -u root -p catburger_db < db/seeds.sql
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your local MySQL credentials
   ```

5. **Start the server**
   ```bash
   npm start
   ```
   Visit [http://localhost:3030](http://localhost:3030)

---

## Deploying to Render + Railway

### 1. Set up a MySQL database on Railway
- Create a free account at [railway.app](https://railway.app)
- Add a **MySQL** plugin to a new project
- Copy the **DATABASE_URL** connection string from Railway's dashboard

### 2. Deploy to Render
- Create a free account at [render.com](https://render.com)
- New → Web Service → connect your GitHub repo
- Set the following environment variable in the Render dashboard:
  - `DATABASE_URL` → paste your Railway connection string

Render will automatically use `npm install` + `npm start` (defined in `render.yaml`).

### 3. Initialize the database
After first deploy, run the schema and seeds against your Railway MySQL instance:
```bash
mysql -h <railway-host> -P <port> -u root -p < db/schema.sql
mysql -h <railway-host> -P <port> -u root -p catburger_db < db/seeds.sql
```

---

## Project Structure

```
CatBurger/
├── config/
│   ├── connection.js   # MySQL connection (supports DATABASE_URL or individual vars)
│   └── orm.js          # Custom ORM with parameterized queries
├── controllers/
│   └── burgersController.js
├── db/
│   ├── schema.sql
│   └── seeds.sql
├── models/
│   └── burger.js
├── public/
│   └── assets/
│       ├── css/
│       ├── img/
│       └── js/burgers.js
├── views/
│   ├── index.handlebars
│   ├── layouts/
│   └── partials/
├── .env.example
├── render.yaml
└── server.js
```
