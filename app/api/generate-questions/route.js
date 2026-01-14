import { NextResponse } from 'next/server'

const CATEGORY_PROMPTS = {
  "Oscar Moments": "Academy Awards, Oscar ceremonies, winners, nominations, memorable Oscar moments, acceptance speeches, and Oscar history",
  "Iconic Movie Lines": "famous movie quotes, memorable dialogue, iconic one-liners from films across all decades",
  "Celebrity Matchups": "celebrity couples, famous collaborations, actor partnerships, Hollywood relationships, co-stars who worked together multiple times",
  "Box Office Blockbusters": "highest-grossing films, box office records, blockbuster movies, commercial hits, opening weekend records",
  "Music & Movies": "movie soundtracks, film composers, songs from movies, musical moments in cinema, Oscar-winning songs",
  "Behind the Scenes": "film directors, movie production, Hollywood studios, filmmaking techniques, movie trivia about how films were made",
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
    
    // Build the avoidance list - only use last 20 to keep prompt manageable
    const recentQuestions = previousQuestions.slice(-20)
    const avoidanceText = recentQuestions.length > 0 
      ? `\n\nIMPORTANT: Do NOT ask about any of these topics that were already asked:\n${recentQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}\n\nGenerate a COMPLETELY DIFFERENT question about a different movie, person, or topic.`
      : ''

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
          content: `Generate 1 unique trivia question about ${categoryContext}.

CRITICAL ACCURACY REQUIREMENTS:
- You must be 100% certain of the correct answer before generating the question
- Double-check that the question wording matches the answer (e.g., if the answer is a man, don't say "actress" or "woman")
- Verify gender terms: use "actor" for men, "actress" for women, or use gender-neutral "performer" if unsure
- All options must be plausible and from the same category (e.g., all actors, all movies, all years)
- The wrong options must be clearly wrong, not arguably correct
- If you're not 100% sure about a fact, choose a different question topic

Requirements:
- Question should be interesting and fun
- Vary difficulty (some easy, some medium, some challenging)
- Cover a WIDE variety of movies, actors, directors from different decades (1950s to 2020s)
- Include a visual hint keyword that represents the question (like "oscar_statue", "microphone", "movie_camera", "heart", "money_bag", "film_reel", "star", "popcorn", "trophy", "musical_note", "director_chair", "red_carpet", "clapperboard", "spotlight", "ticket")
${avoidanceText}

Before outputting, verify:
1. Is the answer factually correct?
2. Does the question wording accurately describe the answer?
3. Are all gender references correct?
4. Are the wrong options clearly wrong?

Return ONLY valid JSON in this exact format, no other text:
{
  "q": "The question text here?",
  "a": "Correct Answer",
  "options": ["Correct Answer", "Wrong Option 1", "Wrong Option 2", "Wrong Option 3"],
  "hint": "keyword_here",
  "funFact": "A brief interesting fact related to the answer"
}`
        }]
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Anthropic API error:', errorText)
      return NextResponse.json(
        { error: 'Failed to generate question' },
        { status: 500 }
      )
    }

    const data = await response.json()
    const content = data.content[0].text

    // Parse the JSON response
    let question
    try {
      // Try to extract JSON if there's any extra text
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        question = JSON.parse(jsonMatch[0])
      } else {
        question = JSON.parse(content)
      }
    } catch (parseError) {
      console.error('Failed to parse question:', content)
      return NextResponse.json(
        { error: 'Failed to parse generated question' },
        { status: 500 }
      )
    }

    // Validate the question structure
    if (!question.q || !question.a || !question.options || question.options.length !== 4) {
      return NextResponse.json(
        { error: 'Invalid question format' },
        { status: 500 }
      )
    }

    // Ensure correct answer is in options
    if (!question.options.includes(question.a)) {
      question.options[0] = question.a
    }

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

  } catch (error) {
    console.error('Error generating question:', error)
    return NextResponse.json(
      { error: 'Failed to generate question' },
      { status: 500 }
    )
  }
}
