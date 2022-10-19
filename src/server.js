import  express  from "express";

const app = express();
app.use(express.json());

app.post("/hello", (req, res) => {
  res.send(`Hello ${req.query.name}!`);
});

app.get('/hello/:name', (req, res) => {
  const { name } = req.params;
  res.send(`Hello ${name}!`);
});



const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("Server is listening on port " + PORT);
});
