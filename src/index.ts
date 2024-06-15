import { app } from "./setting";
import { runDb } from "./repositories/db";

const port = process.env.PORT || 3000;

const startApp = async () => {
  await runDb();
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
};

startApp();
