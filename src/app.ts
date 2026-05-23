import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import config from "./config";
import { authRoute } from "./modules/auth/auth.route";
import { issuesRoute } from "./modules/issues/issues.route";
import cors from "cors";
import globalErrorHandler from "./middleware/globalErrorHandler";

const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:5000"
}))

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: `Express Server is running on Port: ${config.port}`,
    author: "Tamim Khan",
  });
});

app.use("/api/auth", authRoute);
app.use("/api/issues", issuesRoute);


app.use(globalErrorHandler);

export default app;
