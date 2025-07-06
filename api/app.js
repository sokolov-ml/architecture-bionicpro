const express = require("express");
const Keycloak = require("keycloak-connect");
const cors = require("cors");

const app = express();
const port = 8000;

app.use(cors());

const keycloakConfig = {
  realm: "reports-realm",
  clientId: "reports-api",
  "bearer-only": true,
  "auth-server-url": process.env.KEYCLOAK_URL || "http://keycloak:8080/",
  "ssl-required": "external",
  resource: "reports-api",
  credentials: {
    secret: "oNwoLQdvJAvRcL89SydqCWCe5ry1jMgq",
  },
};

const keycloak = new Keycloak({}, keycloakConfig);

app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  console.log(`Headers:`, req.headers);
  next();
});

app.use(keycloak.middleware());

app.use((req, res, next) => {
  console.log(`[BEFORE protect()] ${req.method} ${req.url}`);
  next();
});

app.use(keycloak.protect());

app.use((req, res, next) => {
  console.log(`[AFTER protect()] ${req.method} ${req.url}`);
  console.log("Request headers:", req.headers);
  console.log("Keycloak config:", keycloakConfig);
  console.log("kauth:", req.kauth);
  if (req.kauth && req.kauth.grant) {
    console.log("Token content:", req.kauth.grant.access_token.content);
  }
  next();
});

app.get("/reports", (req, res) => {
  console.log(`Serving /reports`);
  res.json({ message: "reports" });
});

app.use("*", (req, res) => {
  res.send("Not found!");
});

app.listen(port, async () => {
  // const response = await fetch(keycloakConfig["auth-server-url"]);
  // console.log(response);

  console.log(process.env);

  console.log(JSON.stringify(keycloakConfig, null, 2));
  console.log(keycloak);
  console.log(`Listening on port ${port}.`);
});
