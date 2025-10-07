import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CleaningLevelSelector = ({ value, onChange, onToggle, shouldClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(null);
  const [highlightIndex, setHighlightIndex] = useState(0); // keyboard focus inside list
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const listRef = useRef(null);
  const { t } = useTranslation();

  const levels = useMemo(() => ([
    {
      id: 'minimal',
      name: t('cleaningLevel.minimal.name'),
      description: t('cleaningLevel.minimal.description'),
      color: 'yellow',
      icon: '🟡'
    },
    {
      id: 'standard',
      name: t('cleaningLevel.standard.name'),
      description: t('cleaningLevel.standard.description'),
      color: 'green',
      icon: '🟢',
      recommended: true
    },
    {
      id: 'strict',
      name: t('cleaningLevel.strict.name'),
      description: t('cleaningLevel.strict.description'),
      color: 'red',
      icon: '🔴'
    }
  ]), [t]);

  const selectedLevel = levels.find(l => l.id === value) || levels[1];

  // Dynamic accent per level
  const accentMap = {
    minimal: 'from-yellow-400 via-amber-400 to-yellow-500',
    standard: 'from-emerald-400 via-teal-400 to-emerald-500',
    strict: 'from-rose-400 via-red-400 to-rose-500'
  };
  const accentGradient = accentMap[selectedLevel.id] || accentMap.standard;

  // Reduced motion preference
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (shouldClose) {
      setIsOpen(false);
    }
  }, [shouldClose]);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
    onToggle?.('cleaning');
  };

  const handleSelect = useCallback((levelId) => {
    onChange(levelId);
    setIsOpen(false);
    triggerRef.current?.focus();
  }, [onChange]);

  // Manage keyboard navigation when list is open
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false); triggerRef.current?.focus();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightIndex(i => (i + 1) % levels.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightIndex(i => (i - 1 + levels.length) % levels.length);
      } else if (e.key === 'Home') {
        setHighlightIndex(0);
      } else if (e.key === 'End') {
        setHighlightIndex(levels.length - 1);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const level = levels[highlightIndex];
        if (level) handleSelect(level.id);
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, levels, highlightIndex, handleSelect]);

  // Keep highlightIndex in sync with selected value on open
  useEffect(() => {
    if (isOpen) {
      const idx = levels.findIndex(l => l.id === selectedLevel.id);
      setHighlightIndex(idx >= 0 ? idx : 0);
    }
  }, [isOpen, selectedLevel, levels]);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const onDocClick = (e) => {
      if (!dropdownRef.current?.contains(e.target) && !triggerRef.current?.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        ref={triggerRef}
        type="button"
        className="w-full flex items-center justify-between px-5 sm:px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl text-white font-medium transition-all duration-300 hover:bg-white/20 hover:border-primary-400 focus:outline-none focus:border-primary-400 focus:bg-white/20 focus:ring-2 focus:ring-primary-500/50 relative"
        onClick={toggleDropdown}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={t('cleaningLevel.title')}
      >
        <div className="flex items-center space-x-3 pr-4">
          <span className="text-lg drop-shadow-sm" aria-hidden>{selectedLevel.icon}</span>
          <div className="text-left leading-tight">
            <div className="font-semibold flex items-center gap-2">
              <span>{selectedLevel.name}</span>
              {selectedLevel.recommended && (
                <span className="hidden md:inline px-2 py-0.5 text-[10px] tracking-wide bg-green-500/20 text-green-300 rounded-full border border-green-500/30 uppercase">
                  {t('cleaningLevel.recommended')}
                </span>
              )}
            </div>
            <div className="text-[11px] text-white/60 line-clamp-1 max-w-[12rem] sm:max-w-[14rem]">{selectedLevel.description}</div>
          </div>
        </div>
        {/* Accent gradient bar on left when open */}
        <span
          className={`absolute inset-y-1 left-1 w-1 rounded-full transition-opacity bg-gradient-to-b ${accentGradient} ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden
        />
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-white/60" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Local backdrop for smoother focus separation */}
            <motion.div
              key="backdrop"
              className="absolute inset-0 -top-1 -bottom-1 rounded-3xl z-[90] pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.25 }}
              exit={{ opacity: 0 }}
              style={{ background: 'radial-gradient(circle at 30% 10%, rgba(120,120,255,0.25), transparent 70%)' }}
            />
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: -6, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.985 }}
              transition={{ duration: prefersReduced ? 0.15 : 0.28, ease: 'easeOut' }}
              className="absolute z-[95] w-full mt-2 glass-morphism-dropdown rounded-2xl shadow-2xl overflow-hidden focus:outline-none origin-top"
              style={{
                background: 'linear-gradient(165deg, rgba(25,25,38,0.95) 0%, rgba(15,15,25,0.92) 60%, rgba(15,15,25,0.88) 100%)',
                backdropFilter: 'blur(22px) saturate(180%)',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 16px 40px -8px rgba(0,0,0,0.55), 0 4px 12px -2px rgba(0,0,0,0.4)'
              }}
              role="listbox"
              aria-activedescendant={`cleaning-level-${levels[highlightIndex]?.id}`}
              tabIndex={-1}
              ref={listRef}
              layout
            >
            {/* Mobile drag indicator (bottom sheet style if narrow) */}
            <div className="sm:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1.5 rounded-full bg-white/20" />
            </div>
              {levels.map((level, idx) => (
                <motion.button
                  key={level.id}
                type="button"
                id={`cleaning-level-${level.id}`}
                role="option"
                aria-selected={value === level.id}
                  className={`group w-full p-4 text-left flex items-start gap-3 border-b border-white/10 last:border-0 relative transition-colors duration-300 outline-none ${
                    value === level.id
                      ? 'bg-primary-500/15 border-white/10'
                      : highlightIndex === idx
                        ? 'bg-white/8 backdrop-blur-sm'
                        : 'hover:bg-white/10 focus:bg-white/10'
                  }`}
                  onClick={() => handleSelect(level.id)}
                  onMouseEnter={() => { setShowTooltip(level.id); setHighlightIndex(idx); }}
                  onMouseLeave={() => setShowTooltip(null)}
                  whileHover={prefersReduced ? {} : { x: 2 }}
                  // Softer entrance: minimal translate & no heavy blur
                  initial={{ opacity: 0, y: prefersReduced ? 0 : 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: prefersReduced ? 0 : -2 }}
                  transition={{ duration: prefersReduced ? 0.15 : 0.22, ease: 'easeOut', delay: prefersReduced ? 0 : 0.015 * idx }}
                  layout
                >
                  <span className="text-xl flex-shrink-0 mt-0.5 drop-shadow-sm" aria-hidden>{level.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-white tracking-wide">{level.name}</span>
                      {level.recommended && (
                        <span className="px-2 py-0.5 text-[10px] bg-primary-500/20 text-primary-300 rounded-full border border-primary-500/30 uppercase tracking-wide">
                          {t('cleaningLevel.recommended')}
                        </span>
                      )}
                      {value === level.id && (
                        <div className="w-2 h-2 rounded-full bg-primary-400 absolute right-4 top-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(59,130,246,0.7)]" />
                      )}
                    </div>
                    <p className="text-sm text-white/60 mt-1 leading-relaxed">
                      {level.description}
                    </p>

                    {/* Tooltip on hover */}
                    <AnimatePresence>
                      {showTooltip === level.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: prefersReduced ? 1 : 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: prefersReduced ? 1 : 0.98 }}
                          transition={{ duration: prefersReduced ? 0.16 : 0.24, ease: 'easeOut' }}
                          className="mt-2 p-2 bg-white/5 rounded-lg border border-white/10 shadow-inner will-change-opacity relative"
                          role="note"
                        >
                          <div className="flex items-start space-x-2">
                            <Info className="w-4 h-4 text-primary-300 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-white/70 leading-relaxed transition-colors">
                              {t(`cleaningLevel.${level.id}.useCase`)}
                            </p>
                          </div>
                          <span className="absolute inset-0 rounded-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-tr from-white/5 via-transparent to-white/10" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>
              ))}

            {/* Info Footer */}
            <div className="px-4 py-3 bg-gradient-to-r from-white/5 via-transparent to-white/5 border-t border-white/10" aria-live="polite">
              <div className="flex items-start gap-2 text-xs text-white/60">
                <Filter className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {t('cleaningLevel.footer')}
                </p>
              </div>
            </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CleaningLevelSelector;
