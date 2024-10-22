import { BASE_URL } from "../utilis/config";
import { Request, Response } from "express";

export async function getTransferAlgo(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const baseHref = `${BASE_URL}/api/actions/transfer-apt`;

    const payload = {
      title: "Simple Algo Transfer",
      icon: "https://silver-worrying-wren-586.mypinata.cloud/ipfs/QmT4nPhJtiVe5f142UiaQRuYhxFDyaWw25gECqiMeJd9R2",
      description: "Transfer ALGO to another wallet",
    };
    res.json(payload);
  } catch (err) {
    res
      .status(400)
      .json({ error: (err as Error).message || "An unknown error occurred" });
  }
}
