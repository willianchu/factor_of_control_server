import  express  from "express";

let answers = [
  {
    name: "disc-test",
    answers: [],
    index: 0,
  },
  {
    name: "soft-skills",
    answers: [],
    index: 0,
  },
  {
    name: "knowledge",
    answers: [],
    index: 0,
  },
];

const app = express();
app.use(express.json());

app.post("/hello", (req, res) => {
  res.send(`Hello ${req.query.name}!`);
});

app.get('/hello/:name', (req, res) => {
  const { name } = req.params;
  res.send(`Hello ${name}!`);
});

app.put('/api/questionnaire/:name/answers', (req, res) => {
  const { name } = req.params;
  const currentAnswers = answers.find((a) => a.name === name);
  if (currentAnswers) {
    currentAnswers.index = currentAnswers.index + 1;
    // currentAnswers.answers.push(req.body);
    res.send(`The ${name} questionnaire has answered ${currentAnswers.index} questions`);
  } else {
    res.status(404).send(`The ${name} questionnaire was not found`);
  }
});



const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("Server is listening on port " + PORT);
});
