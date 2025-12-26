import { NextResponse } from 'next/server'
import { z } from 'zod'

// Schema de validation des réponses du quiz
const quizAnswersSchema = z.object({
  answers: z.record(z.string(), z.string()),
})

// Schema de la réponse du backend FastAPI
const formationDetailsSchema = z.object({
  name: z.string(),
  reason: z.string(),
})

const recommendationSchema = z.object({
  profil_analysis: z.string(),
  principal_program: formationDetailsSchema,
  complementary_modules: z.array(formationDetailsSchema),
  motivation_message: z.string(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validation des données entrantes
    const validatedData = quizAnswersSchema.parse(body)

    // URL du backend FastAPI
    const fastApiUrl = process.env.FASTAPI_URL || 'http://localhost:8000'

    // Appel au backend FastAPI
    const response = await fetch(`${fastApiUrl}/api/recommander`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('FastAPI Error:', errorText)
      throw new Error(`FastAPI returned ${response.status}: ${errorText}`)
    }

    const recommendation = await response.json()

    // Validation de la réponse
    const validatedRecommendation = recommendationSchema.parse(recommendation)

    return NextResponse.json(validatedRecommendation)
  } catch (error) {
    console.error('Error in quiz recommendation:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la génération des recommandations' },
      { status: 500 }
    )
  }
}
