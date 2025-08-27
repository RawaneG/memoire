import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart
} from 'recharts';

const PredictionChart = ({ predictions }) => {
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

  const maxValue = useMemo(() => {
    if (chartData.length === 0) return 0;
    return Math.max(...chartData.map(d => d.confidence_upper));
  }, [chartData]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-morphism p-4 rounded-2xl border border-white/30"
        >
          <div className="text-white font-semibold mb-2">{data.date}</div>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-white/80">Predicted Cases:</span>
              <span className="text-white font-bold">{data.prediction.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-300 rounded-full opacity-50"></div>
              <span className="text-white/60 text-sm">
                Range: {data.confidence_lower.toLocaleString()} - {data.confidence_upper.toLocaleString()}
              </span>
            </div>
          </div>
        </motion.div>
      );
    }
    return null;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-white/60">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 opacity-50">
            📈
          </div>
          <p>No prediction data available</p>
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
              tickFormatter={formatDate}
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
              tickFormatter={(value) => value.toLocaleString()}
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
          <span className="text-white/80">Predicted Cases</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-300 rounded-full opacity-50"></div>
          <span className="text-white/80">Confidence Range</span>
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
            {Math.min(...chartData.map(d => d.prediction)).toLocaleString()}
          </div>
          <div className="text-sm text-white/60">Minimum</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-400">
            {Math.max(...chartData.map(d => d.prediction)).toLocaleString()}
          </div>
          <div className="text-sm text-white/60">Maximum</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">
            {Math.round(chartData.reduce((sum, d) => sum + d.prediction, 0) / chartData.length).toLocaleString()}
          </div>
          <div className="text-sm text-white/60">Average</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">
            {chartData.reduce((sum, d) => sum + d.prediction, 0).toLocaleString()}
          </div>
          <div className="text-sm text-white/60">Total</div>
        </div>
      </motion.div>
    </div>
  );
};

export default PredictionChart;