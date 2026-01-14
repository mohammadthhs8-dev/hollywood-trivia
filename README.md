# 🎬 Hollywood Trivia

A fun, category-based pop culture trivia game built with Next.js. Test your knowledge of movies, celebrities, Oscar history, iconic quotes, and more!

![Hollywood Trivia](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Optional-3ECF8E?style=flat-square&logo=supabase)

## Features

- 🎯 **6 Categories**: Oscar Moments, Iconic Movie Lines, Celebrity Matchups, Box Office Blockbusters, Music & Movies, Behind the Scenes
- 🔀 **Randomized Questions**: Questions shuffle each playthrough
- 🔥 **Streak Tracking**: Build up consecutive correct answers
- 🏆 **Leaderboard**: Compete with other players (requires Supabase)
- 📤 **Share Results**: Copy or share your score with friends
- 📱 **PWA Ready**: Install as an app on mobile devices
- 🎨 **Beautiful UI**: Gradient designs with smooth animations

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd hollywood-trivia
npm install
```

### 2. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**That's it!** The game works fully offline without any backend setup.

## Optional: Add Leaderboard with Supabase

To enable the global leaderboard:

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for it to finish setting up

### 2. Set Up the Database

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the contents of `supabase-schema.sql` and run it
3. This creates the `leaderboard` table and necessary policies

### 3. Get Your API Keys

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy the `Project URL` and `anon public` key

### 4. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Restart the Dev Server

```bash
npm run dev
```

The leaderboard is now active!

## Deploy to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/hollywood-trivia)

### Manual Deploy

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables (if using Supabase):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

## Project Structure

```
hollywood-trivia/
├── app/
│   ├── api/
│   │   └── generate-questions/  # AI question generation (future)
│   ├── globals.css              # Tailwind styles
│   ├── layout.js                # Root layout with metadata
│   └── page.js                  # Main page with Supabase integration
├── components/
│   └── TriviaGame.js            # Main game component
├── lib/
│   ├── questions.js             # Question bank
│   └── supabase.js              # Supabase client
├── public/
│   └── manifest.json            # PWA manifest
├── .env.example                 # Environment template
├── supabase-schema.sql          # Database schema
└── README.md
```

## Customization

### Adding Questions

Edit `lib/questions.js` to add more questions:

```javascript
export const questionBank = {
  "Your Category": [
    {
      q: "Your question?",
      a: "Correct Answer",
      options: ["Correct Answer", "Wrong 1", "Wrong 2", "Wrong 3"]
    },
    // ... more questions
  ]
}
```

Don't forget to add the category to `categoryEmojis` and `categoryColors`!

### AI-Generated Questions (Advanced)

The app includes a placeholder API route for AI-generated questions. To enable:

1. Get an API key from [Anthropic](https://console.anthropic.com)
2. Add `ANTHROPIC_API_KEY` to your environment variables
3. Uncomment the API call in `app/api/generate-questions/route.js`

## Future Ideas

- [ ] Daily challenge mode (same questions for everyone each day)
- [ ] Multiplayer head-to-head battles
- [ ] Category-specific leaderboards
- [ ] Achievements and badges
- [ ] Timed question mode
- [ ] Question difficulty levels

## License

MIT - Do whatever you want with it! Have fun! 🎉

---

Made with 🍿 for movie lovers
