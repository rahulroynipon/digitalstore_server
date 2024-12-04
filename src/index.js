const dotenv = await import("dotenv");
dotenv.config({ path: "./.env" });

import { connectDB } from "./DB/index.js";
import { app } from "./app.js";

connectDB()
    .then(() => {
        const port = process.env.PORT || 3000;

        app.on("error", () => {
            console.log("Connection failed");
        });

        app.listen(port, () => {
            console.log("The portal hosted at port:", port);
        });

        app.get("/", (req, res) => {
            return res.send("<h1>This is the API for the Digital Store</h1>");
        });
    })
    .catch((error) => {
        console.log("MONGODB connection is failed", error);
    });
