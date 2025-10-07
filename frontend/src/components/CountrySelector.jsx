import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, MapPin, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApi } from '../hooks/useApi';

const CountrySelector = ({ value, onChange, onToggle, shouldClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [countries, setCountries] = useState({ featured_countries: [], other_countries: [] });
  const { getCountries } = useApi();
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await getCountries();
        setCountries(data);
      } catch (error) {
        console.error('Failed to fetch countries:', error);
        // Fallback data
        setCountries({
          featured_countries: [
            { name: 'Senegal', has_special_config: true },
            { name: 'France', has_special_config: true },
            { name: 'Germany', has_special_config: true }
          ],
          other_countries: [
            { name: 'United States', has_special_config: false },
            { name: 'Brazil', has_special_config: false },
            { name: 'India', has_special_config: false }
          ]
        });
      }
    };

    fetchCountries();
  }, [getCountries]);

  // Close dropdown when shouldClose prop changes
  useEffect(() => {
    if (shouldClose && isOpen) {
      setIsOpen(false);
      setSearchTerm('');
    }
  }, [shouldClose, isOpen]);

  const filteredFeatured = useMemo(() => countries.featured_countries.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())), [countries.featured_countries, searchTerm]);
  const filteredOthers = useMemo(() => countries.other_countries.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 20), [countries.other_countries, searchTerm]);
  const allOptions = useMemo(() => [...filteredFeatured, ...filteredOthers], [filteredFeatured, filteredOthers]);

  const handleSelect = useCallback((countryName) => { onChange(countryName); setIsOpen(false); setSearchTerm(''); }, [onChange]);

  // Outside click + keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (!dropdownRef.current?.contains(e.target) && !buttonRef.current?.contains(e.target)) {
        setIsOpen(false); setSearchTerm('');
      }
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') { setIsOpen(false); buttonRef.current?.focus(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); setHighlightIndex(i => (i + 1) % allOptions.length); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlightIndex(i => (i - 1 + allOptions.length) % allOptions.length); }
      else if (e.key === 'Enter' || e.key === ' ') {
        const opt = allOptions[highlightIndex];
        if (opt) handleSelect(opt.name);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => { document.removeEventListener('mousedown', handleClickOutside); document.removeEventListener('keydown', handleKey); };
  }, [isOpen, highlightIndex, allOptions, handleSelect]);

  const handleToggle = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (newIsOpen && onToggle) {
      onToggle('country');
    }
    if (!newIsOpen) {
      setSearchTerm('');
    }
  };

  const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const dropdownVariants = {
    hidden: { opacity: 0, y: -6, scale: 0.985 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: prefersReduced ? 0.15 : 0.25, ease: 'easeOut' } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 6 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: prefersReduced ? 0.15 : 0.22, ease: 'easeOut', delay: prefersReduced ? 0 : 0.012 * i }
    })
  };

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
        aria-label={t('countrySelector.title')}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center space-x-3 pr-4">
          <MapPin className="w-5 h-5 text-primary-400" />
          <span className="truncate">{value || t('countrySelector.selectCountry')}</span>
          {countries.featured_countries.some(c => c.name === value) && (
            <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
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
            className="absolute z-[100] w-full mt-2 glass-morphism-dropdown rounded-2xl shadow-2xl overflow-hidden focus:outline-none"
            style={{
              background: 'rgba(15, 15, 25, 0.95)',
              backdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}
            role="listbox"
            aria-label={t('countrySelector.featuredCountries')}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="p-4 border-b border-white/20">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                <input
                  type="text"
                  placeholder={t('countrySelector.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-primary-400 transition-colors"
                />
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto custom-scrollbar">
              {/* Featured countries */}
              {filteredFeatured.length > 0 && (
                <div className="p-2 bg-white/5/50 rounded-t-lg backdrop-blur-sm">
                  <div className="px-3 py-2 text-[11px] font-semibold text-white/70 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-pulse" />
                    {t('countrySelector.featuredCountries')}
                  </div>
                  {filteredFeatured.map((country, index) => (
                    <motion.button
                      key={country.name}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      custom={index}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-left rounded-lg transition-colors group border border-transparent ${highlightIndex === index ? 'bg-white/15 border-white/10' : 'hover:bg-white/10'} ${value === country.name ? 'ring-1 ring-primary-400/60 bg-primary-500/10' : ''}`}
                      onClick={() => handleSelect(country.name)}
                    >
                      <div className="flex items-center space-x-3">
                        <Star className="w-4 h-4 text-yellow-300 group-hover:text-yellow-200 drop-shadow" fill="currentColor" />
                        <span className="font-medium text-white/90 group-hover:text-white">{country.name}</span>
                      </div>
                      {country.name === 'Senegal' && (
                        <span className="px-2 py-0.5 text-[10px] bg-green-500/20 text-green-300 rounded-full border border-green-500/30 uppercase tracking-wide">
                          {t('countrySelector.optimized')}
                        </span>
                      )}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Other countries */}
              {filteredOthers.length > 0 && (
                <div className="p-2 border-t border-white/10">
                  <div className="px-3 py-2 text-xs font-semibold text-white/60 uppercase tracking-wider">
                    {t('countrySelector.otherCountries')}
                  </div>
                  {filteredOthers.map((country, index) => (
                    <motion.button
                      key={country.name}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      custom={index + filteredFeatured.length}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-xl transition-colors ${highlightIndex === (index + filteredFeatured.length) ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'} ${value === country.name ? 'ring-1 ring-primary-400/60 bg-primary-500/10' : ''}`}
                      onClick={() => handleSelect(country.name)}
                    >
                      <MapPin className="w-4 h-4 text-white/40" />
                      <span>{country.name}</span>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* No results */}
              {filteredFeatured.length === 0 && filteredOthers.length === 0 && searchTerm && (
                <div className="p-8 text-center text-white/60">
                  <Search className="w-8 h-8 mx-auto mb-2 text-white/40" />
                  <p>{t('countrySelector.noResults')} "{searchTerm}"</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CountrySelector;