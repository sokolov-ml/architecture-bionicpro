import express from "express";
import Keycloak from "keycloak-connect";
import cors from "cors";

const app = express();
const port = 8000;

app.use(cors()); // <--- CORS middleware

const keycloak = new Keycloak({});

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
