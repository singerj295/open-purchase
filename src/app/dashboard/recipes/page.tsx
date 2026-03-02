"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2, DollarSign, Calculator } from "lucide-react";
import { useTheme } from "@/lib/i18n/ThemeContext";

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

interface Recipe {
  id: string;
  name: string;
  description: string;
  servings: number;
  ingredients: Ingredient[];
  totalCost: number;
  menuPrice: number;
  profitMargin: number;
  category: string;
}

const mockRecipes: Recipe[] = [
  {
    id: "1",
    name: "Tomato Salmon Pasta",
    description: "Fresh Atlantic salmon with tomato cream sauce",
    servings: 2,
    category: "Main Course",
    totalCost: 45,
    menuPrice: 88,
    profitMargin: 48.9,
    ingredients: [
      { name: "Salmon Fillet", quantity: 200, unit: "g", unitPrice: 12, total: 2.4 },
      { name: "Pasta", quantity: 150, unit: "g", unitPrice: 0.5, total: 0.75 },
      { name: "Tomatoes", quantity: 3, unit: "pcs", unitPrice: 1.5, total: 4.5 },
      { name: "Cream", quantity: 100, unit: "ml", unitPrice: 0.8, total: 0.8 },
      { name: "Olive Oil", quantity: 30, unit: "ml", unitPrice: 0.5, total: 0.15 },
    ],
  },
  {
    id: "2",
    name: "Grilled Chicken Salad",
    description: "Healthy grilled chicken with mixed greens",
    servings: 1,
    category: "Healthy",
    totalCost: 18,
    menuPrice: 42,
    profitMargin: 57.1,
    ingredients: [
      { name: "Chicken Breast", quantity: 150, unit: "g", unitPrice: 8, total: 1.2 },
      { name: "Mixed Greens", quantity: 80, unit: "g", unitPrice: 3, total: 0.24 },
      { name: "Cherry Tomatoes", quantity: 6, unit: "pcs", unitPrice: 0.5, total: 0.3 },
      { name: "Cucumber", quantity: 0.5, unit: "pc", unitPrice: 2, total: 1 },
    ],
  },
  {
    id: "3",
    name: "Beef Burger",
    description: "Premium beef patty with fresh vegetables",
    servings: 1,
    category: "Main Course",
    totalCost: 22,
    menuPrice: 58,
    profitMargin: 62.1,
    ingredients: [
      { name: "Beef Patty", quantity: 200, unit: "g", unitPrice: 10, total: 2 },
      { name: "Burger Bun", quantity: 1, unit: "pc", unitPrice: 1.5, total: 1.5 },
      { name: "Lettuce", quantity: 2, unit: "leaves", unitPrice: 0.5, total: 0.1 },
      { name: "Tomato", quantity: 2, unit: "slices", unitPrice: 0.5, total: 0.1 },
    ],
  },
];

export default function RecipesPage() {
  const { lang, t } = useTheme() as { lang: "en" | "zh"; t: any };
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const currentLang = lang as "en" | "zh";
  const isZh = currentLang === "zh";

  const filteredRecipes = mockRecipes.filter((recipe) => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || recipe.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>
            {isZh ? "食譜成本計算" : "Recipe Costing"}
          </h1>
          <p style={{ color: 'var(--muted)', margin: '4px 0 0 0' }}>
            {isZh ? "計算每道菜的食材成本和利潤" : "Calculate ingredient costs and profit margins for each dish"}
          </p>
        </div>
        <button
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} />
          {isZh ? "新增食譜" : "Add Recipe"}
        </button>
      </div>

      {/* Search and Filter */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}
            size={18}
          />
          <input
            type="text"
            placeholder={isZh ? "搜尋食譜..." : "Search recipes..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="input"
          style={{ width: '180px' }}
        >
          <option value="all">{isZh ? "全部類別" : "All Categories"}</option>
          <option value="Main Course">{isZh ? "主菜" : "Main Course"}</option>
          <option value="Healthy">{isZh ? "健康" : "Healthy"}</option>
          <option value="Dessert">{isZh ? "甜品" : "Dessert"}</option>
        </select>
      </div>

      {/* Recipes Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px',
        }}
      >
        {filteredRecipes.map((recipe) => (
          <div key={recipe.id} className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>{recipe.name}</h3>
                <p style={{ color: 'var(--muted)', fontSize: '14px', margin: '4px 0 0 0' }}>{recipe.description}</p>
              </div>
              <span
                className="badge"
                style={{ background: 'rgba(45, 158, 109, 0.15)', color: 'var(--primary)' }}
              >
                {recipe.category}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
              <div style={{ padding: '12px', background: 'var(--background)', borderRadius: '12px' }}>
                <p style={{ color: 'var(--muted)', fontSize: '12px', margin: 0 }}>
                  {isZh ? "食材成本" : "Cost"}
                </p>
                <p style={{ fontSize: '20px', fontWeight: '600', margin: '4px 0 0 0' }}>
                  ${recipe.totalCost}
                </p>
              </div>
              <div style={{ padding: '12px', background: 'var(--background)', borderRadius: '12px' }}>
                <p style={{ color: 'var(--muted)', fontSize: '12px', margin: 0 }}>
                  {isZh ? "售價" : "Menu Price"}
                </p>
                <p style={{ fontSize: '20px', fontWeight: '600', margin: '4px 0 0 0', color: 'var(--primary)' }}>
                  ${recipe.menuPrice}
                </p>
              </div>
              <div style={{ padding: '12px', background: 'var(--background)', borderRadius: '12px' }}>
                <p style={{ color: 'var(--muted)', fontSize: '12px', margin: 0 }}>
                  {isZh ? "利潤率" : "Margin"}
                </p>
                <p style={{ fontSize: '20px', fontWeight: '600', margin: '4px 0 0 0', color: '#10b981' }}>
                  {recipe.profitMargin}%
                </p>
              </div>
              <div style={{ padding: '12px', background: 'var(--background)', borderRadius: '12px' }}>
                <p style={{ color: 'var(--muted)', fontSize: '12px', margin: 0 }}>
                  {isZh ? "份量" : "Servings"}
                </p>
                <p style={{ fontSize: '20px', fontWeight: '600', margin: '4px 0 0 0' }}>
                  {recipe.servings}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn-secondary"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <DollarSign size={16} />
                {isZh ? "成本分析" : "Cost Analysis"}
              </button>
              <button
                className="btn-secondary"
                style={{ padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Edit size={18} />
              </button>
              <button
                className="btn-secondary"
                style={{ padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
