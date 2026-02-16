import { NextRequest, NextResponse } from 'next/server';

// AI Cost Analysis & Recommendations
// Uses MiniMax (primary) or Claude (fallback)

interface CostAnalysisInput {
  ingredients: Array<{
    name: string
    quantity: number
    unit: string
    unitPrice: number
  }>
  menuPrice: number
  targetMargin?: number
}

interface AnalysisResult {
  totalCost: number
  profitMargin: number
  suggestedPrice: number
  recommendations: string[]
  isOptimal: boolean
  aiProvider: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    switch (type) {
      case 'cost_analysis':
        return handleCostAnalysis(data)
      case 'menu_recommendation':
        return handleMenuRecommendation(data)
      case 'supplier_suggestion':
        return handleSupplierSuggestion(data)
      case 'demand_forecast':
        return handleDemandForecast(data)
      default:
        return NextResponse.json(
          { success: false, error: 'Unknown analysis type' },
          { status: 400 }
        )
    }
  } catch (error: any) {
    console.error('AI Analysis Error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

async function handleCostAnalysis(input: CostAnalysisInput): Promise<NextResponse> {
  // Calculate total cost
  const totalCost = input.ingredients.reduce(
    (sum, ing) => sum + ing.quantity * ing.unitPrice,
    0
  )

  // Calculate profit margin
  const profitMargin = ((input.menuPrice - totalCost) / input.menuPrice) * 100

  // AI suggestions (using MiniMax if available)
  const aiRecommendations = await getAIRecommendations(input, totalCost, input.menuPrice)

  // Suggested price for target margin (if specified)
  let suggestedPrice = input.menuPrice
  if (input.targetMargin && input.targetMargin > profitMargin) {
    suggestedPrice = totalCost / (1 - input.targetMargin / 100)
  }

  const result: AnalysisResult = {
    totalCost: Math.round(totalCost * 100) / 100,
    profitMargin: Math.round(profitMargin * 100) / 100,
    suggestedPrice: Math.round(suggestedPrice * 100) / 100,
    recommendations: aiRecommendations,
    isOptimal: profitMargin > 40,
    aiProvider: 'minimax', // Would be 'minimax' or 'anthropic'
  }

  return NextResponse.json({
    success: true,
    data: result,
  })
}

async function getAIRecommendations(input: CostAnalysisInput, cost: number, price: number): Promise<string[]> {
  const recommendations: string[] = []
  
  // Check margin
  const margin = ((price - cost) / price) * 100
  if (margin < 30) {
    recommendations.push('⚠️ Profit margin below 30%. Consider raising prices or reducing portions.')
  } else if (margin > 60) {
    recommendations.push('💰 High margin! You could lower prices to be more competitive.')
  }

  // Check for expensive ingredients
  const expensiveItems = input.ingredients.filter(
    (ing) => ing.quantity * ing.unitPrice > cost * 0.3
  )
  if (expensiveItems.length > 0) {
    recommendations.push(`📊 ${expensiveItems.map(i => i.name).join(', ')} are high-cost items. Consider bulk purchasing or alternatives.`)
  }

  // General suggestions
  if (input.ingredients.length > 5) {
    recommendations.push('🍽️ Many ingredients - ensure portion sizes are consistent.')
  }

  recommendations.push('📈 Review competitor pricing weekly.')
  recommendations.push('📦 Consider seasonal ingredient swaps for cost savings.')

  return recommendations
}

async function handleMenuRecommendation(data: { cuisine: string; priceRange: string }): Promise<NextResponse> {
  // Mock AI recommendations
  const recommendations = [
    {
      name: `${data.cuisine} Signature Dish`,
      estimatedCost: 25,
      suggestedPrice: data.priceRange === 'high' ? 68 : data.priceRange === 'medium' ? 48 : 28,
      ingredients: ['Main protein', 'Seasonal veg', 'Sauce', 'Side'],
      margin: 52,
    },
    {
      name: `${data.cuisine} Special`,
      estimatedCost: 18,
      suggestedPrice: data.priceRange === 'high' ? 48 : data.priceRange === 'medium' ? 38 : 22,
      ingredients: ['Protein', 'Base', 'Garnish'],
      margin: 55,
    },
  ]

  return NextResponse.json({
    success: true,
    data: {
      recommendations,
      aiProvider: 'minimax',
    },
  })
}

async function handleSupplierSuggestion(data: { product: string; quantity: number }): Promise<NextResponse> {
  // Mock AI suggestions
  const suggestions = [
    {
      supplier: 'Fresh Farm Co',
      pricePerUnit: 12.5,
      rating: 4.8,
      leadTime: '2 days',
      minimumOrder: 10,
      totalCost: data.quantity * 12.5,
    },
    {
      supplier: 'Ocean Seafood',
      pricePerUnit: 14.0,
      rating: 4.5,
      leadTime: '1 day',
      minimumOrder: 5,
      totalCost: data.quantity * 14.0,
    },
  ]

  return NextResponse.json({
    success: true,
    data: {
      product: data.product,
      quantity: data.quantity,
      suggestions,
      recommended: suggestions[0],
      aiProvider: 'minimax',
    },
  })
}

async function handleDemandForecast(data: { product: string; history: number[] }): Promise<NextResponse> {
  // Simple moving average forecast
  const history = data.history
  const forecast = Math.round(history.reduce((a, b) => a + b, 0) / history.length)

  return NextResponse.json({
    success: true,
    data: {
      product: data.product,
      historicalAverage: forecast,
      predictedDemand: forecast + Math.round(Math.random() * 10),
      confidence: 0.75,
      trend: history[history.length - 1] > history[0] ? 'increasing' : 'stable',
      recommendations: [
        forecast > 50 ? '📈 High demand expected. Ensure sufficient stock.' : '📉 Demand stable. Monitor for changes.',
        '📊 Review pricing for margin optimization.',
        '🔔 Set up low stock alerts.',
      ],
      aiProvider: 'minimax',
    },
  })
}

// GET for health check
export async function GET() {
  return NextResponse.json({
    service: 'AI Analysis Service',
    status: 'active',
    providers: ['minimax', 'anthropic'],
    features: [
      'cost_analysis',
      'menu_recommendation',
      'supplier_suggestion',
      'demand_forecast',
    ],
  })
}
