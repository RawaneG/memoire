import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Zap, Star, Info, TrendingUp } from 'lucide-react';

const ModelSelector = ({ value, onChange, country, onToggle, shouldClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [models, setModels] = useState({
    available_models: {
      linear: {
        name: 'Linear Regression',
        description: 'Simple, fast and interpretable',
        best_for: ['limited data', 'linear trends'],
        complexity: 'Low',
        accuracy: 'Medium',
        speed: 'Fast'
      },
      random_forest: {
        name: 'Random Forest',
        description: 'Robust ensemble model',
        best_for: ['complex data', 'non-linear relationships'],
        complexity: 'Medium',
        accuracy: 'High',
        speed: 'Medium'
      },
      gradient_boost: {
        name: 'Gradient Boosting',
        description: 'Advanced high-precision model',
        best_for: ['precise predictions', 'large datasets'],
        complexity: 'High',
        accuracy: 'Very High',
        speed: 'Slow'
      }
    },
    recommended_by_country: {
      Senegal: 'random_forest',
      France: 'gradient_boost',
      Germany: 'gradient_boost'
    }
  });

  const getRecommendedModel = () => {
    return models.recommended_by_country[country] || 'random_forest';
  };

  const getModelIcon = (modelKey) => {
    switch (modelKey) {
      case 'linear':
        return TrendingUp;
      case 'random_forest':
        return Star;
      case 'gradient_boost':
        return Zap;
      default:
        return Zap;
    }
  };

  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case 'Low':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'Medium':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'High':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getAccuracyColor = (accuracy) => {
    switch (accuracy) {
      case 'Medium':
        return 'text-yellow-400';
      case 'High':
        return 'text-green-400';
      case 'Very High':
        return 'text-emerald-400';
      default:
        return 'text-gray-400';
    }
  };

  const handleSelect = (modelKey) => {
    onChange(modelKey);
    setIsOpen(false);
  };

  const handleToggle = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (newIsOpen && onToggle) {
      onToggle('model');
    }
  };

  // Close dropdown when shouldClose prop changes
  useEffect(() => {
    if (shouldClose && isOpen) {
      setIsOpen(false);
    }
  }, [shouldClose, isOpen]);

  // Handle outside clicks and keyboard navigation
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen]);

  const dropdownVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      y: -10,
      transition: { duration: 0.15 }
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05, duration: 0.2 }
    })
  };

  const selectedModel = models.available_models[value];
  const IconComponent = getModelIcon(value);
  const recommendedModel = getRecommendedModel();

  return (
    <div className="relative">
      <motion.button
        ref={buttonRef}
        type="button"
        className="w-full flex items-center justify-between px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl text-white font-medium transition-all duration-300 hover:bg-white/20 hover:border-primary-400 focus:outline-none focus:border-primary-400 focus:bg-white/20 focus:ring-2 focus:ring-primary-500/50"
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select ML model"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center space-x-3">
          <IconComponent className="w-5 h-5 text-primary-400" />
          <div className="text-left">
            <div className="font-semibold">{selectedModel?.name || 'Select a model'}</div>
            <div className="text-xs text-white/60">{selectedModel?.description}</div>
          </div>
          {value === recommendedModel && (
            <div className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
              Recommended
            </div>
          )}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-white/60" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute z-[90] w-full mt-2 glass-morphism-dropdown rounded-2xl shadow-2xl overflow-hidden"
            style={{
              background: 'rgba(15, 15, 25, 0.95)',
              backdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}
            role="listbox"
            aria-label="ML model options"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 space-y-3 max-h-[28rem] overflow-y-auto custom-scrollbar">
              {Object.entries(models.available_models).map(([key, model], index) => {
                const ModelIcon = getModelIcon(key);
                const isRecommended = key === recommendedModel;
                const isSelected = key === value;

                return (
                  <motion.button
                    key={key}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-300 group ${
                      isSelected
                        ? 'border-primary-400 bg-primary-500/20'
                        : 'border-white/20 hover:border-white/40 hover:bg-white/10'
                    }`}
                    onClick={() => handleSelect(key)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          isSelected ? 'bg-primary-500' : 'bg-white/10'
                        } transition-colors`}>
                          <ModelIcon className={`w-5 h-5 ${
                            isSelected ? 'text-white' : 'text-white/70'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{model.name}</h4>
                          <p className="text-sm text-white/70">{model.description}</p>
                        </div>
                      </div>
                      
                      {isRecommended && (
                        <div className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                          Recommended
                        </div>
                      )}
                    </div>

                    {/* Model specs */}
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div className="text-center">
                        <div className="text-white/60 mb-1">Complexity</div>
                        <div className={`px-2 py-1 rounded-full border text-xs font-medium ${getComplexityColor(model.complexity)}`}>
                          {model.complexity}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-white/60 mb-1">Accuracy</div>
                        <div className={`font-medium ${getAccuracyColor(model.accuracy)}`}>
                          {model.accuracy}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-white/60 mb-1">Speed</div>
                        <div className="text-white font-medium">{model.speed}</div>
                      </div>
                    </div>

                    {/* Best for */}
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <div className="flex items-center space-x-2 text-xs text-white/60">
                        <Info className="w-3 h-3" />
                        <span>Best for: {model.best_for.join(', ')}</span>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Country-specific recommendation */}
            {country && recommendedModel && (
              <div className="p-4 bg-white/5 border-t border-white/10">
                <div className="flex items-center space-x-2 text-sm text-white/80">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>
                    <strong>{models.available_models[recommendedModel].name}</strong> is recommended for <strong>{country}</strong>
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModelSelector;