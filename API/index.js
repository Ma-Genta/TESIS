const express = require("express");
const app = express();

const helmet = require("helmet");
const morgan = require("morgan");

//Variables de entorno
const dotenv = require("dotenv");
dotenv.config();
const { PORT } = process.env;

//Configuraciones
app.use(express.json());
app.use(morgan("tiny"));
app.use(helmet());

//Rutas
const postApi = require("./routes/post");
const authApi = require("./routes/user");

postApi(app);
authApi(app);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
