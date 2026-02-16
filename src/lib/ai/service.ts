// AI Service using MiniMax API (or Claude as fallback)
// Configure in .env: MINIMAX_API_KEY (or ANTHROPIC_API_KEY)

interface CostAnalysisInput {
  orders: Array<{
    orderNumber: string;
    totalAmount: number;
    items: Array<{ name: string; price: number }>;
    createdAt: string;
  }>;
  inventory: Array<{
    productName: string;
    quantity: number;
    minStock: number;
    price: number;
  }>;
  suppliers: Array<{ name: string; contact: string }>;
}

interface AIInsight {
  type: 'cost_optimization' | 'supplier_recommendation' | 'inventory_alert' | 'trend_analysis';
  title: string;
  description: string;
  actionable: boolean;
  priority: 'high' | 'medium' | 'low';
  recommendation?: string;
}

export class AIService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY || '';
  }

  /**
   * Analyze cost trends and provide insights
   */
  async analyzeCosts(input: CostAnalysisInput): Promise<AIInsight[]> {
    // Try MiniMax first, then fallback to Claude
    const minimaxKey = process.env.MINIMAX_API_KEY || '';
    const anthropicKey = process.env.ANTHROPIC_API_KEY || '';

    if (minimaxKey) {
      console.log('🤖 AI Analysis (MiniMax)');
      return this.analyzeWithMiniMax(input);
    } else if (anthropicKey) {
      console.log('🤖 AI Analysis (Claude)');
      return this.analyzeWithClaude(input);
    } else {
      console.log('🤖 AI Analysis (Demo Mode)');
      return this.getDemoInsights(input);
    }
  }

  /**
   * MiniMax API implementation
   */
  private async analyzeWithMiniMax(input: CostAnalysisInput): Promise<AIInsight[]> {
    try {
      const prompt = this.buildCostAnalysisPrompt(input);
      
      const response = await fetch('https://api.minimax.chat/v1/text/chatcompletion_v2', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.MINIMAX_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'MiniMax-M2.1',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1024,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || '';
      return this.parseInsights(text);
    } catch (error) {
      console.error('MiniMax API error:', error);
      return this.getDemoInsights(input);
    }
  }

  /**
   * Claude API implementation (fallback)
   */
  private async analyzeWithClaude(input: CostAnalysisInput): Promise<AIInsight[]> {
    try {
      const prompt = this.buildCostAnalysisPrompt(input);
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.ANTHROPIC_API_KEY}`,
          'Content-Type': 'application/json',
          'x-api-version': '2023-06-01',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      const data = await response.json();
      const text = data.content?.[0]?.text || '';
      return this.parseInsights(text);
    } catch (error) {
      console.error('Claude API error:', error);
      return this.getDemoInsights(input);
    }
  }

  /**
   * Generate supplier recommendations
   */
  async recommendSupplier(
    productName: string,
    requirements: { quantity: number; quality: string; budget: number }
  ): Promise<{ supplier: string; reasoning: string; confidence: number }> {
    const minimaxKey = process.env.MINIMAX_API_KEY || '';
    const anthropicKey = process.env.ANTHROPIC_API_KEY || '';

    if (!minimaxKey && !anthropicKey) {
      return {
        supplier: 'Fresh Farm Co',
        reasoning: 'Based on product category and typical pricing',
        confidence: 0.75,
      };
    }

    const prompt = `Recommend a supplier for:
Product: ${productName}
Quantity needed: ${requirements.quantity}
Quality level: ${requirements.quality}
Budget: $${requirements.budget}

Available suppliers: Fresh Farm Co, Ocean Seafood, Kitchen Supplies Ltd, Spice World

Return JSON only: { "supplier": "name", "reasoning": "why", "confidence": 0.0-1.0 }`;

    try {
      if (minimaxKey) {
        const response = await fetch('https://api.minimax.chat/v1/text/chatcompletion_v2', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${minimaxKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'MiniMax-M2.1',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 256,
          }),
        });

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content || '';
        return JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] || '{"supplier":"Fresh Farm Co","reasoning":"Default","confidence":0.5}');
      } else {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${anthropicKey}`,
            'Content-Type': 'application/json',
            'x-api-version': '2023-06-01',
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 256,
            messages: [{ role: 'user', content: prompt }],
          }),
        });

        const data = await response.json();
        const text = data.content?.[0]?.text || '';
        return JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] || '{"supplier":"Fresh Farm Co","reasoning":"Default","confidence":0.5}');
      }
    } catch (error) {
      return {
        supplier: 'Fresh Farm Co',
        reasoning: 'Based on available options',
        confidence: 0.5,
      };
    }
  }

  /**
   * Predict inventory needs
   */
  async predictInventory(
    productName: string,
    historicalUsage: number[],
    leadTimeDays: number
  ): Promise<{ recommendedOrder: number; reasoning: string }> {
    // Simple prediction using moving average
    const avgUsage = historicalUsage.reduce((a, b) => a + b, 0) / historicalUsage.length;
    const predictedNeed = Math.ceil(avgUsage * (leadTimeDays + 7)); // 7 days buffer

    return {
      recommendedOrder: predictedNeed,
      reasoning: `Based on average usage of ${avgUsage.toFixed(1)}/day and ${leadTimeDays} day lead time`,
    };
  }

  private buildCostAnalysisPrompt(input: CostAnalysisInput): string {
    return `Analyze the following procurement data and provide actionable insights:

ORDERS:
${input.orders.map(o => `- ${o.orderNumber}: $${o.totalAmount} on ${o.createdAt}`).join('\n')}

INVENTORY:
${input.inventory.map(i => `- ${i.productName}: ${i.quantity} in stock (min: ${i.minStock}, price: $${i.price})`).join('\n')}

SUPPLIERS:
${input.suppliers.map(s => `- ${s.name}`).join('\n')}

Provide 4-5 insights in JSON format:
[
  {
    "type": "cost_optimization|supplier_recommendation|inventory_alert|trend_analysis",
    "title": "Brief title",
    "description": "Detailed description",
    "actionable": true/false,
    "priority": "high|medium|low",
    "recommendation": "Specific action to take"
  }
]

Focus on:
1. Cost saving opportunities
2. Supplier performance
3. Inventory optimization
4. Spending trends`;
  }

  private parseInsights(text: string): AIInsight[] {
    try {
      // Try to parse JSON from response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return this.getDemoInsights({ orders: [], inventory: [], suppliers: [] });
    } catch {
      return this.getDemoInsights({ orders: [], inventory: [], suppliers: [] });
    }
  }

  private getDemoInsights(input: CostAnalysisInput): AIInsight[] {
    const insights: AIInsight[] = [];

    // Cost optimization
    insights.push({
      type: 'cost_optimization',
      title: 'Consolidate Orders',
      description: 'Combining orders from Fresh Farm Co and Ocean Seafood could reduce delivery costs.',
      actionable: true,
      priority: 'medium',
      recommendation: 'Schedule combined orders on Tuesdays and Fridays.',
    });

    // Supplier recommendation
    insights.push({
      type: 'supplier_recommendation',
      title: 'Ocean Seafood Pricing',
      description: 'Sea Bass prices increased 12% this month. Consider negotiating or finding alternatives.',
      actionable: true,
      priority: 'high',
      recommendation: 'Request price quote from alternative suppliers.',
    });

    // Inventory alert
    const lowStock = input.inventory.filter(i => i.quantity <= i.minStock);
    if (lowStock.length > 0) {
      insights.push({
        type: 'inventory_alert',
        title: `${lowStock.length} Items Below Minimum Stock`,
        description: 'Multiple items need restocking soon.',
        actionable: true,
        priority: 'high',
        recommendation: `Restock: ${lowStock.map(i => i.productName).join(', ')}`,
      });
    }

    // Trend analysis
    insights.push({
      type: 'trend_analysis',
      title: 'Weekly Spending Pattern',
      description: 'Highest spending occurs on weekends. Consider pre-ordering to get better prices.',
      actionable: true,
      priority: 'low',
      recommendation: 'Place advance orders on weekdays.',
    });

    return insights;
  }
}

export const aiService = new AIService();
