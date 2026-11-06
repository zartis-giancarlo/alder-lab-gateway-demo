import http from "node:http";
import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { deltaCheck } from "./delta.js";
import { createRuleStore } from "./ruleStore.js";
import { USERS } from "./Access/roles.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const seed = JSON.parse(readFileSync(path.join(here, "data", "seed.json"), "utf8"));
let store = createRuleStore(seed.rule);

const PAGES = { "/": "worklist.html", "/worklist.html": "worklist.html", "/config.html": "config.html" };
const STATUS = { NOT_AUTHORISED: 403, SELF_APPROVAL: 403, NO_PENDING: 409, ALREADY_PENDING: 409, BAD_LIMIT: 400 };

function results() {
  const rule = store.current();
  return seed.samples.map((s) => ({
    id: s.id,
    analysis: s.analysis,
    previous: s.previous,
    current: s.current,
    ...deltaCheck({ previous: s.previous, current: s.current, rule, now: seed.now }),
  }));
}

function ruleView() {
  return { ...store.current(), pending: store.pending(), users: USERS };
}

function send(res, status, body) {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString("utf8");
  return text ? JSON.parse(text) : {};
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    if (req.method === "GET" && url.pathname === "/api/results") return send(res, 200, results());
    if (req.method === "GET" && url.pathname === "/api/rule") return send(res, 200, ruleView());
    if (req.method === "GET" && url.pathname === "/api/history") return send(res, 200, store.history());
    if (req.method === "POST" && url.pathname === "/api/rule/propose") {
      const body = await readBody(req);
      store.propose(body.user, Number(body.limitPercent), body.reason);
      return send(res, 200, ruleView());
    }
    if (req.method === "POST" && url.pathname === "/api/rule/approve") {
      const body = await readBody(req);
      store.approve(body.user);
      return send(res, 200, ruleView());
    }
    // Demo helper: puts the seed state back before a test run.
    if (req.method === "POST" && url.pathname === "/api/reset") {
      store = createRuleStore(seed.rule);
      return send(res, 200, { ok: true });
    }
    if (req.method === "GET" && PAGES[url.pathname]) {
      const html = await readFile(path.join(here, "public", PAGES[url.pathname]));
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      return res.end(html);
    }
    send(res, 404, { error: "NOT_FOUND" });
  } catch (error) {
    send(res, STATUS[error.code] ?? 500, { error: error.code ?? "ERROR", message: error.message });
  }
});

const port = Number(process.env.PORT ?? 3410);
server.listen(port, () => console.log(`Alder Lab Gateway demo on http://localhost:${port} (fictional, synthetic data)`));
