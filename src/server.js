require("dotenv").config();
const app = require("./app");
const connectDatabase = require("./config/db");

const port = Number(process.env.PORT) || 5000;

connectDatabase()
  .then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((error) => {
    console.error("Unable to start server:", error.message);
    process.exit(1);
  });
