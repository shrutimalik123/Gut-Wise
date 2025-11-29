import React from 'react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
  onAddToPlan?: (recipe: Recipe) => void;
  onTrack?: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSelect, onAddToPlan, onTrack }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-sage-100 flex flex-col h-full group">
      <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => onSelect(recipe)}>
        <img 
          src={`https://picsum.photos/seed/${recipe.imageKeyword || recipe.id}/600/400`} 
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <span className="text-white text-xs font-bold uppercase tracking-wider bg-sage-600 px-2 py-1 rounded-full">
                {recipe.tags[0] || 'Healthy'}
            </span>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-serif text-xl font-bold text-sage-900 mb-2 leading-tight cursor-pointer hover:text-sage-600 transition-colors" onClick={() => onSelect(recipe)}>
          {recipe.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recipe.description}</p>
        
        <div className="mt-auto">
            <div className="flex items-center justify-between text-xs text-sage-600 font-medium mb-3">
                <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {recipe.prepTime}
                </span>
                <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                    {recipe.calories} kcal
                </span>
            </div>

            <div className="flex gap-2">
                <button 
                    onClick={() => onSelect(recipe)}
                    className="flex-1 px-3 py-2 bg-sage-50 text-sage-700 text-sm font-medium rounded-lg hover:bg-sage-100 transition-colors"
                >
                    View Details
                </button>
                {onAddToPlan && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onAddToPlan(recipe); }}
                        className="p-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition-colors"
                        title="Add to Meal Plan"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    </button>
                )}
                {onTrack && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onTrack(recipe); }}
                        className="p-2 bg-oat-400 text-white rounded-lg hover:bg-oat-500 transition-colors"
                        title="Log Meal & Symptoms"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                    </button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};