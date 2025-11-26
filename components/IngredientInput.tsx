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
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative z-10">
        <div className="bg-white rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-100 p-2 pl-6 flex items-center gap-4 transition-all focus-within:ring-4 focus-within:ring-emerald-500/20 focus-within:border-emerald-500/50">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 py-4 text-lg bg-transparent border-none focus:outline-none focus:ring-0 placeholder-stone-400 text-stone-800"
            placeholder="Add an ingredient (e.g. Avocado)..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={add}
            disabled={!inputValue.trim()}
            className="p-3.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 transition-all active:scale-95 shadow-md"
            aria-label="Add ingredient"
          >
            <PlusIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="mt-8 min-h-[60px]">
        {ingredients.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-stone-400 text-sm font-medium">
              Start adding ingredients to unlock delicious recipes
            </p>
          </div>
        ) : (
          <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-4 px-2">
              <span className="text-sm font-semibold text-stone-500 uppercase tracking-wider">
                Your Pantry ({ingredients.length})
              </span>
              <button
                onClick={onClearAll}
                className="text-xs font-medium text-rose-500 hover:text-rose-700 flex items-center gap-1 hover:bg-rose-50 px-2 py-1 rounded transition-colors"
              >
                <TrashIcon className="w-3.5 h-3.5" />
                Clear All
              </button>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {ingredients.map((ing) => (
                <div
                  key={ing.id}
                  className="group flex items-center gap-2 pl-4 pr-2 py-2 bg-white border border-stone-200 shadow-sm rounded-full text-stone-700 text-sm font-medium animate-bounce-in select-none hover:border-emerald-300 hover:shadow-md transition-all"
                >
                  <span className="capitalize">{ing.name}</span>
                  <button
                    onClick={() => onRemoveIngredient(ing.id)}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-stone-400 hover:bg-rose-100 hover:text-rose-500 transition-colors"
                    aria-label={`Remove ${ing.name}`}
                  >
                    <XIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};