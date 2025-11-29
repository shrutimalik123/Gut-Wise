import React, { useState } from 'react';
import { ShoppingItem, Recipe } from '../types';

interface ShoppingListProps {
  items: ShoppingItem[];
  setItems: React.Dispatch<React.SetStateAction<ShoppingItem[]>>;
  recipes?: Recipe[];
}

export const ShoppingList: React.FC<ShoppingListProps> = ({ items, setItems, recipes }) => {
  const [newItem, setNewItem] = useState('');

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    setItems([
      ...items,
      { id: Date.now().toString(), name: newItem, checked: false, category: 'Custom' }
    ]);
    setNewItem('');
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };
  
  // Group by category
  const groupedItems = items.reduce((acc, item) => {
    const cat = item.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  const completionPercentage = items.length > 0 
    ? Math.round((items.filter(i => i.checked).length / items.length) * 100)
    : 0;

  return (
    <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-sage-100 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="font-serif text-3xl font-bold text-sage-900">Shopping List</h2>
                    <p className="text-sage-600 mt-1">
                        {recipes && recipes.length > 0 
                            ? `Based on ingredients from ${recipes.length} meal plan recipes.` 
                            : 'Add items manually or from your meal plan.'}
                    </p>
                </div>
                
                {/* Progress Bar */}
                {items.length > 0 && (
                    <div className="w-full md:w-64">
                        <div className="flex justify-between text-xs font-medium text-sage-600 mb-1">
                            <span>Progress</span>
                            <span>{completionPercentage}%</span>
                        </div>
                        <div className="h-2 bg-sage-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-sage-500 rounded-full transition-all duration-500"
                                style={{ width: `${completionPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={addItem} className="mb-8 flex gap-3">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Add an extra item (e.g., Almond Milk)..."
                    className="flex-1 px-4 py-3 rounded-lg border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent text-sage-800 placeholder-sage-400 bg-sage-50"
                />
                <button type="submit" className="px-6 py-3 bg-sage-600 text-white font-medium rounded-lg hover:bg-sage-700 transition-colors">
                    Add
                </button>
            </form>

            {items.length === 0 ? (
                <div className="text-center py-12 bg-oat-50 rounded-xl border border-dashed border-sage-200">
                    <p className="text-sage-500">Your shopping list is empty. Start adding recipes to your meal plan!</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {Object.entries(groupedItems).map(([category, catItems]) => (
                        <div key={category}>
                            <h3 className="text-sm font-bold text-sage-500 uppercase tracking-wider mb-3 ml-1">{category}</h3>
                            <div className="bg-oat-50 rounded-xl border border-sage-100 overflow-hidden">
                                {(catItems as ShoppingItem[]).map(item => (
                                    <div 
                                        key={item.id} 
                                        className={`flex items-center justify-between p-4 border-b last:border-0 border-sage-100 transition-colors ${item.checked ? 'bg-sage-50/50' : 'hover:bg-white'}`}
                                    >
                                        <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => toggleItem(item.id)}>
                                            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${item.checked ? 'bg-sage-500 border-sage-500' : 'border-sage-300 bg-white'}`}>
                                                {item.checked && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                                            </div>
                                            <span className={`text-lg transition-all ${item.checked ? 'text-sage-400 line-through' : 'text-sage-800 font-medium'}`}>
                                                {item.name}
                                            </span>
                                        </div>
                                        <button 
                                            onClick={() => deleteItem(item.id)}
                                            className="text-sage-300 hover:text-red-400 p-2 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
};