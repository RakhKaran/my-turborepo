import cors from "cors";
import express from "express";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const PORT = Number(process.env.AGENTS_API_PORT || 3060);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, "..", "data");
const agentsFilePath = path.join(dataDir, "agents.json");
const toolsFilePath = path.join(dataDir, "tools.json");
const knowledgeBasesFilePath = path.join(dataDir, "knowledge-bases.json");

app.use(cors());
app.use(express.json());

async function ensureStore() {
  await mkdir(dataDir, { recursive: true });
  try {
    await readFile(agentsFilePath, "utf8");
  } catch {
    await writeFile(agentsFilePath, "[]", "utf8");
  }
  try {
    await readFile(toolsFilePath, "utf8");
  } catch {
    await writeFile(toolsFilePath, "[]", "utf8");
  }
  try {
    await readFile(knowledgeBasesFilePath, "utf8");
  } catch {
    await writeFile(knowledgeBasesFilePath, "[]", "utf8");
  }
}

async function readAgents() {
  await ensureStore();
  const raw = await readFile(agentsFilePath, "utf8");
  const parsed = JSON.parse(raw || "[]");
  return Array.isArray(parsed) ? parsed : [];
}

async function writeAgents(agents) {
  await writeFile(agentsFilePath, JSON.stringify(agents, null, 2), "utf8");
}

async function readTools() {
  await ensureStore();
  const raw = await readFile(toolsFilePath, "utf8");
  const parsed = JSON.parse(raw || "[]");
  return Array.isArray(parsed) ? parsed : [];
}

async function readKnowledgeBases() {
  await ensureStore();
  const raw = await readFile(knowledgeBasesFilePath, "utf8");
  const parsed = JSON.parse(raw || "[]");
  return Array.isArray(parsed) ? parsed : [];
}

function normalizeAgent(input) {
  const title = String(input?.title || input?.name || "").trim();
  const now = new Date().toISOString();
  return {
    id: String(input?.id || "").trim(),
    title,
    // Keep name as alias for existing UI mapping
    name: title,
    status: input?.status ? String(input.status) : "active",
    description: input?.description ? String(input.description) : "",
    configFields: Array.isArray(input?.configFields) ? input.configFields : [],
    defaultValues:
      input?.defaultValues &&  input.defaultValues === "object"
        ? input.defaultValuestypeof
        : {},
    execution:
      input?.execution && typeof input.execution === "object"
        ? input.execution
        : {
            endpoint: "",
            method: "POST",
            headers: {},
            auth: {
              type: "none",
              credentialRef: "",
            },
            queryParams: [],
            bodyTemplate: {},
            timeoutMs: 30000,
          },
    createdAt: input?.createdAt || now,
    updatedAt: now,
  };
}

function validateAgentPayload(payload, { partial = false } = {}) {
  if (!payload || typeof payload !== "object") {
    return "Payload must be a JSON object";
  }

  if (!partial) {
    if (!String(payload.id || "").trim()) return "id is required";
    if (!String(payload.title || payload.name || "").trim()) {
      return "title (or name) is required";
    }
  }

  if (payload.configFields !== undefined && !Array.isArray(payload.configFields)) {
    return "configFields must be an array";
  }

  if (
    payload.defaultValues !== undefined &&
    (typeof payload.defaultValues !== "object" ||
      payload.defaultValues === null ||
      Array.isArray(payload.defaultValues))
  ) {
    return "defaultValues must be an object";
  }

  if (
    payload.execution !== undefined &&
    (typeof payload.execution !== "object" ||
      payload.execution === null ||
      Array.isArray(payload.execution))
  ) {
    return "execution must be an object";
  }

  return null;
}

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/agents", async (_req, res) => {
  try {
    const agents = await readAgents();
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch agents", error: String(error) });
  }
});

app.get("/tools", async (_req, res) => {
  try {
    const tools = await readTools();
    res.json(tools);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tools", error: String(error) });
  }
});

app.get("/knowledge-bases", async (_req, res) => {
  try {
    const knowledgeBases = await readKnowledgeBases();
    res.json(knowledgeBases);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch knowledge bases", error: String(error) });
  }
});

app.post("/agents", async (req, res) => {
  try {
    const validationError = validateAgentPayload(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }
    const normalized = normalizeAgent(req.body);

    const agents = await readAgents();
    const exists = agents.some((item) => item.id === normalized.id);
    if (exists) {
      return res.status(409).json({ message: `Agent with id '${normalized.id}' already exists` });
    }

    agents.push(normalized);
    await writeAgents(agents);
    return res.status(201).json(normalized);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create agent", error: String(error) });
  }
});

app.patch("/agents/:id", async (req, res) => {
  try {
    const id = String(req.params.id || "").trim();
    if (!id) {
      return res.status(400).json({ message: "Agent id is required" });
    }

    const validationError = validateAgentPayload(req.body, { partial: true });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const agents = await readAgents();
    const index = agents.findIndex((item) => item.id === id);
    if (index === -1) {
      return res.status(404).json({ message: `Agent '${id}' not found` });
    }

    const current = agents[index];
    const updates = req.body || {};
    const title =
      updates.title !== undefined || updates.name !== undefined
        ? String(updates.title || updates.name || "").trim()
        : current.title;
    const next = {
      ...current,
      ...(title ? { title, name: title } : {}),
      ...(updates.status ? { status: String(updates.status) } : {}),
      ...(updates.description !== undefined
        ? { description: String(updates.description || "") }
        : {}),
      ...(updates.configFields !== undefined ? { configFields: updates.configFields } : {}),
      ...(updates.defaultValues !== undefined ? { defaultValues: updates.defaultValues } : {}),
      ...(updates.execution !== undefined ? { execution: updates.execution } : {}),
      updatedAt: new Date().toISOString(),
    };

    agents[index] = next;
    await writeAgents(agents);
    return res.json(next);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update agent", error: String(error) });
  }
});

app.listen(PORT, () => {
  console.log(`Agents API running on http://localhost:${PORT}`);
});
