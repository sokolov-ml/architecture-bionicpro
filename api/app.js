const express = require("express");
const session = require("express-session");
const Keycloak = require("keycloak-connect");
const cors = require("cors");

const app = express();
const port = 8000;

app.use(cors());

const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({ store: memoryStore });

app.use(keycloak.middleware());

app.get("/public", (req, res) => {
  res.send("Доступно без авторизации");
});

app.use(keycloak.protect());

app.get("/reports", (req, res) => {
  res.json({ message: "reports" });
});

app.use("*", (req, res) => {
  res.send("Not found!");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
