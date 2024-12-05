const express = require("express");
const app = express();
const dotenv = require("dotenv");
const helmet = require("helmet");
const {rateLimit} = require("express-rate-limit")
dotenv.config();

const taskRoute = require("./routes/task.route");
const userRoute = require("./routes/user.route");
const adminRoute = require("./routes/admin.route");

//Security
app.use(helmet());
const limiter = rateLimit({
	windowMs: 10 * 60 * 1000,
	limit: 30,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
	message: "Too many requests, please try again after a while."
});
app.use(limiter);


app.use(express.json());
app.use(express.urlencoded({extended: true}))

//Routes
app.use("/api", userRoute);
app.use("/api/tasks", taskRoute);
app.use("/api/admin", adminRoute);


const port = process.env.PORT || 3000;

app.listen(port, () =>{
	console.log(`Server running on port ${port}`)
})
