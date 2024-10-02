const express = require('express')
var path = require('path');
const fs = require('fs');
function readFile(filePath) {
    try {
      const data = fs.readFileSync(filePath);
      return data.toString();
    } catch (error) {
      console.error(`Got an error trying to read the file: ${error.message}`);
    }
}
const app = express();
app.get("/data",(req,res)=>{
    console.log("fdsafas")
    console.log(`ID:${req.body.userID}`);
    res.json({"returnValue":"test"});
})

const bodyParser = require('body-parser');
//I don't know what this is for; I got it from the internet
app.use(bodyParser.urlencoded({ extended: true }));
const port = 4000;
app.use(express.static(path.join(__dirname, 'public')));
app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})