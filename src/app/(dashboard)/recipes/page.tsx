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
    menuPrice: 48,
    profitMargin: 62.5,
    ingredients: [
      { name: "Chicken Breast", quantity: 150, unit: "g", unitPrice: 2.5, total: 3.75 },
      { name: "Mixed Greens", quantity: 100, unit: "g", unitPrice: 1.2, total: 1.2 },
      { name: "Cherry Tomatoes", quantity: 50, unit: "g", unitPrice: 2, total: 1 },
      { name: "Cucumber", quantity: 0.5, unit: "pc", unitPrice: 1, total: 0.5 },
    ],
  },
  {
    id: "3",
    name: "Beef Steak with Rosemary",
    description: "Premium beef ribeye with rosemary butter",
    servings: 1,
    category: "Main Course",
    totalCost: 65,
    menuPrice: 168,
    profitMargin: 61.3,
    ingredients: [
      { name: "Ribeye Steak", quantity: 250, unit: "g", unitPrice: 18, total: 45 },
      { name: "Rosemary Butter", quantity: 30, unit: "g", unitPrice: 1.5, total: 0.45 },
      { name: "Garlic", quantity: 3, unit: "cloves", unitPrice: 0.1, total: 0.3 },
      { name: "Potatoes", quantity: 2, unit: "pcs", unitPrice: 0.8, total: 1.6 },
    ],
  },
];

const categoryColors: Record<string, string> = {
  "Main Course": "bg-blue-100 text-blue-700",
  "Healthy": "bg-green-100 text-green-700",
  "Dessert": "bg-pink-100 text-pink-700",
  "Beverage": "bg-yellow-100 text-yellow-700",
};

export default function RecipesPage() {
  const { lang, t } = useTheme();
  const [recipes, setRecipes] = useState<Recipe[]>(mockRecipes);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const filteredRecipes = recipes.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t.$1)}
          </h1>
          <p className="text-gray-500">
            {t.$1)}
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedRecipe(null);
            setShowModal(true);
          }}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
        >
          <Plus size={20} />
          {t.$1)}
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder={t.$1)}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center gap-2">
            <Calculator className="text-emerald-500" size={20} />
            <span className="text-gray-500 text-sm">{t.$1)}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-2">{recipes.length}</h3>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center gap-2">
            <DollarSign className="text-blue-500" size={20} />
            <span className="text-gray-500 text-sm">{t.$1)}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-2">
            {Math.round(recipes.reduce((acc, r) => acc + r.profitMargin, 0) / recipes.length)}%
          </h3>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center gap-2">
            <DollarSign className="text-green-500" size={20} />
            <span className="text-gray-500 text-sm">{t.$1)}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-2">
            ${Math.round(recipes.reduce((acc, r) => acc + r.totalCost, 0) / recipes.length)}
          </h3>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center gap-2">
            <DollarSign className="text-purple-500" size={20} />
            <span className="text-gray-500 text-sm">{t.$1)}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-2">
            ${Math.round(recipes.reduce((acc, r) => acc + r.menuPrice, 0) / recipes.length)}
          </h3>
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[recipe.category] || 'bg-gray-100 text-gray-700'}`}>
                    {recipe.category}
                  </span>
                  <h3 className="font-semibold text-gray-900 mt-2 text-lg">{recipe.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{recipe.description}</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setSelectedRecipe(recipe);
                      setShowModal(true);
                    }}
                    className="p-1.5 hover:bg-gray-100 rounded"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(t.$1) {
                        setRecipes(recipes.filter((r) => r.id !== recipe.id));
                      }
                    }}
                    className="p-1.5 hover:bg-gray-100 rounded text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-gray-500">{t.$1)}</p>
                  <p className="font-semibold text-gray-900">${recipe.totalCost}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t.$1)}</p>
                  <p className="font-semibold text-emerald-600">${recipe.menuPrice}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t.$1)}</p>
                  <p className={`font-semibold ${recipe.profitMargin > 50 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {recipe.profitMargin.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">{t.$1)}</p>
                <div className="space-y-1">
                  {recipe.ingredients.slice(0, 3).map((ing, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-600">{ing.name}</span>
                      <span className="text-gray-400">${ing.total.toFixed(2)}</span>
                    </div>
                  ))}
                  {recipe.ingredients.length > 3 && (
                    <p className="text-xs text-emerald-600 mt-2">
                      +{recipe.ingredients.length - 3} {t.$1)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedRecipe ? t.$1)}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.$1)}
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedRecipe?.name}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.$1)}
                  </label>
                  <select
                    defaultValue={selectedRecipe?.category}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                  >
                    <option value="Main Course">{t.$1)}</option>
                    <option value="Healthy">{t.$1)}</option>
                    <option value="Dessert">{t.$1)}</option>
                    <option value="Beverage">{t.$1)}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.$1)}
                  </label>
                  <input
                    type="number"
                    defaultValue={selectedRecipe?.servings}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.$1)}
                  </label>
                  <input
                    type="number"
                    defaultValue={selectedRecipe?.menuPrice}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.$1)}
                  </label>
                  <input
                    type="number"
                    disabled
                    defaultValue={selectedRecipe?.totalCost}
                    className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.$1)}
                </label>
                <div className="border rounded-lg p-4 space-y-2 bg-gray-50">
                  {selectedRecipe?.ingredients.map((ing, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        defaultValue={ing.name}
                        placeholder={t.$1)}
                        className="flex-1 px-3 py-2 border rounded-lg text-sm text-gray-900"
                      />
                      <input
                        type="number"
                        defaultValue={ing.quantity}
                        placeholder={t.$1)}
                        className="w-20 px-3 py-2 border rounded-lg text-sm text-gray-900"
                      />
                      <input
                        type="text"
                        defaultValue={ing.unit}
                        placeholder={t.$1)}
                        className="w-16 px-3 py-2 border rounded-lg text-sm text-gray-900"
                      />
                      <input
                        type="number"
                        defaultValue={ing.unitPrice}
                        placeholder={t.$1)}
                        className="w-24 px-3 py-2 border rounded-lg text-sm text-gray-900"
                      />
                    </div>
                  ))}
                  <button className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-emerald-500 hover:text-emerald-600 text-sm">
                    + {t.$1)}
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3 sticky bottom-0 bg-white">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                {t.$1)}
              </button>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                {t.$1)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
