import agentsConfig from './agents.json';

export const getAgents = () => {
  return agentsConfig;
};

export const getAgentById = (id) => {
  return agentsConfig.find(agent => agent.id === id);
};

export default agentsConfig;
