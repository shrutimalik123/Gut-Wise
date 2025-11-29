import React, { useState } from 'react';
import { UserProfile } from '../types';

interface SettingsProps {
  currentProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

const RESTRICTIONS = ["Low FODMAP", "Gluten-Free", "Dairy-Free", "Vegan", "Vegetarian", "Paleo"];
const INTOLERANCES = ["Lactose", "Garlic", "Onion", "Histamine", "Legumes", "Nuts"];
const GOALS = ["Reduce Bloating", "Improve Digestion", "Increase Fiber", "Anti-Inflammatory", "Boost Immunity"];

export const Settings: React.FC<SettingsProps> = ({ currentProfile, onSave }) => {
  const [profile, setProfile] = useState<UserProfile>(currentProfile);

  const toggleSelection = (key: keyof UserProfile, value: string) => {
    setProfile(prev => {
      const list = prev[key] as string[];
      const newList = list.includes(value) 
        ? list.filter(item => item !== value)
        : [...list, value];
      return { ...prev, [key]: newList };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(profile);
  };

  return (
    <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-sage-100 p-8">
            <h2 className="font-serif text-3xl font-bold text-sage-900 mb-6 text-center">Personalize Your Gut Health</h2>
            <p className="text-sage-600 text-center mb-10 max-w-md mx-auto">
                Tell us about your dietary needs and goals so our AI can curate the perfect gut-healing meal plan for you.
            </p>

            <form onSubmit={handleSubmit} className="space-y-10">
                
                {/* Restrictions */}
                <div>
                    <h3 className="text-lg font-bold text-sage-800 mb-4 flex items-center">
                        <span className="w-8 h-8 rounded-full bg-sage-100 text-sage-600 flex items-center justify-center mr-3 text-sm">1</span>
                        Dietary Type
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {RESTRICTIONS.map(r => (
                            <button
                                key={r}
                                type="button"
                                onClick={() => toggleSelection('restrictions', r)}
                                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                                    profile.restrictions.includes(r)
                                    ? 'bg-sage-600 text-white border-sage-600 shadow-md transform scale-105'
                                    : 'bg-white text-sage-600 border-sage-200 hover:border-sage-400 hover:bg-sage-50'
                                }`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Intolerances */}
                <div>
                    <h3 className="text-lg font-bold text-sage-800 mb-4 flex items-center">
                        <span className="w-8 h-8 rounded-full bg-sage-100 text-sage-600 flex items-center justify-center mr-3 text-sm">2</span>
                        Triggers & Intolerances
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {INTOLERANCES.map(t => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => toggleSelection('intolerances', t)}
                                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                                    profile.intolerances.includes(t)
                                    ? 'bg-red-50 text-red-600 border-red-200 ring-2 ring-red-100'
                                    : 'bg-white text-sage-600 border-sage-200 hover:border-sage-400 hover:bg-sage-50'
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Goals */}
                <div>
                    <h3 className="text-lg font-bold text-sage-800 mb-4 flex items-center">
                        <span className="w-8 h-8 rounded-full bg-sage-100 text-sage-600 flex items-center justify-center mr-3 text-sm">3</span>
                        Primary Goals
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {GOALS.map(g => (
                            <button
                                key={g}
                                type="button"
                                onClick={() => toggleSelection('goals', g)}
                                className={`px-4 py-4 rounded-xl text-sm font-medium transition-all duration-200 border text-left flex items-center justify-between ${
                                    profile.goals.includes(g)
                                    ? 'bg-sage-100 text-sage-800 border-sage-300'
                                    : 'bg-white text-sage-600 border-sage-200 hover:border-sage-400 hover:bg-sage-50'
                                }`}
                            >
                                {g}
                                {profile.goals.includes(g) && (
                                    <svg className="w-5 h-5 text-sage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-6">
                    <button 
                        type="submit" 
                        className="w-full py-4 bg-sage-800 text-white rounded-xl font-bold text-lg hover:bg-sage-900 shadow-xl shadow-sage-200 transition-all hover:-translate-y-1"
                    >
                        Save & Generate Recipes
                    </button>
                </div>

            </form>
        </div>
    </div>
  );
};
