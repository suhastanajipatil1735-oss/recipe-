import React, { useState, useCallback, useRef } from 'react';
import { IngredientInput } from './components/IngredientInput';
import { RecipeCard, RecipeSkeleton } from './components/RecipeCard';
import { Ingredient, Recipe } from './types';
import { generateRecipesFromIngredients } from './services/geminiService';
import { ChefHatIcon, FireIcon } from './components/Icons';

const App: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleAddIngredient = useCallback((name: string) => {
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
    setRecipes([]);
    
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
    <div className="min-h-screen flex flex-col font-sans text-stone-900 bg-[#FAFAF9]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-stone-200/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-1.5 rounded-lg">
              <ChefHatIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-serif tracking-tight text-stone-900">
              EcoChef
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Powered by Gemini
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 px-6 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-50/50 via-[#FAFAF9] to-[#FAFAF9] -z-10"></div>
          
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-2">
                <FireIcon className="w-3.5 h-3.5" />
                Reduce Waste
              </div>
              <h1 className="text-5xl md:text-7xl font-bold font-serif text-stone-900 leading-[1.1]">
                Turn your pantry into <br className="hidden md:block" />
                <span className="text-emerald-600 relative inline-block">
                   a gourmet meal.
                   <svg className="absolute w-full h-3 -bottom-1 left-0 text-emerald-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                     <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                   </svg>
                </span>
              </h1>
              <p className="text-xl text-stone-500 max-w-2xl mx-auto leading-relaxed">
                Don't know what to cook? Enter the ingredients you have on hand, and let our AI chef craft personalized sustainable recipes for you.
              </p>
            </div>

            <IngredientInput
              ingredients={ingredients}
              onAddIngredient={handleAddIngredient}
              onRemoveIngredient={handleRemoveIngredient}
              onClearAll={handleClearAll}
            />

            <div className="pt-8">
               <button
                onClick={handleGenerateRecipes}
                disabled={ingredients.length === 0 || isLoading}
                className={`
                  group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-300 rounded-full shadow-lg overflow-hidden
                  ${ingredients.length === 0 
                    ? 'bg-stone-300 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-200 hover:-translate-y-1'
                  }
                `}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Magic...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Generate Recipes
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section ref={resultsRef} className="max-w-6xl mx-auto px-6 pb-24">
          {error && (
            <div className="max-w-2xl mx-auto bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl text-center mb-12">
              <p className="font-medium">{error}</p>
            </div>
          )}

          {isLoading && (
             <div className="grid lg:grid-cols-2 gap-8 animate-fadeIn">
               <RecipeSkeleton />
               <RecipeSkeleton />
             </div>
          )}

          {!isLoading && recipes.length > 0 && (
            <div className="space-y-10 animate-fadeIn">
              <div className="flex items-end justify-between border-b border-stone-200 pb-4">
                <h2 className="text-3xl font-serif font-bold text-stone-900">
                  Recommended Recipes
                </h2>
                <span className="text-sm font-medium text-stone-500">
                  Found {recipes.length} results
                </span>
              </div>
              <div className="grid lg:grid-cols-2 gap-8">
                {recipes.map((recipe, index) => (
                  <RecipeCard key={index} recipe={recipe} />
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="bg-white border-t border-stone-200 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 mb-4 opacity-50 grayscale hover:grayscale-0 transition-all">
            <ChefHatIcon className="w-6 h-6" />
            <span className="font-serif font-bold text-lg">EcoChef</span>
          </div>
          <p className="text-stone-400 text-sm">
            © {new Date().getFullYear()} EcoChef. Helping you cook better, waste less.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;