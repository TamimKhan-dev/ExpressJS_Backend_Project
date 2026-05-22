import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import config from "./config";
import { authRoute } from "./modules/auth/auth.route";
import { issuesRoute } from "./modules/issues/issues.route";

const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: `Express Server is running on Port: ${config.port}`,
    author: "Tamim Khan",
  });
});

app.use("/api/auth", authRoute);
app.use("/api/issues", issuesRoute)

export default app;
