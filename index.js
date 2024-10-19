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


const bodyParser = require('body-parser');
//I don't know what this is for; I got it from the internet
app.use(bodyParser.json({ extended: true }));
const port = 4000;
app.use(express.static(path.join(__dirname, 'public')));
let dataList = [];
let idList = [0];
let currentID = 1;
app.post("/data",(req,res)=>{
  // console.log(req.body);
  // console.log(dataList.findIndex((obj)=>{obj.userID==req.body.userID}));
  if(req.body.userID==0){
    currentID = Math.max.apply(0, idList)+1;
    idList.push(currentID);
    res.json({newID:currentID});

  }else{
    if(dataList.find((obj)=>{return(obj.userID==req.body.userID)})){
      dataList[dataList.findIndex((obj)=>{return(obj.userID==req.body.userID)})].value = req.body.value;
    }else{
      dataList.push({userID:req.body.userID,value:req.body.value});
    }
    res.json({"dataList":JSON.stringify(dataList)});
  }
})
app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})