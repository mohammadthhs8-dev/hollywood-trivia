'use client'

import { useCallback, useRef } from 'react'

export function useSound() {
  const audioContextRef = useRef(null)

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    return audioContextRef.current
  }, [])

  const playSound = useCallback((type) => {
    try {
      const ctx = getAudioContext()
      
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      switch (type) {
        case 'correct':
          // Happy ascending chime
          oscillator.type = 'sine'
          oscillator.frequency.setValueAtTime(523.25, ctx.currentTime) // C5
          oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1) // E5
          oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2) // G5
          gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)
          oscillator.start(ctx.currentTime)
          oscillator.stop(ctx.currentTime + 0.4)
          break

        case 'wrong':
          // Sad descending buzz
          oscillator.type = 'sawtooth'
          oscillator.frequency.setValueAtTime(200, ctx.currentTime)
          oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3)
          gainNode.gain.setValueAtTime(0.2, ctx.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
          oscillator.start(ctx.currentTime)
          oscillator.stop(ctx.currentTime + 0.3)
          break

        case 'click':
          // Short click
          oscillator.type = 'sine'
          oscillator.frequency.setValueAtTime(600, ctx.currentTime)
          gainNode.gain.setValueAtTime(0.15, ctx.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05)
          oscillator.start(ctx.currentTime)
          oscillator.stop(ctx.currentTime + 0.05)
          break

        case 'select':
          // Category select whoosh
          oscillator.type = 'sine'
          oscillator.frequency.setValueAtTime(300, ctx.currentTime)
          oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15)
          gainNode.gain.setValueAtTime(0.2, ctx.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)
          oscillator.start(ctx.currentTime)
          oscillator.stop(ctx.currentTime + 0.15)
          break

        case 'streak':
          // Exciting streak sound
          const playNote = (freq, startTime, duration) => {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.connect(gain)
            gain.connect(ctx.destination)
            osc.type = 'sine'
            osc.frequency.setValueAtTime(freq, startTime)
            gain.gain.setValueAtTime(0.2, startTime)
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration)
            osc.start(startTime)
            osc.stop(startTime + duration)
          }
          playNote(523.25, ctx.currentTime, 0.1)
          playNote(659.25, ctx.currentTime + 0.1, 0.1)
          playNote(783.99, ctx.currentTime + 0.2, 0.1)
          playNote(1046.50, ctx.currentTime + 0.3, 0.2)
          break

        case 'gameOver':
          // Game complete fanfare
          const fanfare = (freq, start, dur) => {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.connect(gain)
            gain.connect(ctx.destination)
            osc.type = 'triangle'
            osc.frequency.setValueAtTime(freq, start)
            gain.gain.setValueAtTime(0.25, start)
            gain.gain.exponentialRampToValueAtTime(0.01, start + dur)
            osc.start(start)
            osc.stop(start + dur)
          }
          fanfare(392, ctx.currentTime, 0.2) // G4
          fanfare(523.25, ctx.currentTime + 0.2, 0.2) // C5
          fanfare(659.25, ctx.currentTime + 0.4, 0.2) // E5
          fanfare(783.99, ctx.currentTime + 0.6, 0.4) // G5
          break

        case 'hover':
          // Subtle hover
          oscillator.type = 'sine'
          oscillator.frequency.setValueAtTime(440, ctx.currentTime)
          gainNode.gain.setValueAtTime(0.05, ctx.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05)
          oscillator.start(ctx.currentTime)
          oscillator.stop(ctx.currentTime + 0.05)
          break

        case 'loading':
          // Pulsing loading sound
          oscillator.type = 'sine'
          oscillator.frequency.setValueAtTime(400, ctx.currentTime)
          oscillator.frequency.setValueAtTime(500, ctx.currentTime + 0.2)
          oscillator.frequency.setValueAtTime(400, ctx.currentTime + 0.4)
          gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
          gainNode.gain.setValueAtTime(0.15, ctx.currentTime + 0.2)
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)
          oscillator.start(ctx.currentTime)
          oscillator.stop(ctx.currentTime + 0.5)
          break

        default:
          break
      }
    } catch (e) {
      // Audio not supported or blocked
      console.log('Audio not available')
    }
  }, [getAudioContext])

  return playSound
}
