import React from 'react';
import { JournalEntry, AppView } from '../types';

interface JournalProps {
  entries: JournalEntry[];
  onNavigateToRecipes: () => void;
}

export const Journal: React.FC<JournalProps> = ({ entries, onNavigateToRecipes }) => {
  const getRatingColor = (rating: JournalEntry['rating']) => {
    switch (rating) {
      case 'Great': return 'bg-green-100 text-green-800 border-green-200';
      case 'Good': return 'bg-sage-100 text-sage-800 border-sage-200';
      case 'Fair': return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'Poor': return 'bg-red-50 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingIcon = (rating: JournalEntry['rating']) => {
    switch (rating) {
      case 'Great': return '😄';
      case 'Good': return '🙂';
      case 'Fair': return '😐';
      case 'Poor': return '🤢';
      default: return '🍽️';
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="font-serif text-3xl font-bold text-sage-900">Gut Health Journal</h2>
          <p className="text-sage-600 mt-1">
            Track how different foods affect your body to identify patterns.
          </p>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-dashed border-sage-300 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-oat-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">📝</span>
            </div>
            <h3 className="font-bold text-sage-800 text-lg mb-2">No entries yet</h3>
            <p className="text-sage-500 mb-6 max-w-sm">
                Start tracking by logging a meal from your Meal Plan. This helps the AI understand your unique gut triggers.
            </p>
            <button 
                onClick={onNavigateToRecipes}
                className="px-6 py-2.5 bg-sage-600 text-white font-medium rounded-lg hover:bg-sage-700 transition-colors"
            >
                Go to Meal Plan
            </button>
        </div>
      ) : (
        <div className="space-y-4">
            {/* Stats Summary - Simple version */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-4 rounded-xl border border-sage-100 shadow-sm">
                    <div className="text-2xl font-bold text-sage-900">{entries.length}</div>
                    <div className="text-xs text-sage-500 font-bold uppercase tracking-wider">Meals Logged</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-sage-100 shadow-sm">
                    <div className="text-2xl font-bold text-green-700">
                        {entries.filter(e => e.rating === 'Great' || e.rating === 'Good').length}
                    </div>
                    <div className="text-xs text-sage-500 font-bold uppercase tracking-wider">Good Reactions</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-sage-100 shadow-sm">
                    <div className="text-2xl font-bold text-red-500">
                        {entries.filter(e => e.rating === 'Poor').length}
                    </div>
                    <div className="text-xs text-sage-500 font-bold uppercase tracking-wider">Triggers Found</div>
                </div>
            </div>

            <h3 className="text-sm font-bold text-sage-500 uppercase tracking-wider mb-4">Recent History</h3>
            
            <div className="relative border-l-2 border-sage-100 ml-4 space-y-8 pb-4">
                {entries.slice().reverse().map((entry) => (
                    <div key={entry.id} className="relative pl-8">
                        {/* Timeline dot */}
                        <div className="absolute -left-[9px] top-4 w-4 h-4 rounded-full bg-white border-2 border-sage-300"></div>
                        
                        <div className="bg-white rounded-xl border border-sage-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
                                <div>
                                    <div className="text-xs text-sage-400 font-medium mb-1">
                                        {new Date(entry.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <h4 className="font-bold text-lg text-sage-900">{entry.recipeTitle}</h4>
                                </div>
                                <div className={`px-3 py-1.5 rounded-full border flex items-center gap-2 text-sm font-medium whitespace-nowrap ${getRatingColor(entry.rating)}`}>
                                    <span>{getRatingIcon(entry.rating)}</span>
                                    {entry.rating}
                                </div>
                            </div>

                            {entry.symptoms.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {entry.symptoms.map(s => (
                                        <span key={s} className="px-2 py-0.5 bg-red-50 text-red-600 text-xs rounded border border-red-100 font-medium">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {entry.notes && (
                                <p className="text-sage-600 text-sm bg-oat-50 p-3 rounded-lg italic border border-oat-200">
                                    "{entry.notes}"
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};