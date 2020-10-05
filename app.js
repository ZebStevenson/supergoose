const express = require("express")
const bodyParser= require("body-parser")
const cors = require("cors")
const postRouter = require("./routes/posts_routes")

const port = process.env.port || 3009

const app = express()

// use cors middleware
app.use(cors())
// use bodyparser.json
app.use(bodyParser.json())


// use the post router for all requests on /posts
app.use("/posts",postRouter)

app.listen(port, () => console.log("Blog server running on port " + port))