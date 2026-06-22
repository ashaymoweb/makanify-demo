# Makanify Demo

A lightweight Next.js frontend that connects to the live Makanify CRM API — **no local backend required** for the default demo flow.

## Related repositories

| Repo | Purpose |
|------|---------|
| [makanify-demo-automation](https://github.com/ashaymoweb/makanify-demo-automation) | Pytest UI tests |
| [makanify-demo-docs](https://github.com/ashaymoweb/makanify-demo-docs) | BDD rules, Excel test cases, MCP setup |
| [makanify-demo-backend-ref](https://github.com/ashaymoweb/makanify-demo-backend-ref) | Optional local backend reference |

## Features

- **Login** — `POST /auth/login`
- **Contacts** — list, search, paginate, create via `/contact`

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | API base URL |

## API endpoints used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/auth/login` | Sign in |
| `POST` | `/auth/refresh-tokens` | Refresh token |
| `GET` | `/contact` | List contacts |
| `POST` | `/contact` | Create contact |
