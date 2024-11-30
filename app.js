const express = require("express");
const path = require("path");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const taskRoute = require("./routes/task.route");
const authRoute = require("./routes/auth.route");
const authenticateUser = require("./middleware/auth.middleware");

app.use(express.json());
// app.use(express.static(path.join(__dirname, "public")));
app.use("/api", authRoute);
app.use("/api/tasks", taskRoute);
// app.use("/api/admin", adminRoute);
// app.use("/api/tasks", taskRoute);


const port = process.env.PORT || 3000;

app.listen(port, () =>{
	console.log(`Server running on port ${port}`)
})
