import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Gauge, 
  TrendingUp, 
  Award, 
  Database,
  Zap,
  Settings,
  MapPin
} from 'lucide-react';

const MetricsDisplay = ({ predictions }) => {
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
    if (r2Score >= 0.8) return { text: 'Excellent', color: 'text-green-400' };
    if (r2Score >= 0.6) return { text: 'Good', color: 'text-yellow-400' };
    if (r2Score >= 0.4) return { text: 'Fair', color: 'text-orange-400' };
    return { text: 'Poor', color: 'text-red-400' };
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
            <h3 className="text-lg font-bold text-white">Model Performance</h3>
            <p className="text-sm text-white/60">Overall accuracy metrics</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-sm">R² Score</span>
            <div className={`px-3 py-1 rounded-full border text-sm font-bold ${getScoreColor(metrics.r2_score, 'r2')}`}>
              {(metrics.r2_score * 100).toFixed(1)}%
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-sm">Performance</span>
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
            <h3 className="text-lg font-bold text-white">Error Analysis</h3>
            <p className="text-sm text-white/60">Prediction accuracy</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-sm">RMSE</span>
            <div className={`px-3 py-1 rounded-full border text-sm font-bold ${getScoreColor(metrics.rmse)}`}>
              {metrics.rmse.toFixed(1)}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-sm">MAE</span>
            <div className={`px-3 py-1 rounded-full border text-sm font-bold ${getScoreColor(metrics.mae)}`}>
              {metrics.mae.toFixed(1)}
            </div>
          </div>
          
          <div className="text-xs text-white/60 pt-2 border-t border-white/10">
            Lower values indicate better accuracy
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
            <h3 className="text-lg font-bold text-white">Training Data</h3>
            <p className="text-sm text-white/60">Dataset information</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-sm">Training Samples</span>
            <span className="text-white font-bold">{training_samples?.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-sm">Test Samples</span>
            <span className="text-white font-bold">{test_samples?.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-sm">Features Used</span>
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
            <h3 className="text-lg font-bold text-white">Configuration</h3>
            <p className="text-sm text-white/60">Model and country settings</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <MapPin className="w-4 h-4 text-primary-400" />
              <div>
                <div className="text-sm text-white/60">Country</div>
                <div className="text-white font-semibold">{country}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Zap className="w-4 h-4 text-accent-400" />
              <div>
                <div className="text-sm text-white/60">Model Type</div>
                <div className="text-white font-semibold">
                  {model_type === 'random_forest' ? 'Random Forest' : 
                   model_type === 'gradient_boost' ? 'Gradient Boosting' : 
                   'Linear Regression'}
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="text-sm text-white/60 mb-2">Features ({features_used?.length})</div>
            <div className="max-h-20 overflow-y-auto space-y-1">
              {features_used?.slice(0, 6).map((feature, index) => (
                <div key={index} className="text-xs px-2 py-1 bg-white/10 rounded-lg text-white/80">
                  {feature.replace(/_/g, ' ').replace(/lag/g, 'lag')}
                </div>
              ))}
              {features_used?.length > 6 && (
                <div className="text-xs text-white/60">
                  +{features_used.length - 6} more
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