const environments = {
  development: {
    API_BASE_URL: 'http://localhost:5000',
  },
  production: {
    API_BASE_URL: 'https://your-production-api.com',
  },
  staging: {
    API_BASE_URL: 'https://your-staging-api.com',
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