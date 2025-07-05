const express = require("express");
const session = require("express-session");
const Keycloak = require("keycloak-connect");
const cors = require("cors");

const app = express();
const port = 8000;

app.use(cors());

const memoryStore = new session.MemoryStore();

const keycloakConfig = {
  realm: "reports-realm",
  clientId: "reports-api",
  "bearer-only": true,
  "auth-server-url": process.env.KEYCLOAK_URL || "http://localhost:8080/",
  "ssl-required": "external",
  resource: "reports-api",
  credentials: {
    secret: "oNwoLQdvJAvRcL89SydqCWCe5ry1jMgq",
  },
};

const keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);

app.use(keycloak.middleware());

app.get("/public", (req, res) => {
  res.send("Доступно без авторизации");
});

app.use(keycloak.protect(), (req, res, next) => {
  console.log("kauth: ", req.kauth);
  next();
});

app.get("/reports", (req, res) => {
  // console.log("User:", req.kauth.grant.access_token.content);
  res.json({ message: "reports" });
});

app.use("*", (req, res) => {
  res.send("Not found!");
});

app.listen(port, () => {
  console.log(JSON.stringify(keycloakConfig, null, 2));
  console.log(keycloak);
  console.log(`Listening on port ${port}.`);
});
