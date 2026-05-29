import express, { type Application, type Request, type Response } from "express";

const app : Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

const port = 3000;

app.get('/', (req:Request, res: Response) => {
  res.send('Next level assignment 2 server!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});