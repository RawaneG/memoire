import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Brain, 
  Globe, 
  TrendingUp, 
  Zap, 
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Activity,
  Calendar,
  Target
} from 'lucide-react';

// Components
import BackgroundElements from './components/BackgroundElements';
import LoadingSpinner from './components/LoadingSpinner';
import CountrySelector from './components/CountrySelector';
import PredictionChart from './components/PredictionChart';
import ModelSelector from './components/ModelSelector';
import MetricsDisplay from './components/MetricsDisplay';
import OfflineNotice from './components/OfflineNotice';

// Hooks
import { useApi } from './hooks/useApi';

const App = () => {
  const [country, setCountry] = useState('Senegal');
  const [model, setModel] = useState('random_forest');
  const [horizon, setHorizon] = useState(14);
  const [predictions, setPredictions] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const { loading, error, predict, clearError } = useApi();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!country) return;

    clearError();
    setIsAnalyzing(true);
    setCurrentStep(0);

    // Simulate analysis steps
    const steps = ['Fetching data', 'Processing features', 'Training model', 'Generating predictions'];
    
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    try {
      const result = await predict(country, model, horizon);
      setPredictions(result);
    } catch (err) {
      console.error('Prediction failed:', err);
    } finally {
      setIsAnalyzing(false);
      setCurrentStep(0);
    }
  };

  const resetForm = () => {
    setPredictions(null);
    clearError();
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundElements />
      <OfflineNotice />
      
      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative pt-8 pb-4"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.div
                className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-sm text-white/80 font-medium">Live Pandemic Prediction</span>
              </motion.div>
              
              <motion.h1
                className="text-5xl md:text-7xl font-bold text-white mb-4"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <span className="gradient-text">OWID</span>
                <br />
                <span className="text-white/90">Predictor</span>
              </motion.h1>
              
              <motion.p
                className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Advanced machine learning models for COVID-19 case prediction with 
                <span className="text-primary-400 font-semibold"> country-specific optimizations</span> 
                , especially for Senegal.
              </motion.p>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            
            {/* Prediction Form */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12"
            >
              {/* Control Panel */}
              <motion.div variants={itemVariants} className="lg:col-span-1">
                <div className="card-primary">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Configuration</h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Country Selection */}
                    <div>
                      <label className="block text-sm font-semibold text-white/80 mb-3">
                        <Globe className="w-4 h-4 inline mr-2" />
                        Country
                      </label>
                      <CountrySelector value={country} onChange={setCountry} />
                    </div>

                    {/* Model Selection */}
                    <div>
                      <label className="block text-sm font-semibold text-white/80 mb-3">
                        <Zap className="w-4 h-4 inline mr-2" />
                        ML Model
                      </label>
                      <ModelSelector value={model} onChange={setModel} country={country} />
                    </div>

                    {/* Horizon Selection */}
                    <div>
                      <label className="block text-sm font-semibold text-white/80 mb-3">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Prediction Horizon
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[7, 14, 21, 30].map((days) => (
                          <motion.button
                            key={days}
                            type="button"
                            className={`p-3 rounded-xl border-2 transition-all duration-300 font-medium ${
                              horizon === days
                                ? 'border-primary-400 bg-primary-500/20 text-primary-300'
                                : 'border-white/20 text-white/70 hover:border-white/40 hover:text-white'
                            }`}
                            onClick={() => setHorizon(days)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {days}d
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      className="button-primary w-full group"
                      disabled={loading || isAnalyzing || !country}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="flex items-center justify-center space-x-2">
                        {(loading || isAnalyzing) ? (
                          <div className="spinner w-5 h-5" />
                        ) : (
                          <>
                            <TrendingUp className="w-5 h-5" />
                            <span>Generate Prediction</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </span>
                    </motion.button>

                    {predictions && (
                      <motion.button
                        type="button"
                        className="button-secondary w-full"
                        onClick={resetForm}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Reset & New Prediction
                      </motion.button>
                    )}
                  </form>
                </div>
              </motion.div>

              {/* Results Panel */}
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <AnimatePresence mode="wait">
                  {(loading || isAnalyzing) && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="card-primary text-center"
                    >
                      <LoadingSpinner size="xl" text="Analyzing data" />
                      
                      {isAnalyzing && (
                        <motion.div
                          className="mt-8 space-y-3"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {['Fetching data', 'Processing features', 'Training model', 'Generating predictions'].map((step, index) => (
                            <motion.div
                              key={step}
                              className={`flex items-center space-x-3 text-sm ${
                                index <= currentStep ? 'text-white' : 'text-white/40'
                              }`}
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              {index < currentStep ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              ) : index === currentStep ? (
                                <div className="w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <div className="w-4 h-4 border-2 border-white/20 rounded-full" />
                              )}
                              <span>{step}</span>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {error && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="card-primary border border-red-500/30 bg-red-500/10"
                    >
                      <div className="text-center">
                        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-red-400 mb-2">Prediction Failed</h3>
                        <p className="text-white/70">{error}</p>
                        <motion.button
                          className="button-primary mt-6"
                          onClick={clearError}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Try Again
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {predictions && !loading && !error && (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="space-y-6"
                    >
                      {/* Metrics */}
                      <MetricsDisplay predictions={predictions} />
                      
                      {/* Chart */}
                      <div className="card-primary">
                        <div className="flex items-center space-x-3 mb-6">
                          <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl">
                            <BarChart3 className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-white">Prediction Results</h3>
                          <div className="ml-auto px-3 py-1 bg-green-500/20 text-green-400 rounded-full border border-green-500/30 text-sm font-medium">
                            {predictions.horizon_days} days
                          </div>
                        </div>
                        
                        <PredictionChart predictions={predictions} />
                      </div>
                    </motion.div>
                  )}

                  {!predictions && !loading && !error && (
                    <motion.div
                      key="welcome"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="card-primary text-center"
                    >
                      <div className="py-12">
                        <Target className="w-20 h-20 text-white/40 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-white mb-4">Ready to Predict</h3>
                        <p className="text-white/70 max-w-md mx-auto leading-relaxed">
                          Configure your parameters on the left and click "Generate Prediction" 
                          to see advanced ML-powered COVID-19 forecasts.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;