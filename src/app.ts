import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import config from "./config";

const app: Application = express();

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: `Express Server is running on Port: ${config.port}`,
    author: "Tamim Khan",
  });
});

export default app;
