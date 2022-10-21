import fs from 'fs';
import admin from 'firebase-admin';
import  express  from "express";
import { db, connectToDB } from "./db.js";

const credentials = JSON.parse(fs.readFileSync('./credentials.json'));
admin.initializeApp({
  credential: admin.credential.cert(credentials),
});  

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

app.use(async (req, res, next) => {
  const { authtoken } = req.headers;
  if (authtoken) {
    try {
          req.user = await admin.auth().verifyIdToken(authtoken);
    } catch (e) {
       return res.sendStatus(400);
    }
  }

  req.user = req.user || {};

  next();
});

app.get('/api/questionnaires/:name', async (req, res) => {
  const { name } = req.params;
  const { uid } = req.user;
  
  const answers = await db.collection('questionnaires').findOne({ name });
  if(answers) {
    const IndexIds = answers.indexIds || [];
    answers.canIndex = uid && !IndexIds.includes(uid);
    res.json(answers);
  } else {
    res.status(404).json({ message: 'Questionnaire not found' });
  }
});

app.use((req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
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
  const { uid } = req.user;
  // const currentAnswers = answers.find((a) => a.name === name); memory data
  const answers = await db.collection('questionnaires').findOne({ name });

  if(answers) {
    const IndexIds = answers.indexIds || [];
    const canIndex = uid && !IndexIds.includes(uid);
    if (canIndex) {
      await db.collection('questionnaires').updateOne(
        { name },
        { $inc: { index: 1 } },
        { $push: { indexIds: uid } },
      );
      res.sendStatus(200);
    }

 

    const currentAnswers = await db.collection('questionnaires').findOne({ name });
    res.json(currentAnswers);
  } else {
    res.status(404).send(`The ${name} questionnaire was not found`);
  }
});


app.post('/api/questionnaires/:name/answers', async (req, res) => {
  const { name } = req.params;
  const { candidateAnswers } = req.body;
  const { email } = req.user;
  // const currentAnswers = answers.find((a) => a.name === name);

  await db.collection('questionnaires').updateOne({ name }, {
    $push: { answers: { takeBy: email, candidateAnswers} }
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
