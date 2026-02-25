# Kanban Todo List

This is a small kanban-style task board built with [Next.js](https://nextjs.org/) and [Material UI](https://mui.com/).

Tasks are persisted via a simple JSON API; during development you can run a `json-server` on `http://localhost:4000` or point the app at any hosted REST service such as [MockAPI.io](https://mockapi.io/).

> **Material UI usage**
> The UI is built entirely with Material UI components.  See `app/layout.tsx` for the `ThemeProvider` setup.  Common primitives used throughout are `Box`, `Card`, `Typography`, `TextField`, etc.

## Getting Started

1. Install dependencies:

```bash
npm install
# or yarn
```

2. (optional) start a local mock API for tasks:

```bash
npx json-server --watch db.json --port 4000
```

   Alternatively set `NEXT_PUBLIC_API_BASE` to a remote endpoint (e.g. a MockAPI.io URL).

3. Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Tasks will be fetched from the address configured via `NEXT_PUBLIC_API_BASE` (default `http://localhost:4000`).

You can edit the UI in `components/Kanban` and the board auto-updates.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment

To deploy the app:

1. Create a Vercel project (or any other Next.js host).
2. Set the environment variable `NEXT_PUBLIC_API_BASE` to your production API endpoint. For example, if you use MockAPI.io it might be `https://xxx.mockapi.io/api`.
3. Push your repository and Vercel will build automatically.

For more on deploying Next.js see [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).
