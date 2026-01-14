'use client'

import { useState, useCallback } from 'react'
import { categories, categoryEmojis, categoryColors } from '@/lib/questions'
import { useSound } from '@/lib/sounds'

// Visual hint icons - SVG illustrations for questions
const HintIcons = {
  oscar_statue: (
    <svg viewBox="0 0 64 64" className="w-full h-full">
      <defs><linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#FFD700" /><stop offset="50%" stopColor="#FFA500" /><stop offset="100%" stopColor="#FFD700" /></linearGradient></defs>
      <ellipse cx="32" cy="58" rx="12" ry="4" fill="url(#gold)" /><rect x="28" y="50" width="8" height="8" fill="url(#gold)" /><ellipse cx="32" cy="30" rx="8" ry="12" fill="url(#gold)" /><circle cx="32" cy="18" r="8" fill="url(#gold)" />
    </svg>
  ),
  microphone: (
    <svg viewBox="0 0 64 64" className="w-full h-full">
      <rect x="24" y="8" width="16" height="28" rx="8" fill="#888" /><rect x="26" y="10" width="12" height="24" rx="6" fill="#333" /><path d="M20 28 Q20 44 32 44 Q44 44 44 28" stroke="#888" strokeWidth="3" fill="none" /><rect x="30" y="44" width="4" height="12" fill="#888" /><rect x="24" y="54" width="16" height="4" rx="2" fill="#888" />
    </svg>
  ),
  movie_camera: (
    <svg viewBox="0 0 64 64" className="w-full h-full">
      <rect x="8" y="20" width="36" height="28" rx="4" fill="#444" /><circle cx="18" cy="34" r="8" fill="#222" stroke="#666" strokeWidth="2" /><circle cx="36" cy="34" r="6" fill="#222" stroke="#666" strokeWidth="2" /><polygon points="44,28 56,20 56,48 44,40" fill="#666" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 64 64" className="w-full h-full">
      <path d="M32 56 C16 44 4 32 4 20 C4 10 12 4 22 4 C28 4 32 8 32 8 C32 8 36 4 42 4 C52 4 60 10 60 20 C60 32 48 44 32 56" fill="#E91E63" /><ellipse cx="20" cy="18" rx="6" ry="4" fill="#F48FB1" opacity="0.6" />
    </svg>
  ),
  money_bag: (
    <svg viewBox="0 0 64 64" className="w-full h-full">
      <ellipse cx="32" cy="48" rx="20" ry="14" fill="#4CAF50" /><path d="M24 20 L32 8 L40 20" fill="none" stroke="#4CAF50" strokeWidth="4" strokeLinecap="round" /><circle cx="32" cy="20" r="8" fill="#4CAF50" /><text x="32" y="52" textAnchor="middle" fill="#FFF" fontSize="16" fontWeight="bold">$</text>
    </svg>
  ),
  film_reel: (
    <svg viewBox="0 0 64 64" className="w-full h-full">
      <circle cx="32" cy="32" r="26" fill="#333" stroke="#666" strokeWidth="2" /><circle cx="32" cy="32" r="8" fill="#666" /><circle cx="32" cy="12" r="5" fill="#222" /><circle cx="32" cy="52" r="5" fill="#222" /><circle cx="12" cy="32" r="5" fill="#222" /><circle cx="52" cy="32" r="5" fill="#222" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 64 64" className="w-full h-full">
      <polygon points="32,4 40,24 60,26 46,40 50,60 32,50 14,60 18,40 4,26 24,24" fill="#FFD700" /><polygon points="32,12 37,24 50,26 41,35 44,48 32,42 20,48 23,35 14,26 27,24" fill="#FFF8DC" opacity="0.3" />
    </svg>
  ),
  popcorn: (
    <svg viewBox="0 0 64 64" className="w-full h-full">
      <path d="M16 24 L12 56 L52 56 L48 24" fill="#E53935" /><rect x="14" y="24" width="36" height="6" fill="#B71C1C" /><circle cx="20" cy="18" r="8" fill="#FFF9C4" /><circle cx="32" cy="14" r="9" fill="#FFF9C4" /><circle cx="44" cy="18" r="8" fill="#FFF9C4" />
    </svg>
  ),
  trophy: (
    <svg viewBox="0 0 64 64" className="w-full h-full">
      <path d="M20 8 L20 28 Q20 40 32 44 Q44 40 44 28 L44 8 Z" fill="#FFD700" /><rect x="28" y="44" width="8" height="8" fill="#FFD700" /><rect x="22" y="52" width="20" height="6" rx="2" fill="#FFD700" /><path d="M20 12 L8 12 L8 20 Q8 28 20 28" fill="none" stroke="#FFD700" strokeWidth="4" /><path d="M44 12 L56 12 L56 20 Q56 28 44 28" fill="none" stroke="#FFD700" strokeWidth="4" />
    </svg>
  ),
  musical_note: (
    <svg viewBox="0 0 64 64" className="w-full h-full">
      <ellipse cx="18" cy="50" rx="10" ry="8" fill="#9C27B0" /><rect x="26" y="14" width="4" height="38" fill="#9C27B0" /><path d="M30 14 Q50 10 50 24 Q50 34 30 30" fill="#9C27B0" />
    </svg>
  ),
  director_chair: (
    <svg viewBox="0 0 64 64" className="w-full h-full">
      <rect x="12" y="28" width="40" height="16" fill="#1976D2" /><text x="32" y="40" textAnchor="middle" fill="#FFF" fontSize="8" fontWeight="bold">DIRECTOR</text><path d="M16 44 L12 60" stroke="#8D6E63" strokeWidth="4" strokeLinecap="round" /><path d="M48 44 L52 60" stroke="#8D6E63" strokeWidth="4" strokeLinecap="round" />
    </svg>
  ),
  clapperboard: (
    <svg viewBox="0 0 64 64" className="w-full h-full">
      <rect x="8" y="20" width="48" height="36" rx="2" fill="#222" /><rect x="8" y="8" width="48" height="16" fill="#222" /><rect x="8" y="8" width="10" height="16" fill="#FFF" /><rect x="22" y="8" width="10" height="16" fill="#FFF" /><rect x="36" y="8" width="10" height="16" fill="#FFF" />
    </svg>
  ),
  spotlight: (
    <svg viewBox="0 0 64 64" className="w-full h-full">
      <ellipse cx="32" cy="56" rx="24" ry="6" fill="#FFEB3B" opacity="0.3" /><path d="M32 8 L20 48 L44 48 Z" fill="#FFEB3B" opacity="0.4" /><rect x="26" y="4" width="12" height="8" rx="2" fill="#666" /><ellipse cx="32" cy="12" rx="6" ry="3" fill="#FFF" />
    </svg>
  ),
  ticket: (
    <svg viewBox="0 0 64 64" className="w-full h-full">
      <path d="M8 20 L8 28 Q14 32 14 38 Q14 44 8 48 L8 56 L56 56 L56 48 Q50 44 50 38 Q50 32 56 28 L56 20 Z" fill="#FF5722" /><text x="32" y="42" textAnchor="middle" fill="#FFF" fontSize="10" fontWeight="bold">ADMIT 1</text>
    </svg>
  ),
  red_carpet: (
    <svg viewBox="0 0 64 64" className="w-full h-full">
      <path d="M8 56 L24 8 L40 8 L56 56" fill="#C62828" /><path d="M12 56 L26 12 L38 12 L52 56" fill="#E53935" /><rect x="22" y="4" width="20" height="8" rx="2" fill="#FFD700" />
    </svg>
  ),
}

const getHintIcon = (hint) => HintIcons[hint] || HintIcons.star

const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const Confetti = ({ active }) => {
  if (!active) return null
  const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8']
  const confetti = Array.from({ length: 50 }, (_, i) => ({
    id: i, left: Math.random() * 100, delay: Math.random() * 0.5, duration: 1 + Math.random() * 1,
    color: colors[Math.floor(Math.random() * colors.length)], size: 6 + Math.random() * 8,
  }))
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((c) => (
        <div key={c.id} className="absolute animate-confetti" style={{
          left: `${c.left}%`, top: '-20px', width: `${c.size}px`, height: `${c.size}px`,
          backgroundColor: c.color, borderRadius: Math.random() > 0.5 ? '50%' : '0%',
          animationDelay: `${c.delay}s`, animationDuration: `${c.duration}s`,
        }} />
      ))}
    </div>
  )
}

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="relative w-20 h-20">
      <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full" />
      <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" />
      <div className="absolute inset-2 border-4 border-transparent border-t-pink-500 rounded-full animate-spin-reverse" />
      <div className="absolute inset-4 flex items-center justify-center"><span className="text-2xl animate-pulse">🎬</span></div>
    </div>
    <p className="mt-4 text-gray-400 animate-pulse">Generating question...</p>
  </div>
)

const AnimationStyles = () => (
  <style jsx global>{`
    @keyframes confetti { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
    .animate-confetti { animation: confetti linear forwards; }
    @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
    .animate-float { animation: float 3s ease-in-out infinite; }
    @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
    .animate-shake { animation: shake 0.5s ease-in-out; }
    @keyframes pop { 0% { transform: scale(0); opacity: 0; } 50% { transform: scale(1.2); } 100% { transform: scale(1); opacity: 1; } }
    .animate-pop { animation: pop 0.3s ease-out forwards; }
    @keyframes slideUp { 0% { transform: translateY(20px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
    .animate-slideUp { animation: slideUp 0.4s ease-out forwards; }
    @keyframes pulse-border { 0%, 100% { box-shadow: 0 0 0 0 rgba(168, 85, 247, 0.4); } 50% { box-shadow: 0 0 0 10px rgba(168, 85, 247, 0); } }
    .animate-pulse-border { animation: pulse-border 2s infinite; }
    @keyframes spin-reverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
    .animate-spin-reverse { animation: spin-reverse 1.5s linear infinite; }
    @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
    .animate-gradient { background-size: 200% 200%; animation: gradient 3s ease infinite; }
  `}</style>
)

export default function TriviaGame({ onScoreSubmit, leaderboard }) {
  const [gameState, setGameState] = useState('start')
  const [gameMode, setGameMode] = useState(null) // 'random' or 'category'
  const [currentCategory, setCurrentCategory] = useState(null)
  const [lockedCategory, setLockedCategory] = useState(null) // For category mode - stays in same category
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [score, setScore] = useState(0)
  const [totalAnswered, setTotalAnswered] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [shuffledOptions, setShuffledOptions] = useState([])
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const [showNameInput, setShowNameInput] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [funFact, setFunFact] = useState(null)
  const [questionHint, setQuestionHint] = useState('star')
  
  const playSound = useSound()
  const sound = useCallback((type) => { if (soundEnabled) playSound(type) }, [soundEnabled, playSound])

  const fetchQuestion = async (category) => {
    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category })
      })
      if (!response.ok) throw new Error('Failed to fetch question')
      const data = await response.json()
      if (data.success && data.question) return data.question
      throw new Error(data.error || 'Failed to generate question')
    } catch (error) {
      console.error('Error fetching question:', error)
      return {
        q: "Which film won the Academy Award for Best Picture in 2020?",
        a: "Parasite", options: ["Parasite", "1917", "Joker", "Once Upon a Time in Hollywood"],
        hint: "oscar_statue", funFact: "Parasite was the first non-English language film to win Best Picture!"
      }
    }
  }

  const getRandomCategory = () => {
    const randomIndex = Math.floor(Math.random() * categories.length)
    return categories[randomIndex]
  }

  const startRandomMode = async () => {
    sound('select')
    setGameMode('random')
    const randomCategory = getRandomCategory()
    setCurrentCategory(randomCategory)
    setLockedCategory(null)
    setGameState('loading')
    sound('loading')
    const question = await fetchQuestion(randomCategory)
    setCurrentQuestion(question)
    setShuffledOptions(shuffleArray(question.options))
    setQuestionHint(question.hint || 'star')
    setFunFact(question.funFact || null)
    setGameState('playing')
    setSelectedAnswer(null)
    setShowResult(false)
  }

  const startCategoryMode = () => {
    sound('select')
    setGameMode('category')
    setGameState('categories')
  }

  const selectCategory = async (category) => {
    sound('select')
    setCurrentCategory(category)
    setLockedCategory(category)
    setGameState('loading')
    sound('loading')
    const question = await fetchQuestion(category)
    setCurrentQuestion(question)
    setShuffledOptions(shuffleArray(question.options))
    setQuestionHint(question.hint || 'star')
    setFunFact(question.funFact || null)
    setGameState('playing')
    setSelectedAnswer(null)
    setShowResult(false)
  }

  const changeCategory = () => {
    sound('click')
    setGameState('categories')
  }

  const handleAnswer = (answer) => {
    if (showResult) return
    sound('click')
    setSelectedAnswer(answer)
    setShowResult(true)
    setTotalAnswered(prev => prev + 1)
    if (answer === currentQuestion.a) {
      sound('correct')
      setScore(prev => prev + 1)
      const newStreak = streak + 1
      setStreak(newStreak)
      if (newStreak > bestStreak) setBestStreak(newStreak)
      if (newStreak >= 3 && newStreak % 3 === 0) {
        sound('streak')
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 2000)
      }
    } else {
      sound('wrong')
      setStreak(0)
    }
  }

  const nextQuestion = async () => {
    sound('click')
    setSelectedAnswer(null)
    setShowResult(false)
    setCurrentQuestion(null)
    setFunFact(null)
    
    if (gameMode === 'random') {
      // Random mode: pick a new random category
      const randomCategory = getRandomCategory()
      setCurrentCategory(randomCategory)
      setGameState('loading')
      sound('loading')
      const question = await fetchQuestion(randomCategory)
      setCurrentQuestion(question)
      setShuffledOptions(shuffleArray(question.options))
      setQuestionHint(question.hint || 'star')
      setFunFact(question.funFact || null)
      setGameState('playing')
    } else {
      // Category mode: stay in the same category
      setGameState('loading')
      sound('loading')
      const question = await fetchQuestion(lockedCategory)
      setCurrentQuestion(question)
      setShuffledOptions(shuffleArray(question.options))
      setQuestionHint(question.hint || 'star')
      setFunFact(question.funFact || null)
      setGameState('playing')
    }
  }
  const resetGame = () => { sound('click'); setGameState('start'); setGameMode(null); setLockedCategory(null); setScore(0); setTotalAnswered(0); setStreak(0); setBestStreak(0); setCurrentCategory(null); setCurrentQuestion(null); setShowNameInput(false); setPlayerName('') }
  const finishGame = () => { sound('gameOver'); setShowConfetti(true); setTimeout(() => setShowConfetti(false), 3000); setShowNameInput(true) }

  const submitScore = async () => {
    sound('click')
    if (playerName.trim() && onScoreSubmit) {
      await onScoreSubmit({ name: playerName.trim(), score, totalAnswered, bestStreak, date: new Date().toISOString() })
    }
    setShowNameInput(false)
    setGameState('results')
  }

  const shareResults = async () => {
    sound('click')
    const percentage = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0
    const text = `🎬 Hollywood Trivia\n\n🏆 Score: ${score}/${totalAnswered} (${percentage}%)\n🔥 Best Streak: ${bestStreak}\n\nCan you beat my score? Play now!`
    if (navigator.share) { try { await navigator.share({ text }) } catch { await navigator.clipboard.writeText(text); alert('Results copied to clipboard!') } }
    else { await navigator.clipboard.writeText(text); alert('Results copied to clipboard!') }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-4 sm:p-8 overflow-hidden">
      <Confetti active={showConfetti} />
      <AnimationStyles />
      
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-end mb-2">
            <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all hover:scale-110">
              {soundEnabled ? '🔊' : '🔇'}
            </button>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-2 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_200%]">
            🎬 Hollywood Trivia 🌟
          </h1>
          {gameState !== 'start' && gameState !== 'results' && gameState !== 'loading' && (
            <div className="flex flex-col items-center gap-2 mt-4 animate-slideUp">
              <div className="flex justify-center gap-4 sm:gap-6 text-sm">
                <div className="bg-white/10 px-4 py-2 rounded-full backdrop-blur">Score: <span className="font-bold text-yellow-400">{score}/{totalAnswered}</span></div>
                <div className="bg-white/10 px-4 py-2 rounded-full backdrop-blur">🔥 Streak: <span className={`font-bold ${streak >= 3 ? 'text-orange-400 animate-pulse' : 'text-orange-400'}`}>{streak}</span></div>
                {bestStreak > 0 && <div className="bg-white/10 px-4 py-2 rounded-full backdrop-blur hidden sm:block">Best: <span className="font-bold text-green-400">{bestStreak}</span></div>}
              </div>
              <div className="text-xs text-gray-400">
                {gameMode === 'random' ? '🎲 Random Mode' : `🎯 ${lockedCategory || 'Category Mode'}`}
              </div>
            </div>
          )}
        </div>

        {/* Start Screen */}
        {gameState === 'start' && (
          <div className="text-center space-y-8 animate-slideUp">
            <div className="bg-white/5 backdrop-blur rounded-2xl p-8 border border-white/10">
              <p className="text-xl mb-6 text-gray-300">Test your knowledge of movies, celebrities, and pop culture!</p>
              <p className="text-sm mb-6 text-purple-300">✨ AI-powered questions — always fresh, never the same!</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                {categories.map((cat, i) => (
                  <div key={cat} className="bg-white/5 rounded-lg p-3 text-sm hover:bg-white/10 transition-all transform hover:scale-105" style={{ animationDelay: `${i * 0.1}s` }}>
                    <span className="text-2xl">{categoryEmojis[cat]}</span>
                    <p className="mt-1 text-gray-400">{cat}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <button onClick={startRandomMode} className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-full text-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-pink-500/25 animate-pulse-border">
                  🎲 Start (Random)
                </button>
                <button onClick={startCategoryMode} className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-4 px-12 rounded-full text-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25 sm:ml-4">
                  🎯 Choose Category
                </button>
                {leaderboard?.length > 0 && <button onClick={() => { sound('click'); setShowLeaderboard(true) }} className="block mx-auto text-gray-400 hover:text-white transition-colors mt-4">🏆 View Leaderboard</button>}
              </div>
            </div>
          </div>
        )}

        {/* Category Selection */}
        {gameState === 'categories' && (
          <div className="space-y-4 animate-slideUp">
            <h2 className="text-2xl font-bold text-center mb-2">Choose a Category</h2>
            {totalAnswered > 0 && (
              <p className="text-center text-gray-400 text-sm mb-4">Your score will be kept when switching categories</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((category, index) => (
                <button key={category} onClick={() => selectCategory(category)} className={`bg-gradient-to-r ${categoryColors[category]} p-6 rounded-xl text-left transition-all transform hover:scale-105 hover:shadow-lg animate-pop ${lockedCategory === category ? 'ring-4 ring-white/50' : ''}`} style={{ animationDelay: `${index * 0.1}s` }}>
                  <span className="text-3xl animate-float inline-block">{categoryEmojis[category]}</span>
                  <h3 className="text-xl font-bold mt-2">{category}</h3>
                  <p className="text-sm opacity-80 mt-1">✨ AI-generated questions</p>
                  {lockedCategory === category && <span className="text-xs bg-white/20 px-2 py-1 rounded-full mt-2 inline-block">Current</span>}
                </button>
              ))}
            </div>
            <div className="text-center mt-8 space-x-4">
              {totalAnswered > 0 && <button onClick={finishGame} className="text-green-400 hover:text-green-300 transition-colors">Finish & Save Score</button>}
              <button onClick={resetGame} className="text-gray-400 hover:text-white transition-colors">Back to Start</button>
            </div>
          </div>
        )}

        {/* Loading Screen */}
        {gameState === 'loading' && <div className="bg-white/5 backdrop-blur rounded-2xl p-8 border border-white/10"><LoadingSpinner /></div>}

        {/* Question Screen */}
        {gameState === 'playing' && currentQuestion && (
          <div className="space-y-6 animate-slideUp">
            <div className={`bg-gradient-to-r ${categoryColors[currentCategory]} p-1 rounded-2xl`}>
              <div className="bg-gray-900 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400"><span className="text-xl">{categoryEmojis[currentCategory]}</span>{currentCategory}</div>
                  <div className="w-12 h-12 animate-float">{getHintIcon(questionHint)}</div>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold">{currentQuestion.q}</h2>
              </div>
            </div>
            <div className="space-y-3">
              {shuffledOptions.map((option, index) => {
                const isCorrect = option === currentQuestion.a
                const isSelected = selectedAnswer === option
                let btnClass = "w-full p-4 rounded-xl text-left transition-all font-medium transform "
                if (showResult) {
                  if (isCorrect) btnClass += "bg-green-500/30 border-2 border-green-500 text-green-300 scale-105"
                  else if (isSelected) btnClass += "bg-red-500/30 border-2 border-red-500 text-red-300 animate-shake"
                  else btnClass += "bg-white/5 border-2 border-transparent text-gray-500"
                } else btnClass += "bg-white/10 border-2 border-transparent hover:bg-white/20 hover:border-white/30 hover:scale-[1.02] active:scale-[0.98]"
                return (
                  <button key={index} onClick={() => handleAnswer(option)} disabled={showResult} className={btnClass}>
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-center mr-3">{String.fromCharCode(65 + index)}</span>
                    {option}
                    {showResult && isCorrect && <span className="float-right text-xl">✓</span>}
                    {showResult && isSelected && !isCorrect && <span className="float-right text-xl">✗</span>}
                  </button>
                )
              })}
            </div>
            {showResult && (
              <div className="text-center space-y-4 animate-pop">
                <div className={`text-2xl font-bold ${selectedAnswer === currentQuestion.a ? 'text-green-400' : 'text-red-400'}`}>
                  {selectedAnswer === currentQuestion.a ? '🎉 Correct!' : '😅 Not quite!'}
                </div>
                {funFact && <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4 text-left animate-slideUp"><p className="text-sm text-purple-300">💡 <span className="font-semibold">Fun Fact:</span> {funFact}</p></div>}
                {streak >= 3 && selectedAnswer === currentQuestion.a && <div className="text-orange-400 animate-pulse text-lg">🔥 {streak} in a row! You&apos;re on fire!</div>}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button onClick={nextQuestion} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105">
                    {gameMode === 'random' ? 'Next Question 🎲' : 'Next Question →'}
                  </button>
                  {gameMode === 'category' && (
                    <button onClick={changeCategory} className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105">
                      Change Category 🎯
                    </button>
                  )}
                </div>
                <button onClick={finishGame} className="text-gray-400 hover:text-white transition-colors text-sm">Finish & Save Score</button>
              </div>
            )}
          </div>
        )}

        {/* Name Input Modal */}
        {showNameInput && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-sm border border-white/10 animate-pop">
              <h3 className="text-xl font-bold mb-4">Save Your Score! 🏆</h3>
              <p className="text-gray-400 mb-4">Score: {score}/{totalAnswered} • Best Streak: {bestStreak}</p>
              <input type="text" placeholder="Enter your name" value={playerName} onChange={(e) => setPlayerName(e.target.value)} className="w-full p-3 rounded-xl bg-white/10 border border-white/20 mb-4 focus:outline-none focus:border-purple-500" maxLength={20} autoFocus />
              <div className="flex gap-3">
                <button onClick={() => { sound('click'); setShowNameInput(false); setGameState('results') }} className="flex-1 py-3 rounded-xl border border-white/20 hover:bg-white/5">Skip</button>
                <button onClick={submitScore} disabled={!playerName.trim()} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-bold disabled:opacity-50">Save Score</button>
              </div>
            </div>
          </div>
        )}

        {/* Results Screen */}
        {gameState === 'results' && (
          <div className="text-center space-y-8 animate-slideUp">
            <div className="bg-white/5 backdrop-blur rounded-2xl p-8 border border-white/10">
              <h2 className="text-3xl font-bold mb-6">Game Complete! 🎉</h2>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white/5 rounded-xl p-4 animate-pop" style={{ animationDelay: '0.1s' }}><p className="text-3xl font-bold text-yellow-400">{score}</p><p className="text-sm text-gray-400">Correct</p></div>
                <div className="bg-white/5 rounded-xl p-4 animate-pop" style={{ animationDelay: '0.2s' }}><p className="text-3xl font-bold text-white">{totalAnswered}</p><p className="text-sm text-gray-400">Answered</p></div>
                <div className="bg-white/5 rounded-xl p-4 animate-pop" style={{ animationDelay: '0.3s' }}><p className="text-3xl font-bold text-orange-400">{bestStreak}</p><p className="text-sm text-gray-400">Best Streak</p></div>
              </div>
              <div className="space-y-4">
                <button onClick={shareResults} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105">📤 Share Results</button>
                <button onClick={resetGame} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105">Play Again 🎮</button>
                {leaderboard?.length > 0 && <button onClick={() => { sound('click'); setShowLeaderboard(true) }} className="text-gray-400 hover:text-white transition-colors">🏆 View Leaderboard</button>}
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Modal */}
        {showLeaderboard && leaderboard && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-white/10 max-h-[80vh] overflow-y-auto animate-pop">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">🏆 Leaderboard</h3>
                <button onClick={() => { sound('click'); setShowLeaderboard(false) }} className="text-gray-400 hover:text-white text-2xl hover:rotate-90 transition-all">×</button>
              </div>
              <div className="space-y-3">
                {leaderboard.slice(0, 10).map((entry, index) => (
                  <div key={index} className={`flex items-center gap-4 p-3 rounded-xl transition-all hover:scale-[1.02] ${index === 0 ? 'bg-yellow-500/20 border border-yellow-500/50' : index === 1 ? 'bg-gray-400/20 border border-gray-400/50' : index === 2 ? 'bg-amber-600/20 border border-amber-600/50' : 'bg-white/5'}`}>
                    <span className="text-2xl w-8 text-center">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}</span>
                    <div className="flex-1"><p className="font-bold">{entry.name}</p><p className="text-sm text-gray-400">{entry.score}/{entry.totalAnswered} • 🔥 {entry.bestStreak}</p></div>
                    <span className="text-xl font-bold text-yellow-400">{Math.round((entry.score / entry.totalAnswered) * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-12 text-gray-500 text-sm"><p>✨ Powered by AI • Questions are always fresh!</p></div>
      </div>
    </div>
  )
}
