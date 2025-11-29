import React, { useState } from 'react';
import { Recipe, JournalEntry } from '../types';

interface TrackMealModalProps {
  recipe: Recipe;
  onSave: (entry: Omit<JournalEntry, 'id' | 'date'>) => void;
  onClose: () => void;
}

const SYMPTOMS = ['Bloating', 'Gas', 'Abdominal Pain', 'Nausea', 'Fatigue', 'Brain Fog', 'Heartburn'];
const RATINGS: { value: JournalEntry['rating']; label: string; icon: string }[] = [
  { value: 'Great', label: 'Great', icon: '😄' },
  { value: 'Good', label: 'Good', icon: '🙂' },
  { value: 'Fair', label: 'Fair', icon: '😐' },
  { value: 'Poor', label: 'Poor', icon: '🤢' },
];

export const TrackMealModal: React.FC<TrackMealModalProps> = ({ recipe, onSave, onClose }) => {
  const [rating, setRating] = useState<JournalEntry['rating']>('Good');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      recipeId: recipe.id,
      recipeTitle: recipe.title,
      rating,
      symptoms: selectedSymptoms,
      notes
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sage-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
        <div className="bg-sage-50 p-6 border-b border-sage-100">
          <h2 className="font-serif text-2xl font-bold text-sage-900">How did you feel?</h2>
          <p className="text-sage-600 text-sm mt-1">Tracking meal: <span className="font-semibold">{recipe.title}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Rating */}
          <div>
            <label className="block text-xs font-bold text-sage-500 uppercase tracking-wider mb-3">Overall Feeling</label>
            <div className="grid grid-cols-4 gap-2">
              {RATINGS.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRating(r.value)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    rating === r.value 
                      ? 'bg-sage-100 border-sage-400 text-sage-900 shadow-sm' 
                      : 'border-sage-100 hover:bg-sage-50 text-sage-600'
                  }`}
                >
                  <span className="text-2xl mb-1">{r.icon}</span>
                  <span className="text-xs font-medium">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Symptoms */}
          <div>
            <label className="block text-xs font-bold text-sage-500 uppercase tracking-wider mb-3">Symptoms (if any)</label>
            <div className="flex flex-wrap gap-2">
              {SYMPTOMS.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSymptom(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                    selectedSymptoms.includes(s)
                      ? 'bg-red-50 text-red-600 border-red-200'
                      : 'bg-white text-sage-600 border-sage-200 hover:border-sage-300'
                  }`}
                >
                  {s}
                </button>
              ))}
              {selectedSymptoms.length === 0 && (
                  <span className="text-sage-400 text-xs italic py-1.5 px-2">None selected</span>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
             <label className="block text-xs font-bold text-sage-500 uppercase tracking-wider mb-2">Notes</label>
             <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific thoughts? (e.g. ate late at night)"
                className="w-full p-3 rounded-lg border border-sage-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500"
                rows={3}
             />
          </div>

          <div className="flex gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 bg-white border border-sage-200 text-sage-600 font-medium rounded-lg hover:bg-sage-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 py-3 bg-sage-600 text-white font-medium rounded-lg hover:bg-sage-700 transition-colors shadow-md shadow-sage-200"
            >
              Save Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};