import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, X, AlertTriangle } from 'lucide-react';
import { config } from '../config/environments';

const OfflineNotice = () => {
  const [isOffline, setIsOffline] = useState(false);
  const [showNotice, setShowNotice] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if backend is available
    const checkBackendConnection = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/health`, {
          method: 'GET',
          timeout: 3000
        });
        
        if (response.ok) {
          setIsOffline(false);
          setShowNotice(false);
        } else {
          throw new Error('Backend not responding');
        }
      } catch (error) {
        setIsOffline(true);
        if (!isDismissed) {
          setShowNotice(true);
        }
      }
    };

    // Initial check
    checkBackendConnection();

    // Check periodically
    const interval = setInterval(checkBackendConnection, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setShowNotice(false);
  };

  const noticeVariants = {
    hidden: { 
      opacity: 0, 
      y: -100,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      y: -100,
      scale: 0.9,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <AnimatePresence>
      {showNotice && isOffline && (
        <motion.div
          variants={noticeVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed top-4 right-4 z-50 max-w-sm"
        >
          <div className="glass-morphism rounded-2xl p-4 border border-orange-500/30 bg-orange-500/10">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="p-2 bg-orange-500/20 rounded-xl">
                  <WifiOff className="w-5 h-5 text-orange-400" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-orange-400">
                    Demo Mode Active
                  </h3>
                  <button
                    onClick={handleDismiss}
                    className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-white/60 hover:text-white" />
                  </button>
                </div>
                
                <p className="text-sm text-white/80 mb-3">
                  Backend server is not running. Using demo data for visualization.
                </p>
                
                <div className="flex items-center space-x-2 text-xs text-white/60">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Predictions are simulated</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Small persistent indicator when offline */}
      {isOffline && isDismissed && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-4 right-4 z-40"
        >
          <div className="glass-morphism rounded-full p-3 border border-orange-500/30 bg-orange-500/10">
            <WifiOff className="w-5 h-5 text-orange-400" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineNotice;