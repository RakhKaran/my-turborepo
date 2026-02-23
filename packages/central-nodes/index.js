// Central Nodes - ES Module Export
export const centralizedTools = [
  {
    id: "tool_ocr",
    title: "OCR Tool",
    description: "Extract text from an image using OCR",
    icon: "/assets/ocr.svg",
    type: "central_ocr",

    bgColor: "#1976D2",
    borderColor: "#1565C0",
    color: "#90CAF9",

    popupKey: "central_ocr_popup",

    configFields: [
      {
        name: "model",
        label: "OCR Model",
        type: "select",
        options: ["tesseract", "google_vision"]
      },
      {
        name: "language",
        label: "Language",
        type: "select",
        options: ["eng", "hin"]
      }
    ],

    defaultValues: {
      model: "",
      language: ""
    }
  },
  {
    id: "tool_api",
    title: "API Request",
    description: "Make HTTP requests to external APIs",
    icon: "/assets/api.svg",
    type: "api_request",

    bgColor: "#7C3AED",
    borderColor: "#6D28D9",
    color: "#DDD6FE",

    popupKey: "api_request_popup",

    configFields: [
      {
        name: "url",
        label: "API URL",
        type: "text"
      },
      {
        name: "method",
        label: "HTTP Method",
        type: "select",
        options: ["GET", "POST", "PUT", "DELETE", "PATCH"]
      },
      {
        name: "headers",
        label: "Headers (JSON)",
        type: "textarea"
      }
    ],

    defaultValues: {
      url: "",
      method: "GET",
      headers: "{}"
    }
  },
  {
    id: "tool_transform",
    title: "Data Transform",
    description: "Transform and map data between nodes",
    icon: "/assets/transform.svg",
    type: "data_transform",

    bgColor: "#059669",
    borderColor: "#047857",
    color: "#6EE7B7",

    popupKey: "data_transform_popup",

    configFields: [
      {
        name: "mapping",
        label: "Field Mapping",
        type: "textarea"
      },
      {
        name: "format",
        label: "Output Format",
        type: "select",
        options: ["json", "xml", "csv"]
      }
    ],

    defaultValues: {
      mapping: "",
      format: "json"
    }
  },
  {
    id: "tool_condition",
    title: "Condition",
    description: "Branch workflow based on conditions",
    icon: "/assets/condition.svg",
    type: "condition",

    bgColor: "#DC2626",
    borderColor: "#B91C1C",
    color: "#FCA5A5",

    popupKey: "condition_popup",

    configFields: [
      {
        name: "condition",
        label: "Condition Expression",
        type: "text"
      },
      {
        name: "operator",
        label: "Operator",
        type: "select",
        options: ["equals", "not_equals", "contains", "greater_than", "less_than"]
      }
    ],

    defaultValues: {
      condition: "",
      operator: "equals"
    }
  },
  {
    id: "tool_notification",
    title: "Notification",
    description: "Send notifications via email, SMS, or webhook",
    icon: "/assets/notification.svg",
    type: "notification",

    bgColor: "#EA580C",
    borderColor: "#C2410C",
    color: "#FDBA74",

    popupKey: "notification_popup",

    configFields: [
      {
        name: "channel",
        label: "Channel",
        type: "select",
        options: ["email", "sms", "webhook", "slack"]
      },
      {
        name: "recipient",
        label: "Recipient",
        type: "text"
      },
      {
        name: "message",
        label: "Message Template",
        type: "textarea"
      }
    ],

    defaultValues: {
      channel: "email",
      recipient: "",
      message: ""
    }
  },

  // ============================================
  // BBC Agent Nodes - Imported from BBC Project
  // ============================================

  // Trigger Nodes
  {
    id: "trigger_gmail",
    title: "Gmail Trigger",
    description: "Trigger workflow when new email arrives",
    icon: "MdEmail",
    type: "gmail_trigger",
    category: "triggers",

    bgColor: "#EA4335",
    borderColor: "#D33426",
    color: "#FFFFFF",

    popupKey: "gmail_trigger_popup",

    configFields: [
      {
        name: "filter",
        label: "Email Filter",
        type: "text",
        placeholder: "from:example@gmail.com"
      },
      {
        name: "folder",
        label: "Folder",
        type: "select",
        options: ["INBOX", "SENT", "DRAFTS", "SPAM"]
      }
    ],

    defaultValues: {
      filter: "",
      folder: "INBOX"
    }
  },
  {
    id: "trigger_chat",
    title: "Chat Trigger",
    description: "Trigger workflow on chat message",
    icon: "MdChat",
    type: "chat_trigger",
    category: "triggers",

    bgColor: "#4285F4",
    borderColor: "#3367D6",
    color: "#FFFFFF",

    popupKey: "chat_trigger_popup",

    configFields: [
      {
        name: "channel_id",
        label: "Channel ID",
        type: "text"
      },
      {
        name: "trigger_phrase",
        label: "Trigger Phrase",
        type: "text",
        required: false,
        placeholder: "Optional - leave empty for all messages"
      }
    ],

    defaultValues: {
      channel_id: "",
      trigger_phrase: ""
    }
  },
  {
    id: "trigger_manual",
    title: "Manual Trigger",
    description: "Manually trigger workflow execution",
    icon: "FaMousePointer",
    type: "manual_trigger",
    category: "triggers",

    bgColor: "#34A853",
    borderColor: "#2D8F47",
    color: "#FFFFFF",

    popupKey: "manual_trigger_popup",

    configFields: [
      {
        name: "input_schema",
        label: "Input Schema (JSON)",
        type: "textarea",
        placeholder: '{"query": "string", "context": "string"}'
      }
    ],

    defaultValues: {
      input_schema: "{}"
    }
  },

  // Agent Nodes
  {
    id: "agent_decision",
    title: "Decision Agent",
    description: "Evaluates inputs and routes flow based on AI decision",
    icon: "MdOutlineSupportAgent",
    type: "decision_agent",
    category: "agents",

    bgColor: "#8730EA",
    borderColor: "#6B21A8",
    color: "#E9D5FF",

    popupKey: "decision_agent_popup",

    configFields: [
      {
        name: "prompt",
        label: "Decision Prompt",
        type: "textarea",
        placeholder: "Describe the decision logic..."
      },
      {
        name: "reasoning",
        label: "Reasoning Mode",
        type: "select",
        options: ["normal", "chain_of_thought", "tree_of_thought"]
      },
      {
        name: "output_format",
        label: "Output Format",
        type: "select",
        options: ["text", "json", "structured"]
      }
    ],

    defaultValues: {
      prompt: "",
      reasoning: "normal",
      output_format: "text"
    }
  },
  {
    id: "agent_tool",
    title: "Tool Agent",
    description: "Agent with access to external tools via MCP",
    icon: "MdBuild",
    type: "tool_agent",
    category: "agents",

    bgColor: "#2563EB",
    borderColor: "#1D4ED8",
    color: "#BFDBFE",

    popupKey: "tool_agent_popup",

    configFields: [
      {
        name: "agent_id",
        label: "Agent",
        type: "select",
        options: [],
        dynamic: true,
        fetchUrl: "/agents/"
      },
      {
        name: "llm_provider",
        label: "LLM Provider",
        type: "select",
        options: ["openai", "anthropic", "google", "azure"]
      },
      {
        name: "llm_model",
        label: "LLM Model",
        type: "select",
        options: ["gpt-4", "gpt-3.5-turbo", "claude-3", "gemini-pro"],
        dependsOn: "llm_provider"
      },
      {
        name: "agent_role",
        label: "Agent Role",
        type: "text",
        placeholder: "You are an expert..."
      },
      {
        name: "agent_instructions",
        label: "Instructions",
        type: "textarea",
        placeholder: "Detailed instructions for the agent..."
      },
      {
        name: "tools",
        label: "Available Tools",
        type: "multiselect",
        options: [],
        dynamic: true,
        fetchUrl: "/tools/"
      }
    ],

    defaultValues: {
      agent_id: "",
      llm_provider: "openai",
      llm_model: "gpt-4",
      agent_role: "You are an expert customer support agent.",
      agent_instructions: "",
      tools: []
    }
  },
  {
    id: "agent_greeting",
    title: "Greeting Agent",
    description: "Handles initial user greetings and introductions",
    icon: "FaHandshake",
    type: "greeting_agent",
    category: "agents",

    bgColor: "#F59E0B",
    borderColor: "#D97706",
    color: "#FEF3C7",

    popupKey: "greeting_agent_popup",

    configFields: [
      {
        name: "greeting_template",
        label: "Greeting Template",
        type: "textarea",
        placeholder: "Hello! How can I help you today?"
      },
      {
        name: "persona",
        label: "Agent Persona",
        type: "select",
        options: ["friendly", "professional", "casual", "formal"]
      },
      {
        name: "collect_info",
        label: "Collect User Info",
        type: "select",
        options: ["none", "name", "name_email", "custom"]
      }
    ],

    defaultValues: {
      greeting_template: "Hello! How can I help you today?",
      persona: "friendly",
      collect_info: "none"
    }
  },
  {
    id: "agent_summarized",
    title: "Summarization Agent",
    description: "Summarizes long text or conversation history",
    icon: "MdSummarize",
    type: "summarized_agent",
    category: "agents",

    bgColor: "#06B6D4",
    borderColor: "#0891B2",
    color: "#CFFAFE",

    popupKey: "summarized_agent_popup",

    configFields: [
      {
        name: "summary_type",
        label: "Summary Type",
        type: "select",
        options: ["extractive", "abstractive", "bullet_points", "key_insights"]
      },
      {
        name: "max_length",
        label: "Max Length (words)",
        type: "number",
        min: 50,
        max: 1000
      },
      {
        name: "focus_areas",
        label: "Focus Areas",
        type: "textarea",
        placeholder: "Specific topics to focus on..."
      }
    ],

    defaultValues: {
      summary_type: "abstractive",
      max_length: 200,
      focus_areas: ""
    }
  },
  {
    id: "agent_knowledge_base",
    title: "Knowledge Base Agent",
    description: "Agent that retrieves information from knowledge bases",
    icon: "FaDatabase",
    type: "kb_agent",
    category: "agents",

    bgColor: "#10B981",
    borderColor: "#059669",
    color: "#D1FAE5",

    popupKey: "kb_agent_popup",

    configFields: [
      {
        name: "kb_id",
        label: "Knowledge Base",
        type: "select",
        options: [],
        dynamic: true,
        fetchUrl: "/knowledge-bases/"
      },
      {
        name: "retrieval_type",
        label: "Retrieval Type",
        type: "select",
        options: ["basic", "advanced", "hybrid"]
      },
      {
        name: "num_chunks",
        label: "Number of Chunks",
        type: "number",
        min: 1,
        max: 20
      },
      {
        name: "score_threshold",
        label: "Score Threshold",
        type: "number",
        min: 0,
        max: 1,
        step: 0.1
      }
    ],

    defaultValues: {
      kb_id: "",
      retrieval_type: "basic",
      num_chunks: 5,
      score_threshold: 0.7
    }
  },
  {
    id: "agent_response",
    title: "Response Agent",
    description: "Generates final response based on context",
    icon: "MdReply",
    type: "response_agent",
    category: "agents",

    bgColor: "#8B5CF6",
    borderColor: "#7C3AED",
    color: "#EDE9FE",

    popupKey: "response_agent_popup",

    configFields: [
      {
        name: "response_template",
        label: "Response Template",
        type: "textarea",
        placeholder: "Template for generating responses..."
      },
      {
        name: "tone",
        label: "Response Tone",
        type: "select",
        options: ["helpful", "concise", "detailed", "empathetic"]
      },
      {
        name: "include_sources",
        label: "Include Sources",
        type: "select",
        options: ["yes", "no"]
      }
    ],

    defaultValues: {
      response_template: "",
      tone: "helpful",
      include_sources: "no"
    }
  },
  {
    id: "agent_router",
    title: "Decision Router",
    description: "Routes to different agents based on intent",
    icon: "MdCallSplit",
    type: "decision_router",
    category: "agents",

    bgColor: "#EC4899",
    borderColor: "#DB2777",
    color: "#FCE7F3",

    popupKey: "decision_router_popup",

    configFields: [
      {
        name: "routing_logic",
        label: "Routing Logic",
        type: "textarea",
        placeholder: "Define routing rules..."
      },
      {
        name: "default_route",
        label: "Default Route",
        type: "text"
      },
      {
        name: "routes",
        label: "Routes (JSON)",
        type: "textarea",
        placeholder: '[{"intent": "billing", "target": "billing_agent"}]'
      }
    ],

    defaultValues: {
      routing_logic: "",
      default_route: "fallback",
      routes: "[]"
    }
  },

  // Knowledge & Data Nodes
  {
    id: "node_knowledge_base",
    title: "Knowledge Base",
    description: "Connect to a knowledge base for retrieval",
    icon: "FaDatabase",
    type: "knowledge_base",
    category: "data",

    bgColor: "#3B82F6",
    borderColor: "#2563EB",
    color: "#DBEAFE",

    popupKey: "knowledge_base_popup",

    configFields: [
      {
        name: "kb_id",
        label: "Knowledge Base",
        type: "select",
        options: [],
        dynamic: true,
        fetchUrl: "/knowledge-bases/"
      },
      {
        name: "query_field",
        label: "Query Field",
        type: "text",
        placeholder: "input.query"
      }
    ],

    defaultValues: {
      kb_id: "",
      query_field: ""
    }
  },
  {
    id: "node_tools",
    title: "Tools Node",
    description: "Connect external tools to agents",
    icon: "MdBuild",
    type: "tools_node",
    category: "data",

    bgColor: "#14B8A6",
    borderColor: "#0D9488",
    color: "#CCFBF1",

    popupKey: "tools_node_popup",

    configFields: [
      {
        name: "tool_id",
        label: "Tool",
        type: "select",
        options: [],
        dynamic: true,
        fetchUrl: "/tools/"
      },
      {
        name: "tool_config",
        label: "Tool Configuration (JSON)",
        type: "textarea"
      }
    ],

    defaultValues: {
      tool_id: "",
      tool_config: "{}"
    }
  },

  // Output Nodes
  {
    id: "node_output",
    title: "Output",
    description: "Final output node for workflow results",
    icon: "FaSignOutAlt",
    type: "output_node",
    category: "general",

    bgColor: "#6366F1",
    borderColor: "#4F46E5",
    color: "#E0E7FF",

    popupKey: "output_popup",

    configFields: [
      {
        name: "output_type",
        label: "Output Type",
        type: "select",
        options: ["text", "json", "file", "webhook"]
      },
      {
        name: "format_template",
        label: "Format Template",
        type: "textarea"
      }
    ],

    defaultValues: {
      output_type: "text",
      format_template: ""
    }
  },

  // Utility Nodes
  {
    id: "node_switch",
    title: "Switch",
    description: "Conditional branching based on rules",
    icon: "MdCallSplit",
    type: "switch_node",
    category: "utility",

    bgColor: "#F97316",
    borderColor: "#EA580C",
    color: "#FED7AA",

    popupKey: "switch_popup",

    configFields: [
      {
        name: "rules",
        label: "Rules (JSON)",
        type: "textarea",
        placeholder: '[{"condition": "value > 10", "output": "high"}]'
      },
      {
        name: "default_output",
        label: "Default Output",
        type: "text"
      }
    ],

    defaultValues: {
      rules: "[]",
      default_output: "default"
    }
  },
  {
    id: "node_set",
    title: "Set Variable",
    description: "Set or transform variables in workflow",
    icon: "MdEdit",
    type: "set_node",
    category: "utility",

    bgColor: "#78716C",
    borderColor: "#57534E",
    color: "#E7E5E4",

    popupKey: "set_popup",

    configFields: [
      {
        name: "variable_name",
        label: "Variable Name",
        type: "text"
      },
      {
        name: "value_expression",
        label: "Value Expression",
        type: "textarea",
        placeholder: "input.data.field"
      }
    ],

    defaultValues: {
      variable_name: "",
      value_expression: ""
    }
  },
  {
    id: "node_pdf_extractor",
    title: "PDF Extractor",
    description: "Extract text and data from PDF files",
    icon: "FaFilePdf",
    type: "pdf_extractor",
    category: "utility",

    bgColor: "#EF4444",
    borderColor: "#DC2626",
    color: "#FECACA",

    popupKey: "pdf_extractor_popup",

    configFields: [
      {
        name: "extraction_mode",
        label: "Extraction Mode",
        type: "select",
        options: ["text_only", "with_tables", "structured"]
      },
      {
        name: "pages",
        label: "Pages",
        type: "text",
        placeholder: "all, 1-5, or 1,3,5"
      }
    ],

    defaultValues: {
      extraction_mode: "text_only",
      pages: "all"
    }
  }
];

export default { centralizedTools };
