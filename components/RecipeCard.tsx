import React from 'react';
import { Recipe } from '../types';
import { ClockIcon, FireIcon, ChefHatIcon } from './Icons';

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const difficultyColor = {
    Easy: 'text-emerald-700 bg-emerald-50 border-emerald-100',
    Medium: 'text-amber-700 bg-amber-50 border-amber-100',
    Hard: 'text-rose-700 bg-rose-50 border-rose-100',
  }[recipe.difficulty];

  return (
    <div className="bg-white rounded-3xl shadow-lg shadow-stone-200/60 border border-stone-100 overflow-hidden flex flex-col h-full group hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-500 animate-slide-up">
      <div className="p-8 flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-start gap-4 mb-3">
            <h3 className="text-2xl md:text-3xl font-bold text-stone-900 font-serif leading-tight">
              {recipe.title}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${difficultyColor} flex-shrink-0 mt-1`}>
              {recipe.difficulty}
            </span>
          </div>
          <p className="text-stone-600 text-sm leading-relaxed italic border-l-2 border-emerald-500 pl-4 py-1">
            "{recipe.description}"
          </p>
        </div>

        {/* Meta Data */}
        <div className="flex flex-wrap gap-4 mb-8 text-sm font-medium text-stone-600 pb-6 border-b border-stone-100">
          <div className="flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-lg">
            <ClockIcon className="w-4 h-4 text-emerald-600" />
            <span>{recipe.cookingTime}</span>
          </div>
          {recipe.calories && (
            <div className="flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-lg">
              <FireIcon className="w-4 h-4 text-orange-500" />
              <span>{recipe.calories} kcal</span>
            </div>
          )}
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-8 flex-1">
          {/* Ingredients */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">
                <ChefHatIcon className="w-3.5 h-3.5" />
              </span>
              Ingredients
            </h4>
            <ul className="space-y-3">
              {recipe.ingredients.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-stone-600 text-sm leading-relaxed">
                  <span className="w-1.5 h-1.5 mt-2 rounded-full bg-emerald-300 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">
                <span className="font-sans font-bold">#</span>
              </span>
              Instructions
            </h4>
            <ol className="space-y-6">
              {recipe.instructions.map((step, idx) => (
                <li key={idx} className="relative pl-6 text-stone-600 text-sm leading-relaxed">
                  <span className="absolute left-0 top-0 text-xs font-bold text-emerald-500/50 select-none">
                    {idx + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      
      {/* Decorative footer strip */}
      <div className="h-1.5 bg-gradient-to-r from-emerald-500/20 via-emerald-500/40 to-emerald-500/20"></div>
    </div>
  );
};

export const RecipeSkeleton = () => (
  <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8 h-full animate-pulse">
    <div className="flex justify-between mb-6">
      <div className="h-8 bg-stone-200 rounded w-2/3"></div>
      <div className="h-6 bg-stone-200 rounded-full w-16"></div>
    </div>
    <div className="h-16 bg-stone-100 rounded-xl mb-8"></div>
    <div className="flex gap-3 mb-8">
      <div className="h-8 w-24 bg-stone-100 rounded-lg"></div>
      <div className="h-8 w-24 bg-stone-100 rounded-lg"></div>
    </div>
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-3">
        <div className="h-6 w-32 bg-stone-200 rounded mb-2"></div>
        {[1,2,3,4].map(i => <div key={i} className="h-4 bg-stone-100 rounded w-full"></div>)}
      </div>
      <div className="space-y-3">
        <div className="h-6 w-32 bg-stone-200 rounded mb-2"></div>
        {[1,2,3,4].map(i => <div key={i} className="h-4 bg-stone-100 rounded w-full"></div>)}
      </div>
    </div>
  </div>
);