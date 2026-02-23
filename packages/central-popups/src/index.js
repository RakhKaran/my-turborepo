import CentralPopup from "./CentralPopup.js";
import AgentPopup from "./AgentPopup.js";

// Popup Registry - Maps popupKey from node definitions to React components
// All nodes use CentralPopup (dynamic form generator) unless they need custom logic

export const popupRegistry = {
  // Original Mono nodes
  central_ocr_popup: CentralPopup,
  api_request_popup: CentralPopup,
  data_transform_popup: CentralPopup,
  condition_popup: CentralPopup,
  notification_popup: CentralPopup,

  // BBC Trigger nodes
  gmail_trigger_popup: CentralPopup,
  chat_trigger_popup: CentralPopup,
  manual_trigger_popup: CentralPopup,

  // BBC Agent nodes - Use AgentPopup for enhanced agent configuration
  decision_agent_popup: AgentPopup,
  tool_agent_popup: AgentPopup,
  greeting_agent_popup: AgentPopup,
  summarized_agent_popup: AgentPopup,
  kb_agent_popup: AgentPopup,
  response_agent_popup: AgentPopup,
  decision_router_popup: AgentPopup,

  // BBC Data nodes
  knowledge_base_popup: CentralPopup,
  tools_node_popup: CentralPopup,

  // BBC Utility nodes
  output_popup: CentralPopup,
  switch_popup: CentralPopup,
  set_popup: CentralPopup,
  pdf_extractor_popup: CentralPopup,
};

export default popupRegistry;
