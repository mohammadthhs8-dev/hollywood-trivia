import { NextResponse } from 'next/server'

const CATEGORY_PROMPTS = {
  "Oscar Moments": "Academy Awards, Oscar ceremonies, winners, nominations, memorable Oscar moments, acceptance speeches, and Oscar history",
  "Iconic Movie Lines": "famous movie quotes, memorable dialogue, iconic one-liners from films across all decades",
  "Celebrity Matchups": "celebrity couples, famous collaborations, actor partnerships, Hollywood relationships, co-stars who worked together multiple times",
  "Box Office Blockbusters": "highest-grossing films, box office records, blockbuster movies, commercial hits, opening weekend records",
  "Music & Movies": "movie soundtracks, film composers, songs from movies, musical moments in cinema, Oscar-winning songs",
  "Behind the Scenes": "film directors, movie production, Hollywood studios, filmmaking techniques, movie trivia about how films were made",
}

async function generateQuestion(apiKey, categoryContext, avoidanceText) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `Generate 1 trivia question about ${categoryContext}.

STRICT RULES:
- Only ask about facts you are ABSOLUTELY CERTAIN about
- Do NOT include specific numbers (years, durations, amounts) unless you are 100% sure
- Use "actor" for male performers, "actress" for female performers - NEVER mix these up
- The question must accurately describe the answer
- All 4 options must be the same type (all people, all movies, all years, etc.)
${avoidanceText}

Cover movies/people from different decades (1940s-2020s). Include a hint keyword from: oscar_statue, microphone, movie_camera, heart, money_bag, film_reel, star, popcorn, trophy, musical_note, director_chair, red_carpet, clapperboard, spotlight, ticket

Return ONLY this JSON format:
{
  "q": "Question here?",
  "a": "Correct Answer",
  "options": ["Correct Answer", "Wrong 1", "Wrong 2", "Wrong 3"],
  "hint": "keyword",
  "funFact": "Interesting fact about the answer"
}`
      }]
    })
  })

  if (!response.ok) {
    throw new Error('Failed to generate question')
  }

  const data = await response.json()
  const content = data.content[0].text
  
  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON found')
  
  return JSON.parse(jsonMatch[0])
}

async function validateQuestion(apiKey, question) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: `Validate this trivia question for factual accuracy:

Question: ${question.q}
Answer: ${question.a}
Options: ${question.options.join(', ')}

Check for these specific errors:
1. Is "${question.a}" the CORRECT answer to this question?
2. If the question mentions "actor" - is the answer male? If "actress" - is the answer female?
3. Are any numbers (years, durations, rankings) in the question accurate?
4. Does the question wording match what's being asked?

Respond with ONLY valid JSON:
{
  "valid": true or false,
  "reason": "Why it's invalid (only if valid is false)"
}`
      }]
    })
  })

  if (!response.ok) {
    // If validation fails, assume question is okay
    return { valid: true }
  }

  const data = await response.json()
  const content = data.content[0].text
  
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch {
    // If parsing fails, assume valid
  }
  
  return { valid: true }
}

export async function POST(request) {
  try {
    const { category, previousQuestions = [] } = await request.json()

    const apiKey = process.env.ANTHROPIC_API_KEY
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Anthropic API key not configured' },
        { status: 500 }
      )
    }

    const categoryContext = CATEGORY_PROMPTS[category] || category
    
    const recentQuestions = previousQuestions.slice(-20)
    const avoidanceText = recentQuestions.length > 0 
      ? `\nDo NOT ask about these topics already asked:\n${recentQuestions.map((q, i) => `- ${q}`).join('\n')}\n`
      : ''

    // Try up to 3 times to get a valid question
    let attempts = 0
    const maxAttempts = 3
    
    while (attempts < maxAttempts) {
      attempts++
      
      try {
        const question = await generateQuestion(apiKey, categoryContext, avoidanceText)
        
        // Validate the question structure
        if (!question.q || !question.a || !question.options || question.options.length !== 4) {
          continue
        }

        // Ensure correct answer is in options
        if (!question.options.includes(question.a)) {
          question.options[0] = question.a
        }

        // Validate factual accuracy
        const validation = await validateQuestion(apiKey, question)
        
        if (validation.valid) {
          return NextResponse.json({
            success: true,
            question: {
              q: question.q,
              a: question.a,
              options: question.options,
              hint: question.hint || 'star',
              funFact: question.funFact || null
            }
          })
        } else {
          console.log(`Question rejected (attempt ${attempts}): ${validation.reason}`)
        }
      } catch (err) {
        console.error(`Attempt ${attempts} failed:`, err)
      }
    }

    // Fallback question if all attempts fail
    return NextResponse.json({
      success: true,
      question: {
        q: "Which 1994 film features the quote 'Life is like a box of chocolates'?",
        a: "Forrest Gump",
        options: ["Forrest Gump", "The Shawshank Redemption", "Pulp Fiction", "The Lion King"],
        hint: "popcorn",
        funFact: "Tom Hanks' mother provided the voice for the quote in the film."
      }
    })

  } catch (error) {
    console.error('Error generating question:', error)
    return NextResponse.json(
      { error: 'Failed to generate question' },
      { status: 500 }
    )
  }
}
