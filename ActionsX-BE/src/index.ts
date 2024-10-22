import cors from "cors";
import express, { Request, Response } from "express";
import { getActionsJson } from "./api/actionsRule";
import { getTransferAlgo } from "./api/getTransferAlgo";
import { BASE_URL, PORT } from "./utilis/config";
import { gettAllActionsRegistry } from "./api/gettAllActionsRegistry";


const DEFAULT_APT_AMOUNT = 1;
const ACTIONS_CORS_HEADERS: cors.CorsOptions = {
  origin: [
    "http://localhost:3001",
    "http://localhost:3000",
    "https://x.com",
    "https://action-x-frontend.vercel.app",
    "https://www.actionxapt.com"
  ],
  methods: ["GET", "POST", "PUT", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Content-Encoding",
    "Accept-Encoding",
  ],
  credentials: true,
};

const app = express();

app.use(express.json());
app.use(cors(ACTIONS_CORS_HEADERS));

app.get("/api/actions/transfer-apt", getTransferAlgo);
app.get("/api/actions/actions-registry/all", gettAllActionsRegistry);
app.get("/actions.json", getActionsJson);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
