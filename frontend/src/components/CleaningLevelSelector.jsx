import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CleaningLevelSelector = ({ value, onChange, onToggle, shouldClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(null);
  const dropdownRef = useRef(null);
  const { t } = useTranslation();

  const levels = [
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
  ];

  const selectedLevel = levels.find(l => l.id === value) || levels[1];

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

  const handleSelect = (levelId) => {
    onChange(levelId);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        type="button"
        className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:border-primary-400/50 transition-all duration-300 flex items-center justify-between group"
        onClick={toggleDropdown}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center space-x-3">
          <span className="text-lg">{selectedLevel.icon}</span>
          <div className="text-left">
            <div className="font-medium text-white">{selectedLevel.name}</div>
            <div className="text-xs text-white/60">{selectedLevel.description.substring(0, 40)}...</div>
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-white/60 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden"
          >
            {levels.map((level) => (
              <motion.button
                key={level.id}
                type="button"
                className={`w-full px-4 py-4 text-left hover:bg-white/10 transition-colors duration-200 flex items-start space-x-3 border-b border-white/10 last:border-0 relative ${
                  value === level.id ? 'bg-white/5' : ''
                }`}
                onClick={() => handleSelect(level.id)}
                onMouseEnter={() => setShowTooltip(level.id)}
                onMouseLeave={() => setShowTooltip(null)}
                whileHover={{ x: 4 }}
              >
                <span className="text-xl flex-shrink-0 mt-0.5">{level.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-white">{level.name}</span>
                    {level.recommended && (
                      <span className="px-2 py-0.5 text-xs bg-primary-500/20 text-primary-400 rounded-full border border-primary-500/30">
                        {t('cleaningLevel.recommended')}
                      </span>
                    )}
                    {value === level.id && (
                      <div className="w-2 h-2 rounded-full bg-primary-400 absolute right-4 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                  <p className="text-sm text-white/60 mt-1 leading-relaxed">
                    {level.description}
                  </p>

                  {/* Tooltip on hover */}
                  <AnimatePresence>
                    {showTooltip === level.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 p-2 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div className="flex items-start space-x-2">
                          <Info className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-white/70">
                            {t(`cleaningLevel.${level.id}.useCase`)}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            ))}

            {/* Info Footer */}
            <div className="px-4 py-3 bg-white/5 border-t border-white/10">
              <div className="flex items-start space-x-2">
                <Filter className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-white/60">
                  {t('cleaningLevel.footer')}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CleaningLevelSelector;
