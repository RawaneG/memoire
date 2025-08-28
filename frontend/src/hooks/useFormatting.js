import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

export const useFormatting = () => {
  const { i18n, t } = useTranslation();

  const formatters = useMemo(() => {
    const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';

    return {
      number: new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }),
      currency: new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: i18n.language === 'fr' ? 'EUR' : 'USD',
      }),
      percent: new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 2,
      }),
      date: new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      dateTime: new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      shortDate: new Intl.DateTimeFormat(locale, {
        month: 'short',
        day: 'numeric',
      }),
    };
  }, [i18n.language]);

  const formatNumber = (value, options = {}) => {
    if (value == null || isNaN(value)) return '-';
    
    const absValue = Math.abs(value);
    
    // Handle large numbers with abbreviations
    if (options.compact) {
      if (absValue >= 1e9) {
        return `${formatters.number.format(value / 1e9)}${t('formatting.numbers.billion')}`;
      }
      if (absValue >= 1e6) {
        return `${formatters.number.format(value / 1e6)}${t('formatting.numbers.million')}`;
      }
      if (absValue >= 1e3) {
        return `${formatters.number.format(value / 1e3)}${t('formatting.numbers.thousand')}`;
      }
    }
    
    return formatters.number.format(value);
  };

  const formatCurrency = (value) => {
    if (value == null || isNaN(value)) return '-';
    return formatters.currency.format(value);
  };

  const formatPercent = (value) => {
    if (value == null || isNaN(value)) return '-';
    return formatters.percent.format(value / 100);
  };

  const formatDate = (date, format = 'date') => {
    if (!date) return '-';
    
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) return '-';

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check for special dates
    if (dateObj.toDateString() === today.toDateString()) {
      return t('formatting.dates.today');
    }
    if (dateObj.toDateString() === yesterday.toDateString()) {
      return t('formatting.dates.yesterday');
    }
    if (dateObj.toDateString() === tomorrow.toDateString()) {
      return t('formatting.dates.tomorrow');
    }

    switch (format) {
      case 'dateTime':
        return formatters.dateTime.format(dateObj);
      case 'shortDate':
        return formatters.shortDate.format(dateObj);
      default:
        return formatters.date.format(dateObj);
    }
  };

  const formatMetric = (value, type) => {
    if (value == null || isNaN(value)) return '-';
    
    switch (type) {
      case 'rmse':
      case 'mae':
        return formatNumber(value, { maximumFractionDigits: 2 });
      case 'r2':
      case 'r2_score':
        return formatPercent(value * 100);
      case 'samples':
        return formatNumber(value, { compact: true });
      default:
        return formatNumber(value);
    }
  };

  return {
    formatNumber,
    formatCurrency,
    formatPercent,
    formatDate,
    formatMetric,
    locale: i18n.language === 'fr' ? 'fr-FR' : 'en-US',
  };
};