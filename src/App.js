import React, { useState, useEffect } from 'react';
import { TrendingUp, PiggyBank, ShoppingCart, AlertTriangle, Plus, Trash2, Edit2, Save, X, Globe, ChevronDown, ChevronRight, Home, Car, Heart, Coffee, Utensils, Gamepad2, Book, Briefcase, Gift, Plane, Camera, Music, Smartphone, Tv, Wifi, Zap, Droplet, Flame, Wind, Sun, Moon, Star, Cloud, TreePine, Flower, Apple, Beer, Pizza, Cake } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// Currency configuration
const CURRENCIES = {
  USD: { symbol: '$', position: 'prefix', name: 'US Dollar' },
  EUR: { symbol: '€', position: 'suffix', name: 'Euro' },
  GBP: { symbol: '£', position: 'prefix', name: 'British Pound' },
  CAD: { symbol: 'C$', position: 'prefix', name: 'Canadian Dollar' },
  AUD: { symbol: 'A$', position: 'prefix', name: 'Australian Dollar' },
  NGN: { symbol: '₦', position: 'prefix', name: 'Nigerian Naira' }
};

// Icon mapping
const ICON_MAP = {
  'home': Home,
  'trending-up': TrendingUp,
  'piggy-bank': PiggyBank,
  'shopping-cart': ShoppingCart,
  'alert-triangle': AlertTriangle,
  'car': Car,
  'heart': Heart,
  'coffee': Coffee,
  'utensils': Utensils,
  'gamepad2': Gamepad2,
  'book': Book,
  'briefcase': Briefcase,
  'gift': Gift,
  'plane': Plane,
  'camera': Camera,
  'music': Music,
  'smartphone': Smartphone,
  'tv': Tv,
  'wifi': Wifi,
  'zap': Zap,
  'droplet': Droplet,
  'flame': Flame,
  'wind': Wind,
  'sun': Sun,
  'moon': Moon,
  'star': Star,
  'cloud': Cloud,
  'tree-pine': TreePine,
  'flower': Flower,
  'apple': Apple,
  'beer': Beer,
  'pizza': Pizza,
  'cake': Cake
};

// Available colors for categories
const CATEGORY_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
  '#14b8a6', '#eab308', '#a855f7', '#f43f5e', '#0ea5e9'
];

const BudgetTracker = () => {
  const [budget, setBudget] = useState({
    amount: '0',
    period: 'monthly'
  });
  
  const [selectedCurrency, setSelectedCurrency] = useState('NGN');
  
  const [categories, setCategories] = useState([
    { id: 1, name: 'Fixed costs', percentage: 50, color: '#3b82f6', icon: 'home', spent: 0, items: [], expanded: false },
    { id: 2, name: 'Investment', percentage: 15, color: '#10b981', icon: 'trending-up', spent: 0, items: [], expanded: false },
    { id: 3, name: 'Short-term savings', percentage: 15, color: '#f59e0b', icon: 'piggy-bank', spent: 0, items: [], expanded: false },
    { id: 4, name: 'Guilt-free spending', percentage: 20, color: '#8b5cf6', icon: 'shopping-cart', spent: 0, items: [], expanded: false },
    { id: 5, name: 'Emergency fund', percentage: 0, color: '#ef4444', icon: 'alert-triangle', spent: 0, items: [], expanded: false }
  ]);
  
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    percentage: 0,
    color: CATEGORY_COLORS[0],
    icon: 'home'
  });
  
  const [expenses, setExpenses] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [newExpense, setNewExpense] = useState({
    category: '',
    itemId: null,
    amount: '',
    description: ''
  });
  const [newItem, setNewItem] = useState({
    categoryId: null,
    name: '',
    budgetedAmount: ''
  });
  const [emergencyFundGoal, setEmergencyFundGoal] = useState(10000);

  // Currency formatter utility with error handling
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || amount === '' || isNaN(amount)) {
      const currency = CURRENCIES[selectedCurrency];
      return currency.position === 'prefix' ? `${currency.symbol}0.00` : `0.00${currency.symbol}`;
    }
    
    const currency = CURRENCIES[selectedCurrency];
    const numAmount = parseFloat(amount);
    const formattedAmount = numAmount.toFixed(2);
    
    if (currency.position === 'prefix') {
      return `${currency.symbol}${formattedAmount}`;
    } else {
      return `${formattedAmount}${currency.symbol}`;
    }
  };

  useEffect(() => {
    const savedData = localStorage.getItem('budgetTrackerData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setBudget(parsed.budget || { amount: '0', period: 'monthly' });
      
      // Ensure categories have required properties for backward compatibility
      const savedCategories = parsed.categories || categories;
      const updatedCategories = savedCategories.map(cat => ({
        ...cat,
        items: cat.items || [],
        expanded: cat.expanded !== undefined ? cat.expanded : false
      }));
      setCategories(updatedCategories);
      
      setExpenses(parsed.expenses || []);
      setEmergencyFundGoal(parsed.emergencyFundGoal || 10000);
      setSelectedCurrency(parsed.selectedCurrency || 'NGN');
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const dataToSave = {
        budget,
        categories,
        expenses,
        emergencyFundGoal,
        selectedCurrency
      };
      localStorage.setItem('budgetTrackerData', JSON.stringify(dataToSave));
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [budget, categories, expenses, emergencyFundGoal, selectedCurrency]);

  // Calculate category spent from items with error handling
  const calculateCategorySpent = (category) => {
    if (!category || !category.items || !Array.isArray(category.items)) {
      return 0;
    }
    return category.items.reduce((total, item) => {
      const spent = item.actualSpent || 0;
      return total + (isNaN(spent) ? 0 : parseFloat(spent));
    }, 0);
  };

  // Calculate category budgeted from items with error handling
  const calculateCategoryBudgeted = (category) => {
    if (!category || !category.items || !Array.isArray(category.items)) {
      return 0;
    }
    return category.items.reduce((total, item) => {
      const budgeted = item.budgetedAmount || 0;
      return total + (isNaN(budgeted) ? 0 : parseFloat(budgeted));
    }, 0);
  };

  // Helper to get budget amount for calculations
  const getBudgetAmount = () => {
    if (!budget.amount || budget.amount === '') {
      return 0;
    }
    const amount = parseFloat(budget.amount);
    if (isNaN(amount)) {
      console.warn('Invalid budget amount:', budget.amount);
      return 0;
    }
    return amount;
  };

  const calculateBudgetSplit = () => {
    const amount = getBudgetAmount();
    return categories.map(cat => {
      const catSpent = calculateCategorySpent(cat);
      const catBudgeted = calculateCategoryBudgeted(cat);
      const allocated = (amount * cat.percentage) / 100;
      const remaining = allocated - catBudgeted;
      
      return {
        ...cat,
        allocated: isNaN(allocated) ? 0 : allocated,
        budgeted: isNaN(catBudgeted) ? 0 : catBudgeted,
        spent: isNaN(catSpent) ? 0 : catSpent,
        remaining: isNaN(remaining) ? 0 : remaining
      };
    });
  };

  const updateCategoryPercentage = (categoryId, newPercentage) => {
    const otherCategories = categories.filter(cat => cat.id !== categoryId);
    const otherTotal = otherCategories.reduce((sum, cat) => sum + cat.percentage, 0);
    const maxAllowed = 100 - otherTotal;
    
    if (newPercentage >= 0 && newPercentage <= maxAllowed) {
      setCategories(prev => prev.map(cat => 
        cat.id === categoryId ? { ...cat, percentage: newPercentage } : cat
      ));
    }
  };

  // Item management functions
  const toggleCategoryExpanded = (categoryId) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId ? { ...cat, expanded: !cat.expanded } : cat
    ));
  };

  const addItem = (categoryId) => {
    if (newItem.name && newItem.budgetedAmount && newItem.categoryId === categoryId) {
      const item = {
        id: Date.now(),
        name: newItem.name,
        budgetedAmount: parseFloat(newItem.budgetedAmount),
        actualSpent: 0
      };
      
      setCategories(prev => prev.map(cat => 
        cat.id === categoryId 
          ? { ...cat, items: [...cat.items, item] }
          : cat
      ));
      
      setNewItem({ categoryId: null, name: '', budgetedAmount: '' });
    }
  };

  const updateItem = (categoryId, itemId, updates) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { 
            ...cat, 
            items: cat.items.map(item => 
              item.id === itemId ? { ...item, ...updates } : item
            )
          }
        : cat
    ));
  };

  const deleteItem = (categoryId, itemId) => {
    // Find the category and item
    const category = categories.find(cat => cat.id === categoryId);
    const itemToDelete = category?.items?.find(item => item.id === itemId);
    
    if (category && itemToDelete) {
      // Confirm deletion
      const confirmDelete = window.confirm(`Are you sure you want to delete "${itemToDelete.name}"?\n\nThis action cannot be undone.`);
      
      if (confirmDelete) {
        setCategories(prev => prev.map(cat => 
          cat.id === categoryId 
            ? { ...cat, items: cat.items.filter(item => item.id !== itemId) }
            : cat
        ));
      }
    }
  };

  const addExpense = () => {
    if (newExpense.category && newExpense.amount && newExpense.description) {
      const expense = {
        id: Date.now(),
        category: newExpense.category,
        itemId: newExpense.itemId,
        amount: parseFloat(newExpense.amount),
        description: newExpense.description,
        date: new Date().toISOString()
      };
      
      setExpenses(prev => [...prev, expense]);
      
      // Subtract from total allocations
      setCategories(prev => prev.map(cat => {
        if (cat.name === newExpense.category) {
          const catBudgeted = calculateCategoryBudgeted(cat);
          return {
            ...cat,
            budgeted: catBudgeted + parseFloat(newExpense.amount)
          };
        }
        return cat;
      }));
      
      // Update item actual spent if item is specified
      if (newExpense.itemId) {
        setCategories(prev => prev.map(cat => {
          if (cat.name === newExpense.category) {
            return {
              ...cat,
              items: cat.items.map(item => 
                item.id === parseInt(newExpense.itemId) 
                  ? { ...item, actualSpent: (item.actualSpent || 0) + parseFloat(newExpense.amount) }
                  : item
              )
            };
          }
          return cat;
        }));
      }
      
      setNewExpense({ category: '', itemId: null, amount: '', description: '' });
    }
  };

  const deleteExpense = (expenseId) => {
    const expense = expenses.find(exp => exp.id === expenseId);
    if (expense) {
      // Add back to total allocations
      setCategories(prev => prev.map(cat => {
        if (cat.name === expense.category) {
          const catBudgeted = calculateCategoryBudgeted(cat);
          return {
            ...cat,
            budgeted: catBudgeted - expense.amount
          };
        }
        return cat;
      }));
      
      // Update item actual spent if item is specified
      if (expense.itemId) {
        setCategories(prev => prev.map(cat => {
          if (cat.name === expense.category) {
            return {
              ...cat,
              items: cat.items.map(item => 
                item.id === parseInt(expense.itemId) 
                  ? { ...item, actualSpent: (item.actualSpent || 0) - expense.amount }
                  : item
              )
            };
          }
          return cat;
        }));
      }
      
      setExpenses(prev => prev.filter(exp => exp.id !== expenseId));
    }
  };

  const getIcon = (iconName) => {
    const IconComponent = ICON_MAP[iconName] || Home;
    return <IconComponent className="w-5 h-5" />;
  };

  // Category management functions
  const addCategory = () => {
    if (newCategory.name && newCategory.percentage > 0) {
      const otherCategories = categories.filter(cat => cat.id !== newCategory.id);
      const otherTotal = otherCategories.reduce((sum, cat) => sum + cat.percentage, 0);
      const maxAllowed = 100 - otherTotal;
      
      if (newCategory.percentage <= maxAllowed) {
        const category = {
          id: Date.now(),
          name: newCategory.name,
          percentage: newCategory.percentage,
          color: newCategory.color,
          icon: newCategory.icon,
          spent: 0,
          items: [],
          expanded: false
        };
        
        setCategories(prev => [...prev, category]);
        setNewCategory({ name: '', percentage: 0, color: CATEGORY_COLORS[0], icon: 'home' });
        setShowAddCategory(false);
      } else {
        alert(`Cannot add category. Current total: ${otherTotal}%. Available: ${maxAllowed}%.\n\nTo add this category, please reduce the percentage of existing categories:\n${otherCategories.map(cat => `- ${cat.name}: ${cat.percentage}%`).join('\n')}`);
      }
    }
  };

  const deleteCategory = (categoryId) => {
    // Find the category to be deleted
    const categoryToDelete = categories.find(cat => cat.id === categoryId);
    if (categoryToDelete) {
      // Confirm deletion
      const confirmDelete = window.confirm(`Are you sure you want to delete "${categoryToDelete.name}" category?\n\nThis will also delete all items within this category and cannot be undone.`);
      
      if (confirmDelete) {
        setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      }
    }
  };

  const budgetSplit = calculateBudgetSplit();
  const totalPercentage = categories.reduce((sum, cat) => sum + cat.percentage, 0);
  const chartData = budgetSplit.map(cat => ({
    name: cat.name,
    value: cat.allocated,
    color: cat.color
  }));

  return (
    <div className="min-h-screen p-4 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Budget Tracker</h1>
            <p className="text-gray-600">Automate your finances with smart budget splitting</p>
          </div>
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-gray-600" />
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            >
              {Object.entries(CURRENCIES).map(([code, currency]) => (
                <option key={code} value={code}>
                  {currency.symbol} {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4">Budget Setup</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Income/Budget Amount
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  className="input text-base text-lg font-medium"
                  placeholder="0.00"
                  value={budget.amount}
                  onChange={(e) => setBudget(prev => ({ ...prev, amount: e.target.value }))}
                  onBlur={(e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value)) {
                      setBudget(prev => ({ ...prev, amount: value.toFixed(2) }));
                    }
                  }}
                />
                {budget.amount && !isNaN(parseFloat(budget.amount)) && (
                  <p className="text-xs text-gray-500 mt-1">
                    Formatted: {formatCurrency(budget.amount)}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time Period
                </label>
                <select
                  className="input"
                  value={budget.period}
                  onChange={(e) => setBudget(prev => ({ ...prev, period: e.target.value }))}
                >
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>
            
            {totalPercentage !== 100 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Categories must total 100%. Current total: {totalPercentage}%
                </p>
              </div>
            )}
          </div>

          <div className="card mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Categories</h2>
              <button
                onClick={() => setShowAddCategory(true)}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>
            
            {/* Add Category Form */}
            {showAddCategory && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-lg font-medium mb-3">Add New Category</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category Name
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g., Entertainment"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Percentage (%) - Available: {100 - totalPercentage}%
                    </label>
                    <input
                      type="number"
                      className="input"
                      placeholder="10"
                      value={newCategory.percentage || ''}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, percentage: parseFloat(e.target.value) || 0 }))}
                      min="0"
                      max={100 - totalPercentage}
                    />
                    {newCategory.percentage > (100 - totalPercentage) && (
                      <p className="text-xs text-red-600 mt-1">
                        Only {100 - totalPercentage}% available. Please reduce existing categories first.
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Icon
                    </label>
                    <select
                      className="input"
                      value={newCategory.icon}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, icon: e.target.value }))}
                    >
                      {Object.keys(ICON_MAP).map(iconName => (
                        <option key={iconName} value={iconName}>
                          {iconName.charAt(0).toUpperCase() + iconName.slice(1).replace('-', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Color
                    </label>
                    <div className="flex space-x-2">
                      {CATEGORY_COLORS.map(color => (
                        <button
                          key={color}
                          onClick={() => setNewCategory(prev => ({ ...prev, color }))}
                          className={`w-8 h-8 rounded-lg border-2 ${
                            newCategory.color === color ? 'border-gray-800' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={addCategory}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Category
                  </button>
                  <button
                    onClick={() => {
                      setShowAddCategory(false);
                      setNewCategory({ name: '', percentage: 0, color: CATEGORY_COLORS[0], icon: 'home' });
                    }}
                    className="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            <div className="space-y-3">
              {categories.map(category => {
                const allocated = (parseFloat(budget.amount) || 0) * category.percentage / 100;
                const categorySpent = calculateCategorySpent(category);
                const remaining = allocated - categorySpent;
                const spentPercentage = allocated > 0 ? (categorySpent / allocated) * 100 : 0;
                
                return (
                  <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => toggleCategoryExpanded(category.id)}
                          className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                        >
                          {category.expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                        <div style={{ color: category.color }}>
                          {getIcon(category.icon)}
                        </div>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {editingCategory === category.id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              className="w-16 px-2 py-1 border border-gray-300 rounded"
                              value={category.percentage}
                              onChange={(e) => updateCategoryPercentage(category.id, parseFloat(e.target.value) || 0)}
                              min="0"
                              max="100"
                            />
                            <span className="text-sm">%</span>
                            <button
                              onClick={() => setEditingCategory(null)}
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingCategory(null)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{category.percentage}%</span>
                            <button
                              onClick={() => setEditingCategory(category.id)}
                              className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteCategory(category.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 lg:gap-4 text-xs lg:text-sm mb-2">
                      <div className="min-w-0">
                        <span className="text-gray-500 block truncate">Allocated:</span>
                        <span className="ml-1 font-medium block">{formatCurrency(allocated)}</span>
                      </div>
                      <div className="min-w-0">
                        <span className="text-gray-500 block truncate">Spent:</span>
                        <span className="ml-1 font-medium block">{formatCurrency(categorySpent)}</span>
                      </div>
                      <div className="min-w-0">
                        <span className="text-gray-500 block truncate">Remaining:</span>
                        <span className={`ml-1 font-medium block ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {formatCurrency(remaining)}
                        </span>
                      </div>
                    </div>
                    
                    {allocated > 0 && (
                      <div className="progress-bar mb-3">
                        <div
                          className={`progress-fill ${
                            spentPercentage > 100 ? 'bg-red-500' : 
                            spentPercentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                        />
                      </div>
                    )}

                    {/* Expandable Items Section */}
                    {category.expanded && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-gray-700">Budget Items</h4>
                          <button
                            onClick={() => setNewItem({ categoryId: category.id, name: '', budgetedAmount: '' })}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* Add New Item Form */}
                        {newItem.categoryId === category.id && (
                          <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                              <input
                                type="text"
                                placeholder="Item name"
                                className="px-2 py-2 border border-gray-300 rounded text-sm"
                                value={newItem.name}
                                onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                              />
                              <input
                                type="number"
                                placeholder="Allocated amount"
                                className="px-2 py-2 border border-gray-300 rounded text-sm"
                                value={newItem.budgetedAmount}
                                onChange={(e) => setNewItem(prev => ({ ...prev, budgetedAmount: e.target.value }))}
                              />
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => addItem(category.id)}
                                className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                              >
                                Add
                              </button>
                              <button
                                onClick={() => setNewItem({ categoryId: null, name: '', budgetedAmount: '' })}
                                className="px-3 py-2 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {/* Items List */}
                        <div className="space-y-2">
                          {category.items.map(item => {
                            const itemBudgeted = parseFloat(item.budgetedAmount) || 0;
                            const itemSpent = parseFloat(item.actualSpent) || 0;
                            const itemRemaining = itemBudgeted - itemSpent;
                            const itemSpentPercentage = itemBudgeted > 0 ? (itemSpent / itemBudgeted) * 100 : 0;
                            
                            return (
                              <div key={item.id} className="p-2 bg-gray-50 rounded-lg">
                                {editingItem === item.id ? (
                                  <div className="space-y-2">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      <input
                                        type="text"
                                        value={item.name}
                                        onChange={(e) => updateItem(category.id, item.id, { name: e.target.value })}
                                        className="px-2 py-2 border border-gray-300 rounded text-sm"
                                      />
                                      <input
                                        type="number"
                                        value={itemBudgeted}
                                        onChange={(e) => updateItem(category.id, item.id, { budgetedAmount: parseFloat(e.target.value) || 0 })}
                                        className="px-2 py-2 border border-gray-300 rounded text-sm"
                                      />
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                                      <input
                                        type="number"
                                        placeholder="Actual spent"
                                        value={itemSpent}
                                        onChange={(e) => updateItem(category.id, item.id, { actualSpent: parseFloat(e.target.value) || 0 })}
                                        className="px-2 py-2 border border-gray-300 rounded text-sm w-full sm:w-24"
                                      />
                                      <div className="flex space-x-1">
                                        <button
                                          onClick={() => setEditingItem(null)}
                                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                                        >
                                          <Save className="w-3 h-3" />
                                        </button>
                                        <button
                                          onClick={() => setEditingItem(null)}
                                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex flex-col space-y-2">
                                    <div className="flex-1">
                                      <div className="font-medium text-sm">{item.name}</div>
                                      <div className="text-xs text-gray-500 space-y-1">
                                        <div>Allocated: <span className="font-medium">{formatCurrency(itemBudgeted)}</span></div>
                                        <div>Spent: <span className="font-medium">{formatCurrency(itemSpent)}</span></div>
                                        <div className={itemRemaining < 0 ? 'text-red-600' : 'text-green-600'}>
                                          Remaining: <span className="font-medium">{formatCurrency(itemRemaining)}</span>
                                        </div>
                                      </div>
                                      {itemBudgeted > 0 && (
                                        <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                                          <div
                                            className={`h-1 rounded-full transition-all duration-300 ${
                                              itemSpentPercentage > 100 ? 'bg-red-500' : 
                                              itemSpentPercentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                                            }`}
                                            style={{ width: `${Math.min(itemSpentPercentage, 100)}%` }}
                                          />
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex justify-end space-x-1">
                                      <button
                                        onClick={() => setEditingItem(item.id)}
                                        className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                                      >
                                        <Edit2 className="w-3 h-3" />
                                      </button>
                                      <button
                                        onClick={() => deleteItem(category.id, item.id)}
                                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          {category.items.length === 0 && (
                            <div className="text-center text-gray-500 text-sm py-4">
                              No items added yet. Click + to add your first item.
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Budget Overview</h2>
            {parseFloat(budget.amount) > 0 ? (
              <>
                <div className="w-full h-48 sm:h-56 lg:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={1}
                        dataKey="value"
                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => formatCurrency(value)} 
                        contentStyle={{
                          fontSize: '12px',
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Category Legend */}
                <div className="mt-4 lg:mt-6 space-y-2">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 lg:mb-3">Categories</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {categories.map(category => {
                      const allocated = (parseFloat(budget.amount) || 0) * category.percentage / 100;
                      const categorySpent = calculateCategorySpent(category);
                      const spentPercentage = allocated > 0 ? (categorySpent / allocated) * 100 : 0;
                      
                      return (
                        <div key={category.id} className="flex items-center space-x-2 lg:space-x-3 p-2 rounded-lg hover:bg-gray-50">
                          <div className="flex items-center space-x-1 lg:space-x-2 flex-shrink-0">
                            <div 
                              className="w-3 h-3 lg:w-4 lg:h-4 rounded-full border border-gray-300" 
                              style={{ backgroundColor: category.color }}
                            />
                            <div style={{ color: category.color }}>
                              {getIcon(category.icon)}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium truncate pr-2">{category.name}</span>
                              <span className="text-sm text-gray-600 flex-shrink-0">{category.percentage}%</span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span className="truncate pr-2">{formatCurrency(allocated)}</span>
                              <span className={`flex-shrink-0 ${spentPercentage > 100 ? 'text-red-600' : spentPercentage > 80 ? 'text-yellow-600' : 'text-green-600'}`}>
                                {spentPercentage.toFixed(0)}% spent
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-500">
                Enter budget amount to see breakdown
              </div>
            )}
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        <div className="card">
          <h2 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4">Add Expense</h2>
          <div className="space-y-3 lg:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                className="input text-base"
                value={newExpense.category}
                onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            {newExpense.category && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget Item (Optional)
                </label>
                <select
                  className="input text-base"
                  value={newExpense.itemId || ''}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, itemId: e.target.value }))}
                >
                  <option value="">No specific item</option>
                  {categories.find(cat => cat.name === newExpense.category)?.items?.map(item => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                className="input text-base text-lg font-medium"
                placeholder="Enter amount"
                value={newExpense.amount}
                onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                className="input text-base"
                placeholder="What was this expense for?"
                value={newExpense.description}
                onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <button
              onClick={addExpense}
              className="btn btn-primary w-full py-3 text-base font-medium"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Add Expense
            </button>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4">Recent Expenses</h2>
          <div className="space-y-2 max-h-64 lg:max-h-80 overflow-y-auto">
            {expenses.length > 0 ? (
              expenses.slice(-10).reverse().map(expense => (
                <div key={expense.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-gray-200 rounded-lg space-y-2 sm:space-y-0">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm mb-1">{expense.description}</div>
                    <div className="text-xs text-gray-500">{expense.category}</div>
                    {expense.itemId && (
                      <div className="text-xs text-orange-600 mt-1">
                        Amount removed from allocation: {formatCurrency(expense.amount)}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between sm:justify-end sm:space-x-2">
                    <span className="font-semibold text-sm lg:text-base">{formatCurrency(expense.amount)}</span>
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded ml-2"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                No expenses recorded yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetTracker;
