import axios from "axios";
import express from "express";
import dotenv from "dotenv";
import cluster from "cluster";
import os from "os";
import http from "http";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.MYFIB_EXPRESS_PROXY_PORT || 5000;
const url = process.env.MYFIB_BASE_URL;

app.use(cors());
app.use(express.json({ limit: "10kb" }));

const generateHeaders = ({ token, customer, ebankref }) => ({
  Accept: "application/json, text/plain, */*",
  // "Accept-Language": "bg",
  Authorization: `Bearer ${token}`,
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
  // DNT: "1",
  // "EBank-App-Version": "1",
  "EBank-Client-Time": new Date().toISOString(),
  "EBank-Cust-Id": customer,
  "EBank-Device-Id": "AABBCCDDEE",
  "EBank-Referer": ebankref,
  // "If-Modified-Since": "Mon, 26 Jul 1997 05:00:00 GMT",
  Pragma: "no-cache",
  Referer: "https://my.fibank.bg/dashboard",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  // "X-Requested-With": "XMLHttpRequest",
  // "sec-ch-ua":
  // '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
  // "sec-ch-ua-mobile": "?0",
  // "sec-ch-ua-platform": '"Windows"',
});

const axiosInstance = axios.create({
  timeout: 10000,
  httpAgent: new http.Agent({ keepAlive: true, maxSockets: 1000 }),
});

async function apiClient({
  method = "GET",
  endpoint,
  token,
  customer,
  ebankref,
}) {
  const fullUrl = `${url}/${endpoint}`;

  try {
    const response = await axiosInstance({
      method,
      url: fullUrl,
      headers: generateHeaders({ token, customer, ebankref }),
    });
    return response.data;
  } catch (error) {
    return {
      error: "Network error or invalid JSON response",
      details: error.response?.data || error.message,
      status: error.response?.status || 500,
    };
  }
}

app.get("/:path(*)", async (req, res) => {
  const { path } = req.params;
  const { token, customer, ebankref } = req.headers;
  if (!token || !ebankref || !path) {
    return res
      .status(400)
      .json({ error: "Token, ebankref, and endpoint path are required" });
  }

  const data = await apiClient({
    method: req.method,
    endpoint: path,
    token,
    customer,
    ebankref,
  });

  if (data.status && data.status !== 200) {
    return res
      .status(data.status)
      .json({ error: data.error, details: data.details });
  }

  res.status(200).json(data);
});

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died, starting a new one`);
    cluster.fork();
  });
} else {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
