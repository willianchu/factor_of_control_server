import  express  from "express";

const app = express();
app.use(express.json());

app.get("/hello", (req, res) => {
  res.send(`Hello ${req.query.name}!`);
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("Server is listening on port " + PORT);
});
