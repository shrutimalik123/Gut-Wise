import React, { useState, useEffect } from 'react';
import { Recipe, UserProfile, ShoppingItem, AppView, JournalEntry } from './types';
import { generateRecipes, generateDailyTip } from './services/geminiService';
import { RecipeCard } from './components/RecipeCard';
import { RecipeModal } from './components/RecipeModal';
import { ShoppingList } from './components/ShoppingList';
import { Settings } from './components/Settings';
import { ResearchHub } from './components/ResearchHub';
import { Journal } from './components/Journal';
import { TrackMealModal } from './components/TrackMealModal';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Guest',
    restrictions: [],
    intolerances: [],
    goals: []
  });
  
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [dailyTip, setDailyTip] = useState<string>('');
  
  // Meal plan state - simplified for demo: just a list of selected recipes
  const [mealPlan, setMealPlan] = useState<Recipe[]>([]);

  // Journal State
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [activeTrackingRecipe, setActiveTrackingRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    // Initial tip generation
    const fetchTip = async () => {
        const tip = await generateDailyTip(profile);
        setDailyTip(tip);
    };
    fetchTip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const handleProfileSave = async (newProfile: UserProfile) => {
    setProfile(newProfile);
    setLoadingRecipes(true);
    setView(AppView.DASHBOARD);
    
    // Clear old recipes to show fresh state
    setRecipes([]); 
    
    const generated = await generateRecipes(newProfile);
    setRecipes(generated);
    setLoadingRecipes(false);

    // Refresh tip based on new profile
    const tip = await generateDailyTip(newProfile);
    setDailyTip(tip);
  };

  const addToMealPlan = (recipe: Recipe) => {
    if (!mealPlan.find(r => r.id === recipe.id)) {
      setMealPlan([...mealPlan, recipe]);
      
      // Auto-add ingredients to shopping list
      const newItems = recipe.ingredients.map(ing => ({
        id: Date.now() + Math.random().toString(),
        name: `${ing.name} (${ing.amount})`,
        checked: false,
        category: ing.category || 'Pantry'
      }));
      setShoppingList(prev => [...prev, ...newItems]);
    }
  };

  const removeFromMealPlan = (id: string) => {
      setMealPlan(mealPlan.filter(r => r.id !== id));
      // Note: We don't auto-remove from shopping list to avoid accidental data loss if user checked it off
  };

  const handleSaveEntry = (entryData: Omit<JournalEntry, 'id' | 'date'>) => {
    const newEntry: JournalEntry = {
        ...entryData,
        id: Date.now().toString(),
        date: new Date().toISOString()
    };
    setJournalEntries(prev => [...prev, newEntry]);
    setActiveTrackingRecipe(null);
    setView(AppView.JOURNAL);
  };

  const NavButton = ({ target, label, icon }: { target: AppView, label: string, icon: React.ReactNode }) => (
    <button
      onClick={() => setView(target)}
      className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
        view === target 
          ? 'text-sage-800 bg-sage-100 font-bold' 
          : 'text-sage-500 hover:text-sage-700 hover:bg-sage-50'
      }`}
    >
      <div className="w-6 h-6 mb-1">{icon}</div>
      <span className="text-xs">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen font-sans text-sage-900 bg-oat-50 pb-24 md:pb-0 md:pl-24">
      
      {/* Desktop Sidebar Navigation */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-24 bg-white border-r border-sage-100 items-center py-8 z-40">
        <div className="w-10 h-10 bg-sage-600 rounded-lg flex items-center justify-center text-white font-serif font-bold text-xl mb-12 shadow-lg shadow-sage-200">
            GW
        </div>
        <div className="flex flex-col gap-8 w-full px-2">
            <NavButton target={AppView.DASHBOARD} label="Home" icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>} />
            <NavButton target={AppView.SHOPPING_LIST} label="List" icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>} />
            <NavButton target={AppView.JOURNAL} label="Journal" icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>} />
            <NavButton target={AppView.RESEARCH} label="Learn" icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>} />
            <NavButton target={AppView.SETTINGS} label="Settings" icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-sage-100 flex justify-around py-3 z-40 pb-safe">
        <NavButton target={AppView.DASHBOARD} label="Home" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>} />
        <NavButton target={AppView.SHOPPING_LIST} label="List" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>} />
        <NavButton target={AppView.JOURNAL} label="Journal" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>} />
        <NavButton target={AppView.SETTINGS} label="Settings" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
      </nav>

      {/* Main Content Area */}
      <main className="p-6 md:p-12 max-w-7xl mx-auto min-h-screen">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-sage-900">GutWise</h1>
            <p className="text-sage-600 mt-1">{dailyTip || "Loading your daily gut health tip..."}</p>
          </div>
          {view === AppView.DASHBOARD && profile.restrictions.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                  {profile.restrictions.map(r => (
                      <span key={r} className="px-3 py-1 bg-sage-100 text-sage-800 text-xs font-bold uppercase tracking-wide rounded-full">
                          {r}
                      </span>
                  ))}
              </div>
          )}
        </header>

        {/* View Switching */}
        <div className="animate-fadeIn">
            {view === AppView.DASHBOARD && (
                <div className="space-y-12">
                    {/* Welcome / Empty State */}
                    {recipes.length === 0 && !loadingRecipes && (
                         <div className="bg-white rounded-2xl p-10 border border-sage-100 shadow-sm text-center">
                            <div className="w-20 h-20 bg-oat-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-4xl">🥗</span>
                            </div>
                            <h2 className="font-serif text-2xl font-bold text-sage-900 mb-3">Welcome to your personalized gut health journey</h2>
                            <p className="text-sage-600 mb-8 max-w-lg mx-auto">Set up your profile with your dietary needs and goals to start getting tailored recipe recommendations.</p>
                            <button 
                                onClick={() => setView(AppView.SETTINGS)}
                                className="px-8 py-3 bg-sage-600 text-white font-medium rounded-xl hover:bg-sage-700 transition-all shadow-lg shadow-sage-200"
                            >
                                Customize Profile
                            </button>
                         </div>
                    )}

                    {/* Meal Plan Quick View */}
                    {mealPlan.length > 0 && (
                         <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-serif text-2xl font-bold text-sage-900">Your Meal Plan</h2>
                                <button onClick={() => setView(AppView.SHOPPING_LIST)} className="text-sm font-bold text-sage-600 hover:text-sage-800 underline">View Shopping List</button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {mealPlan.map(recipe => (
                                    <div key={recipe.id} className="relative group">
                                        <RecipeCard 
                                            recipe={recipe} 
                                            onSelect={setSelectedRecipe}
                                            onTrack={setActiveTrackingRecipe}
                                        />
                                        <button 
                                            onClick={(e) => {e.stopPropagation(); removeFromMealPlan(recipe.id)}}
                                            className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-red-400 hover:text-red-600 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Remove"
                                        >
                                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recipes Feed */}
                    {(loadingRecipes || recipes.length > 0) && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-serif text-2xl font-bold text-sage-900">Recommended for You</h2>
                                <button 
                                    onClick={() => handleProfileSave(profile)}
                                    className="text-sm text-sage-500 hover:text-sage-800 flex items-center"
                                    disabled={loadingRecipes}
                                >
                                    <svg className={`w-4 h-4 mr-1 ${loadingRecipes ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                    Refresh Recommendations
                                </button>
                            </div>
                            
                            {loadingRecipes ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="bg-white rounded-xl shadow-sm border border-sage-100 h-80 animate-pulse flex flex-col overflow-hidden">
                                            <div className="h-48 bg-sage-100"></div>
                                            <div className="p-5 space-y-3">
                                                <div className="h-6 bg-sage-100 rounded w-3/4"></div>
                                                <div className="h-4 bg-sage-50 rounded w-full"></div>
                                                <div className="h-4 bg-sage-50 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {recipes.map(recipe => (
                                        <RecipeCard 
                                            key={recipe.id} 
                                            recipe={recipe} 
                                            onSelect={setSelectedRecipe}
                                            onAddToPlan={mealPlan.find(r => r.id === recipe.id) ? undefined : addToMealPlan}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {view === AppView.SHOPPING_LIST && (
                <ShoppingList 
                    items={shoppingList} 
                    setItems={setShoppingList} 
                    recipes={mealPlan}
                />
            )}

            {view === AppView.JOURNAL && (
                <Journal 
                    entries={journalEntries}
                    onNavigateToRecipes={() => setView(AppView.DASHBOARD)}
                />
            )}

            {view === AppView.RESEARCH && (
                <ResearchHub />
            )}

            {view === AppView.SETTINGS && (
                <Settings 
                    currentProfile={profile} 
                    onSave={handleProfileSave} 
                />
            )}
        </div>
      </main>

      {/* Detail Modal */}
      {selectedRecipe && (
        <RecipeModal 
            recipe={selectedRecipe} 
            onClose={() => setSelectedRecipe(null)} 
        />
      )}

      {/* Tracking Modal */}
      {activeTrackingRecipe && (
        <TrackMealModal 
            recipe={activeTrackingRecipe}
            onClose={() => setActiveTrackingRecipe(null)}
            onSave={handleSaveEntry}
        />
      )}
    </div>
  );
};

export default App;