# Dream Team Selector
Build a 5-a-side soccer team with Marvel characters

## Tech Stack
- next.js

## Feature
- Fetch marvel api for Marvel Characters
- Desktop / Mobile friendly
- Search
- Drag n drop
- Pagination
- Share to Social Media / Download Image

## Technical Consideration
- Scalability: This is a static site, so it would be quite fast if put behind CDN for caching

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

## Future Improvement
- Fetch All Marvel Characters Data into our own DB to avoid hitting rate limit
- Fetch Marvel Characters from our own DB to improve fetching filter (Marvel API only provide filter by exact name & nameStartsWith)
- Use CDN to cache static page to improve load time
- Use state management library (e.g. redux) for all the states
