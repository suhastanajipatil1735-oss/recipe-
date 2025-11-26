import React, { useState, useCallback, useRef } from 'react';
import { IngredientInput } from './components/IngredientInput';
import { RecipeCard, RecipeSkeleton } from './components/RecipeCard';
import { Ingredient, Recipe } from './types';
import { generateRecipesFromIngredients } from './services/geminiService';
import { ChefHatIcon } from './components/Icons';

const App: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleAddIngredient = useCallback((name: string) => {
    // Prevent duplicates
    if (ingredients.some(i => i.name.toLowerCase() === name.toLowerCase())) {
      return;
    }
    const newIngredient: Ingredient = {
      id: crypto.randomUUID(),
      name,
    };
    setIngredients(prev => [...prev, newIngredient]);
  }, [ingredients]);

  const handleRemoveIngredient = useCallback((id: string) => {
    setIngredients(prev => prev.filter(i => i.id !== id));
  }, []);

  const handleClearAll = useCallback(() => {
    setIngredients([]);
    setRecipes([]);
    setError(null);
  }, []);

  const handleGenerateRecipes = async () => {
    if (ingredients.length === 0) return;

    setIsLoading(true);
    setError(null);
    setRecipes([]); // Clear previous recipes

    // Scroll to results area if on mobile/smaller screens
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    try {
      const ingredientNames = ingredients.map(i => i.name);
      const generatedRecipes = await generateRecipesFromIngredients(ingredientNames);
      setRecipes(generatedRecipes);
    } catch (err: any) {
      console.error("App Error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 to-stone-100 flex flex-col font-sans">
      <header className="bg-white/80 backdrop-blur-md border-b border-emerald-100/50 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <ChefHatIcon className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-stone-800 tracking-tight">
              Eco<span className="text-emerald-600">Chef</span>
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-stone-500 bg-stone-100 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Gemini Powered
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto px-4 py-12 w-full">
        <div className="text-center mb-12 space-y-4 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-stone-800 tracking-tight">
            Smart Cooking, <br/>
            <span className="text-emerald-600">Less Waste.</span>
          </h2>
          <p className="text-lg text-stone-600 leading-relaxed">
            Enter the ingredients you have, and let AI craft delicious recipes to help you clear your fridge.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <IngredientInput
            ingredients={ingredients}
            onAddIngredient={handleAddIngredient}
            onRemoveIngredient={handleRemoveIngredient}
            onClearAll={handleClearAll}
          />

          <div className="flex justify-center mb-16">
            <button
              onClick={handleGenerateRecipes}
              disabled={ingredients.length === 0 || isLoading}
              className={`
                relative overflow-hidden group w-full sm:w-auto
                px-10 py-5 rounded-2xl text-lg font-bold shadow-xl transition-all duration-300 transform
                ${ingredients.length === 0 
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : isLoading 
                    ? 'bg-emerald-700 text-emerald-100 cursor-wait'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-200'
                }
              `}
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Chef is thinking...
                  </>
                ) : (
                  <>
                    <ChefHatIcon className="w-6 h-6" />
                    Find Recipes
                  </>
                )}
              </div>
            </button>
          </div>
        </div>

        <div ref={resultsRef} className="scroll-mt-24">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-2xl mb-12 text-center animate-bounce-in max-w-2xl mx-auto shadow-sm">
              <p className="font-semibold">{error}</p>
            </div>
          )}

          {isLoading && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1 bg-emerald-500 rounded-full"></div>
                <h3 className="text-2xl font-bold text-stone-800">
                  Creating your menu...
                </h3>
              </div>
              <div className="grid lg:grid-cols-2 gap-8">
                <RecipeSkeleton />
                <RecipeSkeleton />
              </div>
            </div>
          )}

          {!isLoading && recipes.length > 0 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-200">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1 bg-emerald-500 rounded-full"></div>
                  <h3 className="text-2xl font-bold text-stone-800">
                    Your Personalized Menu
                  </h3>
                </div>
                <span className="text-sm font-medium text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
                  {recipes.length} Results
                </span>
              </div>
              <div className="grid lg:grid-cols-2 gap-8">
                {recipes.map((recipe, index) => (
                  <RecipeCard key={index} recipe={recipe} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <footer className="bg-white border-t border-stone-100 py-8 text-center text-stone-400 text-sm mt-auto">
        <div className="max-w-4xl mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} EcoChef. Generated by Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
