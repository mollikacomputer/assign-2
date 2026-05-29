import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { authRouter } from "./modules/auth/auth.router";
import { issueRouter } from "./modules/issues/issues.router";

const app: Application = express();

app.use(express.json());
// app.use(express.text());
app.use(express.urlencoded({ extended: true }));

// home page get api
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "DevPlus Home page",
    author: "Ranjit Kumar Mandal",
  });
});


app.use('/api/auth', authRouter);
app.use('/api/issues', issueRouter);


export default app;