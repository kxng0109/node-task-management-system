const express = require("express");
const path = require("path");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

//Routes
const taskRoute = require("./routes/task.route");
const userRoute = require("./routes/user.route");
const adminRoute = require("./routes/admin.route");

//Middlewares
const authenticateUser = require("./middleware/auth.middleware");

app.use(express.json());
// app.use(express.static(path.join(__dirname, "public")));
app.use("/api", userRoute);
app.use("/api/tasks", taskRoute);
app.use("/api/admin", adminRoute);


const port = process.env.PORT || 3000;

app.listen(port, () =>{
	console.log(`Server running on port ${port}`)
})
