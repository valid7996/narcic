import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

interface LocalDb {
  v2ray_configs: any[];
  wg_configs: any[];
  admin_password?: string;
}

const app = express();
const PORT = 3000;

app.use(express.json());

// Set up fallback database file paths
const FALLBACK_DB_PATH = path.join(process.cwd(), "db_fallback.json");

// Ensure fallback db file exists
if (!fs.existsSync(FALLBACK_DB_PATH)) {
  fs.writeFileSync(
    FALLBACK_DB_PATH,
    JSON.stringify({ v2ray_configs: [], wg_configs: [] }, null, 2)
  );
}

// Function to read local DB
function readLocalDb(): LocalDb {
  try {
    const data = fs.readFileSync(FALLBACK_DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    return { v2ray_configs: [], wg_configs: [] };
  }
}

// Function to write local DB
function writeLocalDb(dbData: LocalDb) {
  try {
    fs.writeFileSync(FALLBACK_DB_PATH, JSON.stringify(dbData, null, 2));
  } catch (e) {
    console.error("Failed to write local fallback database:", e);
  }
}

// Read Firebase Applet Configuration if available to fetch token dynamically
let apiKey = "";
try {
  const firebaseConfigPath = path.join(process.cwd(), "src", "firebase-applet-config.json");
  if (fs.existsSync(firebaseConfigPath)) {
    const raw = fs.readFileSync(firebaseConfigPath, "utf-8");
    const json = JSON.parse(raw);
    apiKey = json.apiKey || "";
  }
} catch (e) {
  // No-op
}

const ADMIN_PASSWORD_REQUIRED = "3528";

/**
 * Middleware to verify simple state or admin password.
 * Only the master password '3528' is allowed to proceed.
 */
async function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "دسترسی غیرمجاز. برای تغییرات یا افزودن ساب، ورود به پنل مدیریت با رمز معتبر الزامی است." });
  }

  const token = authHeader.split(" ")[1];
  if (token === ADMIN_PASSWORD_REQUIRED) {
    return next();
  }

  return res.status(403).json({ error: "خطای دسترسی. تنها مدیر سیستم با رمز عبور معتبر (۳۵۲۸) مجاز به انجام این عملیات است." });
}

// ------------------------------------------------------------------
// API ENDPOINTS FOR THE DATABASE MGMT (With Fallback Support)
// ------------------------------------------------------------------

// Check if server is healthy
app.get("/api/health", (req, res) => {
  const dbData = readLocalDb();
  res.json({
    status: "ok",
    fallbackEnabled: true,
    hasApiKey: !!apiKey && apiKey !== "dummy-api-key",
    hasPassword: !!dbData.admin_password,
  });
});

// Get authorization status (has password or need setup)
app.get("/api/auth/status", (req, res) => {
  const dbData = readLocalDb();
  res.json({
    hasPassword: !!dbData.admin_password,
  });
});

// Setup admin password (any password chosen by user)
app.post("/api/auth/setup", (req, res) => {
  const { password } = req.body;
  if (!password || typeof password !== "string" || password.trim().length === 0) {
    return res.status(400).json({ error: "رمز عبور نمی‌تواند خالی باشد." });
  }

  const dbData = readLocalDb();
  dbData.admin_password = password.trim();
  writeLocalDb(dbData);
  res.json({ success: true, message: "رمز عبور با موفقیت تعیین شد." });
});

// Login using password (3528 for admin, saved passcode for regular user)
app.post("/api/auth/login", (req, res) => {
  const { password } = req.body;
  const dbData = readLocalDb();
  
  const trimmed = password ? password.trim() : "";
  if (trimmed === ADMIN_PASSWORD_REQUIRED) {
    return res.json({ success: true, token: ADMIN_PASSWORD_REQUIRED, isAdmin: true });
  }

  if (dbData.admin_password && trimmed === dbData.admin_password) {
    return res.json({ success: true, token: dbData.admin_password, isAdmin: false });
  }

  return res.status(401).json({ error: "رمز عبور وارد شده نادرست است." });
});

// Fetch all elements (syncing frontend and local state gracefully)
app.get("/api/configs", (req, res) => {
  const dbData = readLocalDb();
  res.json(dbData);
});

// Create/Update V2Ray configuration
app.post("/api/configs/v2ray", requireAuth, (req, res) => {
  const config = req.body;
  if (!config.id || !config.name) {
    return res.status(400).json({ error: "V2Ray configuration must have ID and Name." });
  }

  const dbData = readLocalDb();
  const index = dbData.v2ray_configs.findIndex((c) => c.id === config.id);

  if (index >= 0) {
    dbData.v2ray_configs[index] = { ...dbData.v2ray_configs[index], ...config, updatedAt: new Date().toISOString() };
  } else {
    dbData.v2ray_configs.push({
      ...config,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  writeLocalDb(dbData);
  res.json({ success: true, configs: dbData.v2ray_configs });
});

// Create/Update WireGuard configuration
app.post("/api/configs/wg", requireAuth, (req, res) => {
  const config = req.body;
  if (!config.id || !config.name) {
    return res.status(400).json({ error: "WireGuard configuration must have ID and Name." });
  }

  const dbData = readLocalDb();
  const index = dbData.wg_configs.findIndex((c) => c.id === config.id);

  if (index >= 0) {
    dbData.wg_configs[index] = { ...dbData.wg_configs[index], ...config, updatedAt: new Date().toISOString() };
  } else {
    dbData.wg_configs.push({
      ...config,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  writeLocalDb(dbData);
  res.json({ success: true, configs: dbData.wg_configs });
});

// Delete configuration
app.delete("/api/configs/:type/:id", requireAuth, (req, res) => {
  const { type, id } = req.params;
  const dbData = readLocalDb();

  if (type === "v2ray") {
    dbData.v2ray_configs = dbData.v2ray_configs.filter((c) => c.id !== id);
  } else if (type === "wg") {
    dbData.wg_configs = dbData.wg_configs.filter((c) => c.id !== id);
  } else {
    return res.status(400).json({ error: "Invalid type." });
  }

  writeLocalDb(dbData);
  res.json({ success: true });
});

// ------------------------------------------------------------------
// "WORKER" SUBCRIPTION DYNAMIC ENDPOINTS
// ------------------------------------------------------------------

/**
 * Worker endpoint for v2rayNG Subscriptions.
 * Fetches the configuration, resolves optional remote subscription URLs,
 * merges everything, and returns a Base64-encoded payload representing
 * the nodes.
 */
app.get("/api/sub/v2ray/:id", async (req, res) => {
  const { id } = req.params;
  const dbData = readLocalDb();
  const config = dbData.v2ray_configs.find((c) => c.id === id && c.isActive);

  if (!config) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(404).send("Subscription not found or inactive.");
  }

  let finalLines: string[] = [];

  // Add manually set configs
  if (config.rawConfigs) {
    const rawLines = config.rawConfigs
      .split("\n")
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0);
    finalLines.push(...rawLines);
  }

  // Resolve external subscription URLs if configured
  if (config.url) {
    try {
      const externalRes = await fetch(config.url, {
        headers: {
          "User-Agent": "v2rayNG/1.8.5 (Android; Mobile)", // Mock a client to avoid being blocked
        },
      });
      if (externalRes.ok) {
        let text = await externalRes.text();
        text = text.trim();

        // Check if the external content is base64 encoded
        const base64Regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
        // Clean whitespaces to detect correctly
        const cleanedText = text.replace(/\s/g, "");
        if (base64Regex.test(cleanedText)) {
          try {
            const decoded = Buffer.from(cleanedText, "base64").toString("utf-8");
            const decodedLines = decoded
              .split("\n")
              .map((line: string) => line.trim())
              .filter((line: string) => line.length > 0);
            finalLines.push(...decodedLines);
          } catch (e) {
            // Treat as raw if decode fails
            finalLines.push(text);
          }
        } else {
          // Treat as raw plain text lines
          const rawLines = text
            .split("\n")
            .map((line: string) => line.trim())
            .filter((line: string) => line.length > 0);
          finalLines.push(...rawLines);
        }
      }
    } catch (err) {
      console.error(`Failed to fetch remote subscription URL: ${config.url}`, err);
    }
  }

  const outputBody = finalLines.join("\n");
  const base64Output = Buffer.from(outputBody, "utf-8").toString("base64");

  // Send content as base64 v2ray attachment with high-fidelity traffic headers
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="subscription_${id}.txt"`);
  // Subscription management standard quota info: upload=0, download=0, total=1.1TB, no expiry
  res.setHeader("Subscription-Userinfo", "upload=0; download=0; total=1208925819614; expire=0");
  res.setHeader("Profile-Update-Interval", "1");
  res.setHeader("Profile-Title", encodeURIComponent(config.name));

  return res.send(base64Output);
});

/**
 * Worker endpoint for WireGuard (wg tunnel).
 * Serves the configuration plain .conf file directly to the client.
 */
app.get("/api/sub/wg/:id", (req, res) => {
  const { id } = req.params;
  const dbData = readLocalDb();
  const config = dbData.wg_configs.find((c) => c.id === id && c.isActive);

  if (!config) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(404).send("Wireguard profile not found or inactive.");
  }

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${id}.conf"`);
  return res.send(config.configText || "# Empty Wireguard Profile");
});

// ------------------------------------------------------------------
// VITE OR STATIC FILE FALLBACK ROUTING
// ------------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Worker Web Panel] Server active on port ${PORT}`);
  });
}

startServer();
