import React from 'react';
import { Recipe } from '../types';

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose }) => {
  if (!recipe) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sage-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-fadeIn">
        
        {/* Header Image */}
        <div className="relative h-64 shrink-0">
          <img 
            src={`https://picsum.photos/seed/${recipe.imageKeyword || recipe.id}/800/600`} 
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 p-2 rounded-full hover:bg-white text-sage-900 shadow-sm transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div className="absolute bottom-4 left-4 flex gap-2">
            {recipe.tags.map(tag => (
                <span key={tag} className="bg-sage-900/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium tracking-wide">
                    {tag}
                </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto">
          <div className="mb-6">
            <h2 className="font-serif text-3xl font-bold text-sage-900 mb-2">{recipe.title}</h2>
            <div className="flex items-center gap-6 text-sm text-sage-600 mb-4">
                <span className="flex items-center"><svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> {recipe.prepTime}</span>
                <span className="flex items-center"><svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg> {recipe.calories} kcal</span>
            </div>
            
            <div className="bg-oat-100 p-4 rounded-xl border border-oat-200">
                <h4 className="text-sage-800 font-bold mb-1 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-sage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Why it's gut-friendly
                </h4>
                <p className="text-sage-700 text-sm leading-relaxed">{recipe.gutBenefits}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Ingredients */}
            <div>
              <h3 className="font-serif text-xl font-bold text-sage-900 mb-4 border-b border-sage-100 pb-2">Ingredients</h3>
              <ul className="space-y-3">
                {recipe.ingredients.map((ing, idx) => (
                  <li key={idx} className="flex items-center text-sage-800">
                    <div className="w-1.5 h-1.5 rounded-full bg-sage-400 mr-3"></div>
                    <span className="font-semibold mr-2 text-sage-900">{ing.amount}</span>
                    <span>{ing.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div>
              <h3 className="font-serif text-xl font-bold text-sage-900 mb-4 border-b border-sage-100 pb-2">Preparation</h3>
              <div className="space-y-6">
                {recipe.instructions.map((inst, idx) => (
                  <div key={idx} className="flex">
                    <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-sage-100 text-sage-600 text-xs font-bold mr-4 mt-0.5">
                        {idx + 1}
                    </span>
                    <p className="text-sage-800 leading-relaxed">{inst}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
