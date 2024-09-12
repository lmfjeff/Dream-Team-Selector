# Dream Team Selector
Build a 5-a-side soccer team with Marvel characters

## TODO
- share button (social media / download image)
- style

## Tech Stack
- next.js

## Feature
- fetch marvel api
- desktop / mobile friendly
- search
- drag n drop

## Local Development Setup
- sign up for marvel developer api
- copy .env.sample to .env, fill out .env
```bash
npm i
npm run dev
```
- Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment
- Vercel

## Static export

## Future Improvement
- Fetch All Marvel Characters Data into our own DB to avoid hitting rate limit
- Fetch Marvel Characters from our own DB to improve fetching filter (Marvel API only provide filter by exact name & nameStartsWith)
- use CDN to cache static page to improve load time