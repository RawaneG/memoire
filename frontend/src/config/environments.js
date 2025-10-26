const environments = {
  development: {
    API_BASE_URL: 'http://localhost:5000',
  },
  production: {
    // URL du backend Fly.io
    API_BASE_URL: process.env.REACT_APP_API_URL || 'https://owid-predictor-api.fly.dev',
  },
  staging: {
    API_BASE_URL: process.env.REACT_APP_API_URL || 'https://your-staging-api.com',
  }
};

const getCurrentEnvironment = () => {
  return process.env.NODE_ENV || 'development';
};

const getEnvironmentConfig = () => {
  const env = getCurrentEnvironment();
  return environments[env] || environments.development;
};

export const config = getEnvironmentConfig();
export default config;