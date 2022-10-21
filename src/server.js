import  express  from "express";
import { db, connectToDB } from "./db.js";

// let answers = [
//   {
//     name: "disc-test",
//     answers: [],
//     index: 0,
//   },
//   {
//     name: "soft-skills",
//     answers: [],
//     index: 0,
//   },
//   {
//     name: "knowledge",
//     answers: [],
//     index: 0,
//   },
// ];

const app = express();
app.use(express.json());

app.get('/api/questionnaires/:name', async (req, res) => {
  const { name } = req.params;
  
  const answers = await db.collection('questionnaires').findOne({ name });
  if(answers) {
    console.log(answers);
    res.json(answers);
  } else {
    res.status(404).json({ message: 'Questionnaire not found' });
  }
});



app.post("/hello", (req, res) => {
  res.send(`Hello ${req.query.name}!`);
});

app.get('/hello/:name', (req, res) => {
  const { name } = req.params;
  res.send(`Hello ${name}!`);
});

app.put('/api/questionnaires/:name/index', async (req, res) => {
  const { name } = req.params;
  // const currentAnswers = answers.find((a) => a.name === name); memory data

  await db.collection('questionnaires').updateOne({ name }, { $inc: { index: 1 } });

  const currentAnswers = await db.collection('questionnaires').findOne({ name });

  if (currentAnswers) {
    res.json(currentAnswers);
  } else {
    res.status(404).send(`The ${name} questionnaire was not found`);
  }
});


app.post('/api/questionnaires/:name/answers', async (req, res) => {
  const { name } = req.params;
  const { candidateAnswers } = req.body;
  console.log(req.body);
  // const currentAnswers = answers.find((a) => a.name === name);

  await db.collection('questionnaires').updateOne({ name }, {
    $push: { answers: { candidateAnswers} }
  });

  const currentAnswers = await db.collection('questionnaires').findOne({ name });

  if (currentAnswers) {
    res.json(currentAnswers);
  } else {
    res.status(404).send(`The ${name} questionnaire was not found`);
    return;
  }

});

const PORT = process.env.PORT || 8000;

connectToDB(() => {
  console.log('Connected to DB');
  app.listen(PORT, () => {
    console.log("Server is listening on port " + PORT);
  });
});
