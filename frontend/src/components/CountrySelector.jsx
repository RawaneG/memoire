import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, MapPin, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApi } from '../hooks/useApi';

const CountrySelector = ({ value, onChange, onToggle, shouldClose }) => {
  const [isOpen, setIsOpen] = useState(false);
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

  // Handle outside clicks and keyboard navigation
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setSearchTerm('');
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

  const filteredFeatured = countries.featured_countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOthers = countries.other_countries
    .filter(country => country.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 20); // Limit to 20 for performance

  const handleSelect = (countryName) => {
    onChange(countryName);
    setIsOpen(false);
    setSearchTerm('');
  };

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
        aria-label={t('countrySelector.title')}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center space-x-3">
          <MapPin className="w-5 h-5 text-primary-400" />
          <span className="truncate">{value || t('countrySelector.selectCountry')}</span>
          {countries.featured_countries.some(c => c.name === value) && (
            <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
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
            className="absolute z-[100] w-full mt-2 glass-morphism-dropdown rounded-2xl shadow-2xl overflow-hidden"
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
                <div className="p-2">
                  <div className="px-3 py-2 text-xs font-semibold text-white/60 uppercase tracking-wider">
                    {t('countrySelector.featuredCountries')}
                  </div>
                  {filteredFeatured.map((country, index) => (
                    <motion.button
                      key={country.name}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      custom={index}
                      className="w-full flex items-center justify-between px-4 py-3 text-left text-white hover:bg-white/10 rounded-xl transition-colors group"
                      onClick={() => handleSelect(country.name)}
                    >
                      <div className="flex items-center space-x-3">
                        <Star className="w-4 h-4 text-yellow-400 group-hover:text-yellow-300" fill="currentColor" />
                        <span className="font-medium">{country.name}</span>
                      </div>
                      {country.name === 'Senegal' && (
                        <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
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
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left text-white/80 hover:bg-white/10 hover:text-white rounded-xl transition-colors"
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