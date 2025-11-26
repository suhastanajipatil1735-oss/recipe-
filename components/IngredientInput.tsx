import React, { useState, KeyboardEvent, useRef } from 'react';
import { Ingredient } from '../types';
import { PlusIcon, XIcon, TrashIcon } from './Icons';

interface IngredientInputProps {
  ingredients: Ingredient[];
  onAddIngredient: (name: string) => void;
  onRemoveIngredient: (id: string) => void;
  onClearAll: () => void;
}

export const IngredientInput: React.FC<IngredientInputProps> = ({
  ingredients,
  onAddIngredient,
  onRemoveIngredient,
  onClearAll,
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      add();
    }
  };

  const add = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      onAddIngredient(trimmed);
      setInputValue('');
      inputRef.current?.focus();
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-8 mb-8 transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-stone-800 flex items-center gap-3">
          <div className="bg-emerald-100 text-emerald-700 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold">1</div>
          What's in your fridge?
        </h2>
        {ingredients.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm text-stone-400 hover:text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all"
          >
            <TrashIcon className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>
      
      <div className="relative flex-1 mb-6 group">
        <input
          ref={inputRef}
          type="text"
          className="w-full pl-5 pr-14 py-4 rounded-xl border-2 border-stone-200 bg-stone-50 text-stone-800 text-lg placeholder-stone-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all"
          placeholder="e.g. Avocado, Eggs, Sourdough..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={add}
          disabled={!inputValue.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 disabled:opacity-30 disabled:hover:bg-emerald-600 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="min-h-[40px]">
        {ingredients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-stone-400 text-sm border-2 border-dashed border-stone-100 rounded-xl bg-stone-50/50">
             <span className="mb-2 text-2xl">🥬 🥕 🥩</span>
            Type an ingredient and press Enter to start cooking!
          </div>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {ingredients.map((ing) => (
              <div
                key={ing.id}
                className="group flex items-center gap-2 pl-4 pr-2 py-2 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-full text-sm font-medium animate-fadeIn select-none hover:bg-emerald-100 hover:border-emerald-200 transition-colors"
              >
                {ing.name}
                <button
                  onClick={() => onRemoveIngredient(ing.id)}
                  className="p-1 hover:bg-white/50 rounded-full transition-colors text-emerald-600 hover:text-red-500"
                  aria-label={`Remove ${ing.name}`}
                >
                  <XIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
