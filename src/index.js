import {
  v4,
} from 'uuid';
import postgres from 'pg';
import express from 'express';

let adminIPs = new Set()
const secret = process.env.SECRET;
const db = new postgres.Client({
  connectionString: process.env.DATABASE_URL,
});
await db.connect();

const app = express();
app.use(express.json());

const ip = req => req.headers['x-forwarded-for'] || req.socket.remoteAddress

app.post('/:secret/create', async (req, res) => {
  if (req.params.secret != secret) {
    res.status(403).send('Invalid secret key');
    return;
  }
  adminIPs.add(ip(req))
  const {
    name,
    email
  } = req.body;
  const id = v4().replace(/-/g, '');
  await db.query('INSERT INTO pixels VALUES($1, $2, $3)', [id, name, email]);
  res.status(200).json({
    id,
  });
});

app.get('/image/:id.png', async (req, res) => {
  if (!adminIPs.has(ip(req)))
    await db.query('UPDATE pixels SET data = $1, watched = $2 WHERE id = $3', [{
      IP: ip(req),
      UserAgent: req.headers['user-agent'],
      Language: req.headers['accept-language'],
      OS: req.headers['sec-ch-ua-platform'],
      isMobile: req.headers['sec-ch-ua-mobile']
    }, new Date(), req.params.id]);
  res.sendFile('/src/pixel.png', {
    root: '.',
  });
});

const unwrap = e => ({
  ...e,
  data: JSON.parse(e.data)
})

app.get('/:secret/pixel/:id', async (req, res) => {
  if (req.params.secret != secret) {
    res.status(403).send('Invalid secret key');
    return;
  }
  const data = (await db.query('SELECT * FROM pixels WHERE id = $1', [req.params.id])).rows[0];
  if (data)
    res.status(200).json(unwrap(data));
  else
    res.sendStatus(404);
});

app.get('/:secret/users/', async (req, res) => {
  if (req.params.secret != secret) {
    res.status(403).send('Invalid secret key');
    return;
  }
  let data = (await db.query("SELECT email, data FROM pixels WHERE data <> ''")).rows;
  data = Array.from(new Set(data.map((e) => JSON.stringify(e)))).map(e => (unwrap(JSON.parse(e))));
  res.status(200).json(data);
});

app.get('/:secret/pixels', async (req, res) => {
  if (req.params.secret != secret) {
    res.status(403).send('Invalid secret key');
    return;
  }
  const data = (await db.query("SELECT * from pixels")).rows
  res.status(200).json(data.map(unwrap))
})

app.listen(3000, () => console.log('"Tracking-Pixels" has been started'));