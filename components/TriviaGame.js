'use client'

import { useState, useEffect } from 'react'
import { questionBank, categories, categoryEmojis, categoryColors } from '@/lib/questions'

const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function TriviaGame({ onScoreSubmit, leaderboard }) {
  const [gameState, setGameState] = useState('start') // start, categories, playing, results
  const [currentCategory, setCurrentCategory] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [totalAnswered, setTotalAnswered] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [usedQuestions, setUsedQuestions] = useState({})
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [shuffledOptions, setShuffledOptions] = useState([])
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const [showNameInput, setShowNameInput] = useState(false)

  const getRandomQuestion = (category) => {
    const questions = questionBank[category]
    const used = usedQuestions[category] || []
    const available = questions.filter((_, i) => !used.includes(i))
    
    if (available.length === 0) {
      setUsedQuestions(prev => ({ ...prev, [category]: [] }))
      const randomIndex = Math.floor(Math.random() * questions.length)
      return { question: questions[randomIndex], index: randomIndex }
    }
    
    const randomAvailable = Math.floor(Math.random() * available.length)
    const originalIndex = questions.indexOf(available[randomAvailable])
    return { question: available[randomAvailable], index: originalIndex }
  }

  const selectCategory = (category) => {
    const { question, index } = getRandomQuestion(category)
    setCurrentCategory(category)
    setCurrentQuestionIndex(index)
    setShuffledOptions(shuffleArray(question.options))
    setGameState('playing')
    setSelectedAnswer(null)
    setShowResult(false)
    setUsedQuestions(prev => ({
      ...prev,
      [category]: [...(prev[category] || []), index]
    }))
  }

  const handleAnswer = (answer) => {
    if (showResult) return
    
    setSelectedAnswer(answer)
    setShowResult(true)
    setTotalAnswered(prev => prev + 1)
    
    const currentQuestion = questionBank[currentCategory][currentQuestionIndex]
    if (answer === currentQuestion.a) {
      setScore(prev => prev + 1)
      const newStreak = streak + 1
      setStreak(newStreak)
      if (newStreak > bestStreak) {
        setBestStreak(newStreak)
      }
    } else {
      setStreak(0)
    }
  }

  const nextQuestion = () => {
    setGameState('categories')
    setSelectedAnswer(null)
    setShowResult(false)
  }

  const resetGame = () => {
    setGameState('start')
    setScore(0)
    setTotalAnswered(0)
    setStreak(0)
    setBestStreak(0)
    setUsedQuestions({})
    setCurrentCategory(null)
    setShowNameInput(false)
    setPlayerName('')
  }

  const finishGame = () => {
    setShowNameInput(true)
  }

  const submitScore = async () => {
    if (playerName.trim() && onScoreSubmit) {
      await onScoreSubmit({
        name: playerName.trim(),
        score,
        totalAnswered,
        bestStreak,
        date: new Date().toISOString()
      })
    }
    setShowNameInput(false)
    setGameState('results')
  }

  const generateShareText = () => {
    const percentage = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0
    return `🎬 Hollywood Trivia

🏆 Score: ${score}/${totalAnswered} (${percentage}%)
🔥 Best Streak: ${bestStreak}

Can you beat my score? Play now!`
  }

  const shareResults = async () => {
    const text = generateShareText()
    
    if (navigator.share) {
      try {
        await navigator.share({ text })
      } catch (e) {
        // User cancelled or error
        await navigator.clipboard.writeText(text)
        alert('Results copied to clipboard!')
      }
    } else {
      await navigator.clipboard.writeText(text)
      alert('Results copied to clipboard!')
    }
  }

  const currentQuestion = currentCategory ? questionBank[currentCategory][currentQuestionIndex] : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-2 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            🎬 Hollywood Trivia 🌟
          </h1>
          {gameState !== 'start' && gameState !== 'results' && (
            <div className="flex justify-center gap-4 sm:gap-6 mt-4 text-sm">
              <div className="bg-white/10 px-4 py-2 rounded-full">
                Score: <span className="font-bold text-yellow-400">{score}/{totalAnswered}</span>
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-full">
                🔥 Streak: <span className="font-bold text-orange-400">{streak}</span>
              </div>
              {bestStreak > 0 && (
                <div className="bg-white/10 px-4 py-2 rounded-full hidden sm:block">
                  Best: <span className="font-bold text-green-400">{bestStreak}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Start Screen */}
        {gameState === 'start' && (
          <div className="text-center space-y-8">
            <div className="bg-white/5 backdrop-blur rounded-2xl p-8 border border-white/10">
              <p className="text-xl mb-6 text-gray-300">
                Test your knowledge of movies, celebrities, and pop culture!
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                {categories.map(cat => (
                  <div key={cat} className="bg-white/5 rounded-lg p-3 text-sm">
                    <span className="text-2xl">{categoryEmojis[cat]}</span>
                    <p className="mt-1 text-gray-400">{cat}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <button
                  onClick={() => setGameState('categories')}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-full text-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-pink-500/25"
                >
                  Start Playing! 🎮
                </button>
                {leaderboard && leaderboard.length > 0 && (
                  <button
                    onClick={() => setShowLeaderboard(true)}
                    className="block mx-auto text-gray-400 hover:text-white transition-colors"
                  >
                    🏆 View Leaderboard
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Category Selection */}
        {gameState === 'categories' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center mb-6">Choose a Category</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => selectCategory(category)}
                  className={`bg-gradient-to-r ${categoryColors[category]} p-6 rounded-xl text-left transition-all transform hover:scale-105 hover:shadow-lg`}
                >
                  <span className="text-3xl">{categoryEmojis[category]}</span>
                  <h3 className="text-xl font-bold mt-2">{category}</h3>
                  <p className="text-sm opacity-80 mt-1">
                    {questionBank[category].length} questions
                  </p>
                </button>
              ))}
            </div>
            <div className="text-center mt-8 space-x-4">
              <button
                onClick={finishGame}
                className="text-green-400 hover:text-green-300 transition-colors"
              >
                Finish & Save Score
              </button>
              <button
                onClick={resetGame}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Reset Game
              </button>
            </div>
          </div>
        )}

        {/* Question Screen */}
        {gameState === 'playing' && currentQuestion && (
          <div className="space-y-6">
            <div className={`bg-gradient-to-r ${categoryColors[currentCategory]} p-1 rounded-2xl`}>
              <div className="bg-gray-900 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-400">
                  <span className="text-xl">{categoryEmojis[currentCategory]}</span>
                  {currentCategory}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold">
                  {currentQuestion.q}
                </h2>
              </div>
            </div>

            <div className="space-y-3">
              {shuffledOptions.map((option, index) => {
                const isCorrect = option === currentQuestion.a
                const isSelected = selectedAnswer === option
                
                let buttonClass = "w-full p-4 rounded-xl text-left transition-all font-medium "
                
                if (showResult) {
                  if (isCorrect) {
                    buttonClass += "bg-green-500/30 border-2 border-green-500 text-green-300"
                  } else if (isSelected && !isCorrect) {
                    buttonClass += "bg-red-500/30 border-2 border-red-500 text-red-300"
                  } else {
                    buttonClass += "bg-white/5 border-2 border-transparent text-gray-500"
                  }
                } else {
                  buttonClass += "bg-white/10 border-2 border-transparent hover:bg-white/20 hover:border-white/30"
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={showResult}
                    className={buttonClass}
                  >
                    <span className="inline-block w-8 h-8 rounded-full bg-white/10 text-center leading-8 mr-3">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                    {showResult && isCorrect && <span className="float-right">✓</span>}
                    {showResult && isSelected && !isCorrect && <span className="float-right">✗</span>}
                  </button>
                )
              })}
            </div>

            {showResult && (
              <div className="text-center space-y-4">
                <div className={`text-2xl font-bold ${selectedAnswer === currentQuestion.a ? 'text-green-400' : 'text-red-400'}`}>
                  {selectedAnswer === currentQuestion.a ? '🎉 Correct!' : '😅 Not quite!'}
                </div>
                {streak >= 3 && selectedAnswer === currentQuestion.a && (
                  <div className="text-orange-400 animate-pulse">
                    🔥 {streak} in a row! You&apos;re on fire!
                  </div>
                )}
                <button
                  onClick={nextQuestion}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105"
                >
                  Next Category →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Name Input Modal */}
        {showNameInput && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-sm border border-white/10">
              <h3 className="text-xl font-bold mb-4">Save Your Score! 🏆</h3>
              <p className="text-gray-400 mb-4">
                Score: {score}/{totalAnswered} • Best Streak: {bestStreak}
              </p>
              <input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full p-3 rounded-xl bg-white/10 border border-white/20 mb-4 focus:outline-none focus:border-purple-500"
                maxLength={20}
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowNameInput(false)
                    setGameState('results')
                  }}
                  className="flex-1 py-3 rounded-xl border border-white/20 hover:bg-white/5 transition-colors"
                >
                  Skip
                </button>
                <button
                  onClick={submitScore}
                  disabled={!playerName.trim()}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-bold disabled:opacity-50 transition-all"
                >
                  Save Score
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Screen */}
        {gameState === 'results' && (
          <div className="text-center space-y-8">
            <div className="bg-white/5 backdrop-blur rounded-2xl p-8 border border-white/10">
              <h2 className="text-3xl font-bold mb-6">Game Complete! 🎉</h2>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-3xl font-bold text-yellow-400">{score}</p>
                  <p className="text-sm text-gray-400">Correct</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-3xl font-bold text-white">{totalAnswered}</p>
                  <p className="text-sm text-gray-400">Answered</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-3xl font-bold text-orange-400">{bestStreak}</p>
                  <p className="text-sm text-gray-400">Best Streak</p>
                </div>
              </div>
              <div className="space-y-4">
                <button
                  onClick={shareResults}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105"
                >
                  📤 Share Results
                </button>
                <button
                  onClick={resetGame}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105"
                >
                  Play Again 🎮
                </button>
                {leaderboard && leaderboard.length > 0 && (
                  <button
                    onClick={() => setShowLeaderboard(true)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    🏆 View Leaderboard
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Modal */}
        {showLeaderboard && leaderboard && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-white/10 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">🏆 Leaderboard</h3>
                <button
                  onClick={() => setShowLeaderboard(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="space-y-3">
                {leaderboard.slice(0, 10).map((entry, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-4 p-3 rounded-xl ${
                      index === 0 ? 'bg-yellow-500/20 border border-yellow-500/50' :
                      index === 1 ? 'bg-gray-400/20 border border-gray-400/50' :
                      index === 2 ? 'bg-amber-600/20 border border-amber-600/50' :
                      'bg-white/5'
                    }`}
                  >
                    <span className="text-2xl w-8 text-center">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
                    </span>
                    <div className="flex-1">
                      <p className="font-bold">{entry.name}</p>
                      <p className="text-sm text-gray-400">
                        {entry.score}/{entry.totalAnswered} • 🔥 {entry.bestStreak}
                      </p>
                    </div>
                    <span className="text-xl font-bold text-yellow-400">
                      {Math.round((entry.score / entry.totalAnswered) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Pick categories to keep playing • Questions shuffle each time</p>
        </div>
      </div>
    </div>
  )
}
