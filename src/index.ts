import express from "express";
import cors from "cors";
import usersRouter from "./routes/userRouter";
import libraryRouter from "./routes/libraryRouter";

// creates an instance of an Express server
const app = express();

// enables Cross Origin Resource Sharing, so API can be used from web-apps on other domains
app.use(cors());

// allow POST and PUT requests to use JSON bodies
app.use(express.json());
app.use("/users", usersRouter);

// port
const port = 3000;

// run server
app.listen(port, () => console.log(`Listnening on port: ${port}`));
