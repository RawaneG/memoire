import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useFormatting } from '../hooks/useFormatting';
import { 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  ComposedChart
} from 'recharts';

const PredictionChart = ({ predictions }) => {
  const { t } = useTranslation();
  const { formatNumber, formatDate } = useFormatting();
  const chartData = useMemo(() => {
    if (!predictions || !predictions.predictions) return [];

    return predictions.predictions.map((pred, index) => ({
      date: pred.date,
      prediction: Math.round(pred.prediction),
      day: index + 1,
      confidence_upper: Math.round(pred.prediction * 1.2), // Simulated confidence interval
      confidence_lower: Math.round(pred.prediction * 0.8),
    }));
  }, [predictions]);


  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-morphism p-4 rounded-2xl border border-white/30"
        >
          <div className="text-white font-semibold mb-2">{formatDate(data.date)}</div>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-white/80">{t('predictionChart.predictedCases')}:</span>
              <span className="text-white font-bold">{formatNumber(data.prediction)}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-300 rounded-full opacity-50"></div>
              <span className="text-white/60 text-sm">
                {t('predictionChart.range')}: {formatNumber(data.confidence_lower)} - {formatNumber(data.confidence_upper)}
              </span>
            </div>
          </div>
        </motion.div>
      );
    }
    return null;
  };

  const formatDateForChart = (dateStr) => {
    const date = new Date(dateStr);
    return formatDate(date, 'shortDate');
  };

  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-white/60">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 opacity-50">
            📈
          </div>
          <p>{t('predictionChart.noData')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="h-80"
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="predictionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#93c5fd" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#93c5fd" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(255,255,255,0.1)" 
              vertical={false}
            />
            
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDateForChart}
              stroke="rgba(255,255,255,0.6)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            
            <YAxis 
              stroke="rgba(255,255,255,0.6)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatNumber(value, { compact: true })}
            />
            
            {/* Confidence interval area */}
            <Area
              type="monotone"
              dataKey="confidence_upper"
              stroke="none"
              fill="url(#confidenceGradient)"
              stackId="confidence"
            />
            
            <Area
              type="monotone"
              dataKey="confidence_lower"
              stroke="none"
              fill="url(#confidenceGradient)"
              stackId="confidence"
            />
            
            {/* Main prediction line */}
            <Line 
              type="monotone" 
              dataKey="prediction" 
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#ffffff' }}
            />
            
            <Tooltip content={<CustomTooltip />} />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Chart Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center justify-center space-x-6 text-sm"
      >
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-white/80">{t('predictionChart.predictedCases')}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-300 rounded-full opacity-50"></div>
          <span className="text-white/80">{t('predictionChart.confidenceRange')}</span>
        </div>
      </motion.div>

      {/* Summary Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/10"
      >
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">
            {formatNumber(Math.min(...chartData.map(d => d.prediction)))}
          </div>
          <div className="text-sm text-white/60">{t('predictionChart.minimum')}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-400">
            {formatNumber(Math.max(...chartData.map(d => d.prediction)))}
          </div>
          <div className="text-sm text-white/60">{t('predictionChart.maximum')}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">
            {formatNumber(Math.round(chartData.reduce((sum, d) => sum + d.prediction, 0) / chartData.length))}
          </div>
          <div className="text-sm text-white/60">{t('predictionChart.average')}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">
            {formatNumber(chartData.reduce((sum, d) => sum + d.prediction, 0))}
          </div>
          <div className="text-sm text-white/60">{t('predictionChart.total')}</div>
        </div>
      </motion.div>
    </div>
  );
};

export default PredictionChart;