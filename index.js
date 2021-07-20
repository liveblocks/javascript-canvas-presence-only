const express = require("express");
const { authorize } = require("@liveblocks/node");
const { nanoid } = require("nanoid");

const app = express();
const port = 3000;

app.use(express.static("static"));
app.use(express.json());

// Authentication endpoint
app.post("/auth", (req, res) => {
  authorize({
    room: req.body.room,
    secret: process.env.LIVEBLOCKS_SECRET_KEY,
  })
    .then((authResponse) => {
      res.send(authResponse.body);
    })
    .catch((er) => {
      console.error(er);
    });
});

// In a realistic application, the items are not stored in a database like MongoDB or Postgres
const items = new Map();

function insertItem({ x, y }) {
  const id = nanoid();
  items.set(id, { id, x, y });
}

insertItem({ x: 100, y: 100 });
insertItem({ x: 300, y: 130 });
insertItem({ x: 200, y: 240 });
insertItem({ x: 120, y: 450 });
insertItem({ x: 280, y: 410 });

// Return all items
app.get("/items", (req, res) => {
  return res.send({
    items: Array.from(items.values()),
  });
});

// Update an item by id
app.put("/items/:id", (req, res) => {
  items.set(req.params.id, req.body);
  return res.status(200).end();
});

// Get an item by id
app.get("/items/:id", (req, res) => {
  return res.send(items.get(req.params.id));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
