import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Zap, Star, Info, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ModelSelector = ({ value, onChange, country, onToggle, shouldClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const { t } = useTranslation();
  const [models] = useState({
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
    const lowKey = t('modelSelector.levels.low');
    const mediumKey = t('modelSelector.levels.medium');
    const highKey = t('modelSelector.levels.high');
    
    switch (complexity) {
      case lowKey:
      case 'Low':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case mediumKey:
      case 'Medium':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case highKey:
      case 'High':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getAccuracyColor = (accuracy) => {
    const mediumKey = t('modelSelector.levels.medium');
    const highKey = t('modelSelector.levels.high');
    const veryHighKey = t('modelSelector.levels.veryHigh');
    
    switch (accuracy) {
      case mediumKey:
      case 'Medium':
        return 'text-yellow-400';
      case highKey:
      case 'High':
        return 'text-green-400';
      case veryHighKey:
      case 'Very High':
        return 'text-emerald-400';
      default:
        return 'text-gray-400';
    }
  };

  const handleSelect = useCallback((modelKey) => { onChange(modelKey); setIsOpen(false); }, [onChange]);

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

  // Outside click + keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => { if (!dropdownRef.current?.contains(e.target) && !buttonRef.current?.contains(e.target)) setIsOpen(false); };
    const entries = Object.entries(models.available_models);
    const handleKey = (e) => {
      if (e.key === 'Escape') { setIsOpen(false); buttonRef.current?.focus(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); setHighlightIndex(i => (i + 1) % entries.length); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlightIndex(i => (i - 1 + entries.length) % entries.length); }
      else if (e.key === 'Enter' || e.key === ' ') { const key = entries[highlightIndex]?.[0]; if (key) handleSelect(key); }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => { document.removeEventListener('mousedown', handleClickOutside); document.removeEventListener('keydown', handleKey); };
  }, [isOpen, highlightIndex, models, handleSelect]);

  const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dropdownVariants = { hidden: { opacity: 0, y: -6, scale: 0.985 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: prefersReduced ? 0.15 : 0.25, ease: 'easeOut' } } };
  const itemVariants = { hidden: { opacity: 0, y: prefersReduced ? 0 : 6 }, visible: (i) => ({ opacity: 1, y: 0, transition: { duration: prefersReduced ? 0.15 : 0.22, ease: 'easeOut', delay: prefersReduced ? 0 : 0.015 * i } }) };

  const selectedModel = models.available_models[value];
  const IconComponent = getModelIcon(value);
  const recommendedModel = getRecommendedModel();

  return (
    <div className="relative">
      <motion.button
        ref={buttonRef}
        type="button"
        className="w-full flex items-center justify-between px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl text-white font-medium transition-all duration-300 hover:bg-white/20 hover:border-primary-400 focus:outline-none focus:border-primary-400 focus:bg-white/20 focus:ring-2 focus:ring-primary-500/50 relative"
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={t('modelSelector.title')}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center space-x-3 pr-4">
          <IconComponent className="w-5 h-5 text-primary-400" />
          <div className="text-left">
            <div className="font-semibold">{selectedModel?.name || t('modelSelector.selectModel')}</div>
            <div className="text-xs text-white/60">{selectedModel?.description}</div>
          </div>
          {value === recommendedModel && (
            <div className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
              {t('modelSelector.recommended')}
            </div>
          )}
        </div>
        <span className={`absolute inset-y-1 left-1 w-1 rounded-full transition-opacity bg-gradient-to-b from-primary-400 via-accent-400 to-primary-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`} aria-hidden />
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
              border: '1px solid rgba(255, 255, 255, 0.15)',
              maxHeight: '70vh'
            }}
            role="listbox"
            aria-label={t('modelSelector.title')}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(70vh - 1rem)' }}>
              <div className="p-4 space-y-3">
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
                      className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-300 group ${isSelected ? 'border-primary-400 bg-primary-500/20 ring-1 ring-primary-400/40' : highlightIndex === index ? 'border-white/30 bg-white/10' : 'border-white/20 hover:border-white/40 hover:bg-white/10'}`}
                      onClick={() => handleSelect(key)}
                      whileHover={prefersReduced ? {} : { scale: 1.015 }}
                      whileTap={prefersReduced ? {} : { scale: 0.985 }}
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
                            {t('modelSelector.recommended')}
                          </div>
                        )}
                      </div>

                      {/* Model specs */}
                      <div className="grid grid-cols-3 gap-3 text-xs">
                        <div className="text-center">
                          <div className="text-white/60 mb-1">{t('modelSelector.complexity')}</div>
                          <div className={`px-2 py-1 rounded-full border text-xs font-medium ${getComplexityColor(model.complexity)}`}>
                            {t(`modelSelector.levels.${model.complexity?.toLowerCase()}`) || model.complexity}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-white/60 mb-1">{t('modelSelector.accuracy')}</div>
                          <div className={`font-medium ${getAccuracyColor(model.accuracy)}`}>
                            {model.accuracy === 'Very High' ? t('modelSelector.levels.veryHigh') : t(`modelSelector.levels.${model.accuracy?.toLowerCase()}`) || model.accuracy}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-white/60 mb-1">{t('modelSelector.speed')}</div>
                          <div className="text-white font-medium">{t(`modelSelector.levels.${model.speed?.toLowerCase()}`) || model.speed}</div>
                        </div>
                      </div>

                      {/* Best for */}
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <div className="flex items-center space-x-2 text-xs text-white/60">
                          <Info className="w-3 h-3" />
                          <span>{t('modelSelector.bestFor')}: {model.best_for.join(', ')}</span>
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
                      <strong>{models.available_models[recommendedModel].name}</strong> {t('modelSelector.recommendedFor')} <strong>{country}</strong>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModelSelector;