'use client'

import { useState, useEffect } from 'react'
import TriviaGame from '@/components/TriviaGame'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export default function Home() {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .order('best_streak', { ascending: false })
        .limit(10)

      if (error) throw error
      
      setLeaderboard(data?.map(entry => ({
        name: entry.name,
        score: entry.score,
        totalAnswered: entry.total_answered,
        bestStreak: entry.best_streak,
        date: entry.created_at
      })) || [])
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleScoreSubmit = async (scoreData) => {
    if (!isSupabaseConfigured()) {
      console.log('Score would be saved:', scoreData)
      // Still update local leaderboard for demo
      setLeaderboard(prev => {
        const updated = [...prev, {
          name: scoreData.name,
          score: scoreData.score,
          totalAnswered: scoreData.totalAnswered,
          bestStreak: scoreData.bestStreak,
          date: scoreData.date
        }]
        return updated.sort((a, b) => b.score - a.score).slice(0, 10)
      })
      return
    }

    try {
      const { error } = await supabase
        .from('leaderboard')
        .insert({
          name: scoreData.name,
          score: scoreData.score,
          total_answered: scoreData.totalAnswered,
          best_streak: scoreData.bestStreak
        })

      if (error) throw error
      
      // Refresh leaderboard
      await fetchLeaderboard()
    } catch (error) {
      console.error('Error saving score:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return <TriviaGame onScoreSubmit={handleScoreSubmit} leaderboard={leaderboard} />
}
