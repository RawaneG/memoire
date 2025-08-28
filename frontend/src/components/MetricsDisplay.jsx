import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useFormatting } from '../hooks/useFormatting';
import { 
  Target, 
  Award, 
  Database,
  Zap,
  Settings,
  MapPin
} from 'lucide-react';

const MetricsDisplay = ({ predictions }) => {
  const { t } = useTranslation();
  const { formatNumber } = useFormatting();
  
  if (!predictions) return null;

  const { metrics, training_samples, test_samples, features_used, country, model_type } = predictions;

  const getScoreColor = (score, type = 'default') => {
    if (type === 'r2') {
      if (score >= 0.8) return 'text-green-400 bg-green-500/20 border-green-500/30';
      if (score >= 0.6) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      return 'text-red-400 bg-red-500/20 border-red-500/30';
    } else {
      // For RMSE and MAE, lower is better
      if (score <= 20) return 'text-green-400 bg-green-500/20 border-green-500/30';
      if (score <= 50) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      return 'text-red-400 bg-red-500/20 border-red-500/30';
    }
  };

  const getPerformanceDescription = (r2Score) => {
    if (r2Score >= 0.8) return { text: t('metricsDisplay.performanceLevels.excellent'), color: 'text-green-400' };
    if (r2Score >= 0.6) return { text: t('metricsDisplay.performanceLevels.good'), color: 'text-yellow-400' };
    if (r2Score >= 0.4) return { text: t('metricsDisplay.performanceLevels.fair'), color: 'text-orange-400' };
    return { text: t('metricsDisplay.performanceLevels.poor'), color: 'text-red-400' };
  };

  const performance = getPerformanceDescription(metrics.r2_score);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {/* Model Performance */}
      <motion.div variants={itemVariants} className="card-primary">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{t('metricsDisplay.modelPerformance')}</h3>
            <p className="text-sm text-white/60">{t('metricsDisplay.overallAccuracy')}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-sm">{t('predictionChart.metrics.r2Score')}</span>
            <div className={`px-3 py-1 rounded-full border text-sm font-bold ${getScoreColor(metrics.r2_score, 'r2')}`}>
              {(metrics.r2_score * 100).toFixed(1)}%
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-sm">{t('metricsDisplay.performance')}</span>
            <span className={`font-semibold ${performance.color}`}>
              {performance.text}
            </span>
          </div>

          {/* Performance bar */}
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${metrics.r2_score * 100}%` }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Error Metrics */}
      <motion.div variants={itemVariants} className="card-primary">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{t('metricsDisplay.errorAnalysis')}</h3>
            <p className="text-sm text-white/60">{t('metricsDisplay.predictionAccuracy')}</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-sm">{t('predictionChart.metrics.rmse')}</span>
            <div className={`px-3 py-1 rounded-full border text-sm font-bold ${getScoreColor(metrics.rmse)}`}>
              {metrics.rmse.toFixed(1)}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-sm">{t('predictionChart.metrics.mae')}</span>
            <div className={`px-3 py-1 rounded-full border text-sm font-bold ${getScoreColor(metrics.mae)}`}>
              {metrics.mae.toFixed(1)}
            </div>
          </div>
          
          <div className="text-xs text-white/60 pt-2 border-t border-white/10">
            {t('metricsDisplay.lowerBetter')}
          </div>
        </div>
      </motion.div>

      {/* Training Info */}
      <motion.div variants={itemVariants} className="card-primary md:col-span-2 lg:col-span-1">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
            <Database className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{t('metricsDisplay.trainingData')}</h3>
            <p className="text-sm text-white/60">{t('metricsDisplay.datasetInfo')}</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-sm">{t('metricsDisplay.trainingSamples')}</span>
            <span className="text-white font-bold">{formatNumber(training_samples)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-sm">{t('metricsDisplay.testSamples')}</span>
            <span className="text-white font-bold">{formatNumber(test_samples)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-sm">{t('metricsDisplay.featuresUsed')}</span>
            <span className="text-white font-bold">{features_used?.length || 0}</span>
          </div>
        </div>
      </motion.div>

      {/* Model Configuration */}
      <motion.div variants={itemVariants} className="card-primary md:col-span-2">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{t('metricsDisplay.configuration')}</h3>
            <p className="text-sm text-white/60">{t('metricsDisplay.modelCountrySettings')}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <MapPin className="w-4 h-4 text-primary-400" />
              <div>
                <div className="text-sm text-white/60">{t('metricsDisplay.country')}</div>
                <div className="text-white font-semibold">{country}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Zap className="w-4 h-4 text-accent-400" />
              <div>
                <div className="text-sm text-white/60">{t('metricsDisplay.modelType')}</div>
                <div className="text-white font-semibold">
                  {model_type === 'random_forest' ? 'Random Forest' : 
                   model_type === 'gradient_boost' ? 'Gradient Boosting' : 
                   'Linear Regression'}
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="text-sm text-white/60 mb-2">{t('metricsDisplay.features')} ({features_used?.length})</div>
            <div className="max-h-20 overflow-y-auto space-y-1">
              {features_used?.slice(0, 6).map((feature, index) => (
                <div key={index} className="text-xs px-2 py-1 bg-white/10 rounded-lg text-white/80">
                  {feature.replace(/_/g, ' ').replace(/lag/g, 'lag')}
                </div>
              ))}
              {features_used?.length > 6 && (
                <div className="text-xs text-white/60">
                  +{features_used.length - 6} {t('metricsDisplay.more')}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MetricsDisplay;