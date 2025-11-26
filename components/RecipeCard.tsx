import React from 'react';
import { Recipe } from '../types';
import { ClockIcon, FireIcon } from './Icons';

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const difficultyColor = {
    Easy: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Medium: 'bg-amber-100 text-amber-800 border-amber-200',
    Hard: 'bg-rose-100 text-rose-800 border-rose-200',
  }[recipe.difficulty] || 'bg-stone-100 text-stone-800 border-stone-200';

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-stone-200 overflow-hidden transition-all duration-300 flex flex-col h-full group">
      <div className="h-2 bg-gradient-to-r from-emerald-400 to-teal-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
      <div className="p-6 md:p-8 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4 gap-4">
          <h3 className="text-2xl font-bold text-stone-900 font-serif leading-tight">
            {recipe.title}
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase border ${difficultyColor} flex-shrink-0`}>
            {recipe.difficulty}
          </span>
        </div>
        
        <p className="text-stone-600 mb-6 text-sm leading-relaxed border-l-4 border-stone-200 pl-4 italic">
          {recipe.description}
        </p>

        <div className="flex flex-wrap items-center gap-4 mb-8 text-sm font-medium text-stone-500 bg-stone-50 p-3 rounded-lg border border-stone-100">
          <div className="flex items-center gap-2">
            <ClockIcon className="w-4 h-4 text-emerald-600" />
            <span>{recipe.cookingTime}</span>
          </div>
          <div className="w-px h-4 bg-stone-300"></div>
          {recipe.calories && (
            <div className="flex items-center gap-2">
              <FireIcon className="w-4 h-4 text-orange-500" />
              <span>{recipe.calories} kcal</span>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 flex-1">
          <div>
            <h4 className="flex items-center gap-2 text-sm font-bold text-stone-900 uppercase tracking-wider mb-4 pb-2 border-b border-stone-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Ingredients
            </h4>
            <ul className="space-y-3">
              {recipe.ingredients.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-stone-700 text-sm group/item">
                  <div className="w-1.5 h-1.5 mt-2 rounded-full bg-stone-300 group-hover/item:bg-emerald-400 transition-colors flex-shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="flex items-center gap-2 text-sm font-bold text-stone-900 uppercase tracking-wider mb-4 pb-2 border-b border-stone-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Instructions
            </h4>
            <ol className="space-y-4">
              {recipe.instructions.map((step, idx) => (
                <li key={idx} className="flex gap-4 text-stone-700 text-sm">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs font-bold border border-emerald-100 shadow-sm">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed mt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RecipeSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden h-full">
    <div className="h-2 bg-stone-100"></div>
    <div className="p-6 md:p-8 animate-pulse">
      <div className="flex justify-between items-start mb-6">
        <div className="h-8 bg-stone-200 rounded-lg w-2/3"></div>
        <div className="h-6 bg-stone-200 rounded-full w-20"></div>
      </div>
      
      <div className="h-20 bg-stone-100 rounded-xl mb-6 border-l-4 border-stone-200"></div>

      <div className="flex gap-4 mb-8">
        <div className="h-8 bg-stone-100 rounded-lg w-24"></div>
        <div className="h-8 bg-stone-100 rounded-lg w-24"></div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
           <div className="h-6 bg-stone-200 rounded w-32 mb-4"></div>
           <div className="space-y-3">
             {[1, 2, 3, 4].map(i => (
               <div key={i} className="flex gap-3">
                 <div className="w-2 h-2 mt-2 rounded-full bg-stone-200"></div>
                 <div className="h-4 bg-stone-100 rounded w-full"></div>
               </div>
             ))}
           </div>
        </div>
        <div>
           <div className="h-6 bg-stone-200 rounded w-32 mb-4"></div>
           <div className="space-y-4">
             {[1, 2, 3].map(i => (
               <div key={i} className="flex gap-3">
                 <div className="w-6 h-6 rounded-full bg-stone-200 flex-shrink-0"></div>
                 <div className="space-y-2 w-full">
                   <div className="h-4 bg-stone-100 rounded w-full"></div>
                   <div className="h-4 bg-stone-100 rounded w-5/6"></div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  </div>
);
