let errors = [];
let gameInterval;
function run(){
try{
if(gameInterval){
    clearInterval(gameInterval);
}
function getSearchValue(search,value){
    return(new URLSearchParams(search).get(value))
}
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const canvasHeight = canvas.height;
const canvasWidth = canvas.width;
const cellWidth = 25;
const gravity = 0;
let diffGravityModifier = 0;
let gravityModifier = 0;
let newKeyList = [];
let keyList = [];
let repeatingKeyList = [];
let pieceBag = [];
let score = 0;
let difficulty = 0;
let difficulties = [24,21.5,19,16.5,14,11.5,9,6.5,4,3,2.5,2.5,2.5,2,2,2,1.5,1.5,1.5,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
let totalLinesCleared = 0;
let pieceWasHeld = false;
let promptValue = "";
document.getElementById("holdingPiece").setAttribute("data-piece","none");
const tetrominoes = {
    i:{
        grid:[
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0]],
        color:"rgb(0, 240, 240)",
        size:4,
        id:"i"
    },
    l:{
        grid:[
        [0,1,0],
        [0,1,0],
        [0,1,1]],
        color:"rgb(221, 164, 34)",
        size:3,
        id:"l"
    },
    j:{
        grid:[
        [0,1,0],
        [0,1,0],
        [1,1,0]],
        color:"rgb(0, 0, 240)",
        size:3,
        id:"j"
    },
    o:{
        grid:[
        [1,1],
        [1,1]],
        color:"rgb(241, 239, 47)",
        size:2,
        id:"o"
    },
    s:{
        grid:[
        [0,0,0],
        [0,1,1],
        [1,1,0]
        ],
        color:"rgb(138, 234, 40)",
        size:3,
        id:"s"
    },
    t:{
        grid:[
        [0,1,0],
        [1,1,1],
        [0,0,0]
        ],
        color:"rgb(136, 44, 237)",
        size:3,
        id:"t"
    },
    z:{
        grid:[
        [0,0,0],
        [1,1,0],
        [0,1,1]
        ],
        color:"rgb(207, 54, 22)",
        size:3,
        id:"z"
    }

}
let currentPiece = {
    grid:[],
    color:"",
    x:0,
    y:0,
    id:"",
    rotation:0,
    progress:0,
    timeAlive:0,
    placed:false
}
let heldPiece = "none"
let currentBoard = [];
// alert(canvasHeight/cellWidth);
for(let y=0;y<canvasHeight/cellWidth;y++){
    
    let tempArray = [];
    for(let x=0;x<canvasWidth/cellWidth;x++){
        // alert(y);
        // alert(canvasHeight/cellWidth)
        tempArray.push("a");
        
    }
    // alert(tempArray)
    currentBoard[y] = tempArray;
       
}

// alert(currentBoard.length);
function spawnPiece(piece){
    currentPiece.grid = piece.grid;
    currentPiece.color = piece.color;
    currentPiece.y = 0;
    currentPiece.x = 5-Math.floor(piece.size/2);
    currentPiece.id = piece.id; 
    currentPiece.rotation = 0;
  

}
function placeCurrentPiece(){
    for(let y=0;y<currentPiece.grid.length;y++) {
    
        // let tempArray = [];
        for(let x=0;x<currentPiece.grid[y].length;x++){
            // alert(x);
            // tempArray.push("a");
            if(currentPiece.grid[y][x]==1){
                // alert(`X:${y+currentPiece.y} Y:${+currentPiece.x}`)
                currentBoard[y+currentPiece.y][x+currentPiece.x]=currentPiece.id;
            }
    
        }
        // currentBoard.push(tempArray);   
    }
    currentPiece = {
        grid:[],
        color:"",
        x:0,
        y:0,
        id:"",
        rotation:0,
        progress:0,
        timeAlive:0,
        placed:false
    }
}
function rotateClockwise(array){
    let matrix = array;
    matrix = matrix[0].map((val, index) => matrix.map(row => row[index]).reverse())
    return(matrix);
}
function rotateCounterclockwise(array){
    let matrix = array;
    matrix = matrix[0].map((val, index) => matrix.map(row => row[row.length-1-index]));
    return(matrix);
}
function rotateCurrentPiece(rotations){
        
        if(rotations>0){
            for(let i = 0;i<rotations;i++){
                currentPiece.grid = rotateClockwise(currentPiece.grid);
            }
        }else if(rotations<0){
            for( let i = 0;i<Math.abs(rotations);i++){
                currentPiece.grid = rotateCounterclockwise(currentPiece.grid);
            }
        }
    
}
function holdPiece(){
    pieceWasHeld = true;
    if(heldPiece == "none"){
        heldPiece = currentPiece.id;
        document.getElementById("holdingPiece").setAttribute("data-piece",heldPiece);
        nextPiece();
    }else{
        let oldHeldPiece = "";
        eval(`oldHeldPiece = tetrominoes.${heldPiece}`);
        
        heldPiece = currentPiece.id;
        document.getElementById("holdingPiece").setAttribute("data-piece",heldPiece);
        spawnPiece(oldHeldPiece);
    }

}
/**
 * 
 * @param {Array} offset 
 * @param {*} grid 
 * @returns 
 */
function checkCollisions(offset,grid){
    let placed = false;
    for(let y = grid.length-1;y>=0;y--){
        // alert(i);
        for(let x = 0; x<grid[y].length;x++){
            
            if(grid[y][x]==1){
                    let lowerValue = currentBoard[currentPiece.y+y+offset[1]][currentPiece.x+x+offset[0]]
                    if(lowerValue!=="a"){
                    
                    placed = true;
                
                    break;
                }
            }
        }
    }
    return(placed);
}
// checkCollisions()
/**
 * Shuffles an array
 * @param {Array} arr - The array to shuffle 
 * @returns {Array}
 */
function shuffle(arr) {
    let array = arr;
    var m = array.length, t, i;
    while (m) {
      i = Math.floor(Math.random() * m--);
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    return(array);
}
function nextPiece(){
    pieceWasHeld = false;
    if(pieceBag.length==0){
        let theNextPiece = pieceBag[0];
        // alert(theNextPiece)
        pieceBag = [tetrominoes.i,tetrominoes.l,tetrominoes.j,tetrominoes.o,tetrominoes.s,tetrominoes.t,tetrominoes.z];
        // pieceBag.splice(pieceBag.indexOf(theNextPiece),1);
        pieceBag = shuffle(pieceBag);
    }else if(pieceBag.length<=2){
        
        let theNextPiece = pieceBag[0];
        // alert(theNextPiece)
        pieceBag = [tetrominoes.i,tetrominoes.l,tetrominoes.j,tetrominoes.o,tetrominoes.s,tetrominoes.t,tetrominoes.z];
        // pieceBag.splice(pieceBag.indexOf(theNextPiece),1);
        pieceBag = shuffle(pieceBag);
        // try {
        pieceBag.unshift(theNextPiece);
        // } catch (err) {
        //     alert(err.stack)
        // }
        // alert(pieceBag.unshift("a"));
        
        // pieceBag.unshift(theNextPiece);
        // pieceBag.unshift()
        // alert(shuffle(["a","b","c"]))
    }
    spawnPiece(pieceBag[0]);
    pieceBag.splice(0,1);
}
function drawOtherPlayers(ids){
    for(let i = 0; i<ids.length; i++){
        let text = document.getElementById(ids[i]).childNodes[0];
        let opCanvas = document.getElementById(ids[i]).childNodes[1];

    }
}
function drawPieceDisplays(){
    let displays = document.getElementsByClassName("pieceDisplay");
    for(let element of displays){
        
        let ctxA = element.getContext("2d");
        let displayHeight = element.height;
        let displayWidth = element.width;
        ctxA.strokeStyle = "rgb(194, 194, 194)";
        ctxA.clearRect(0,0,displayWidth,displayHeight);
        if(element.getAttribute("data-piece")!=="none"){
            let displayPiece = element.getAttribute("data-piece");
            displayPiece = eval(`displayPiece = tetrominoes.${displayPiece}`);
            let displayPieceGrid = [];
            eval(`displayPieceGrid = tetrominoes.${displayPiece.id}.grid`);
            
            let yOffset = 0;
            if(displayPiece.size>=4){
                yOffset = 0
            }else{
                yOffset = 1
            }
            for(let y=0;y<displayPieceGrid.length;y++){
                for(let x=0;x<displayPieceGrid[y].length;x++){
                    if(displayPieceGrid[y][x]==1){
                        ctxA.fillStyle = displayPiece.color;
                        ctxA.fillRect((x+1)*cellWidth,(y+yOffset)*cellWidth,cellWidth,cellWidth);
                    }
                }
            }
        }
        for(let i=0;i<=displayHeight/cellWidth;i++){
 
            ctxA.beginPath();
            ctxA.moveTo(0,i*cellWidth);
            ctxA.lineTo(displayWidth,i*cellWidth);
            ctxA.stroke()
                
            
        }
        for(let i=0;i<=displayWidth/cellWidth;i++){
     
            ctxA.beginPath();
            ctxA.moveTo(i*cellWidth,0);
            ctxA.lineTo(i*cellWidth,canvasHeight);
            ctxA.stroke()
                
            
        }
    }
}
let userID = 0;
function tick(){
    // userID = getSearchValue(window.location.search,"id");
    // let value = document.getElementById("input").value;
    // alert(JSON.stringify({userID:userID,value:value}));
    fetch("/data",{
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userID:userID,boardState:currentBoard,currentPiece:currentPiece,score:score,totalLinesCleared:totalLinesCleared})
    }).then(res=>{return(res.json())}).then((data)=>{
        if(data.newID){
            localStorage.userID = data.newID;
            userID = localStorage.userID;
        }else if(data.dataList){
            document.getElementById("data").innerHTML = (data.dataList);
        }
        
    }).catch((err)=>{
        errors.push(`Server fetch error: ${err.stack}`);
        // alert(err);
    })
}

function localTick(){
    try{
    let timeAlive = 0;
    ctx.clearRect(0,0,canvasWidth,canvasHeight);
    let currentKeyList = keyList;
    let currentNewKeyList = newKeyList;
    newKeyList = [];
    if(currentNewKeyList.includes("KeyC")){
        // alert("E Pressed")\
        if(!checkCollisions([0,0],rotateClockwise(currentPiece.grid))){
            rotateCurrentPiece(1);
        }
    }else if(currentNewKeyList.includes("KeyV")){
        if(!checkCollisions([0,0],rotateCounterclockwise(currentPiece.grid))){
            rotateCurrentPiece(-1);
        }
    }
    if(currentNewKeyList.includes("ArrowRight")){
        if(!checkCollisions([1,0],currentPiece.grid)){
            currentPiece.x++
        }
    }else if(currentNewKeyList.includes("ArrowLeft")){
        if(!checkCollisions([-1,0],currentPiece.grid)){
            currentPiece.x--
        }
    }
    if(currentKeyList.includes("ArrowDown")){
        gravityModifier = 1-(gravity+diffGravityModifier);
    }else if(currentNewKeyList.includes("ArrowUp")){
        gravityModifier = 100;
    }else{
        gravityModifier = 0;
    }
    if(currentNewKeyList.includes("KeyX")){
        if(pieceWasHeld==false){
            holdPiece();
        }
    }
    currentPiece.progress+= gravity + diffGravityModifier + gravityModifier;
    let placed = false;
    if(currentPiece.progress>=1){
        for(let ia = 0; ia<Math.floor(currentPiece.progress);ia++){
        // alert(currentPiece.si)

        for(let i = currentPiece.grid.length-1;i>=0;i--){
            // alert(i);
            if(currentPiece.grid[i].includes(1)){
                // alert("a");
                if(currentPiece.y+i+1>=currentBoard.length){
                    // alert("b");
                    timeAlive = currentPiece.timeAlive;
                    placeCurrentPiece();
                    placed = true;
                    
                    nextPiece();
                    break;
                }
                
            }
        }
        for(let y = currentPiece.grid.length-1;y>=0;y--){
            // alert(i);
            for(let x = 0; x<currentPiece.grid[y].length;x++){
                
                if(currentPiece.grid[y][x]==1){
                        let lowerValue = currentBoard[currentPiece.y+y+1][currentPiece.x+x]
                        if(lowerValue!=="a"&&currentPiece.placed==false){
                        currentPiece.placed = true;
                        timeAlive = currentPiece.timeAlive;
                        placeCurrentPiece();
                        placed = true;
                        nextPiece();
                        break;
                    }
                }
            }
        }
        
        if(placed == false){
            currentPiece.y++;
            currentPiece.progress--;
        }else if(placed==true){
            if(timeAlive == 0){
                clearInterval(gameInterval);
                alert("Game Over");
            }
        }
        }
        
    }
    let fillerArray = [];
    for(let i = 0; i<canvasWidth/cellWidth;i++){
        fillerArray.push("a");
    }
    let linesCleared = 0;
    for(let i = 0; i<currentBoard.length;i++){
        if(!currentBoard[i].includes("a")){
            currentBoard.splice(i,1);
            currentBoard.unshift(fillerArray);
            linesCleared++;
        }
    }
    totalLinesCleared= totalLinesCleared+linesCleared;
    switch(linesCleared){
        case(0):
            break
        case(1):
            score = score + 100;
            break;
        case(2):
            score = score + 300;
            break;
        case(3):
            score = score + 500;
            break;
        case(4):
            score = score + 800;
            break;
        default:
            alert(linesCleared);
            alert("Error: Invalid number of lines cleared");
            alert("Impressive, but you're not supposed to do that");
    }
    // currentPiece.y = Math.floor(currentPiece.progress);
    // currentPiece.y = document.getElementById("input").value;

    document.getElementById("output").innerHTML = `Score: ${score} <br> Level: ${difficulty} <br> Next Piece: ${pieceBag[0].id}`;
    document.getElementById("errors").innerHTML = errors.toString().replaceAll(",","<br>");
    document.getElementById("nextPiece").setAttribute("data-piece",pieceBag[0].id);
    difficulty = Math.floor(totalLinesCleared/10);
    if(difficulties.length-difficulty<=4){
        difficulties.push(1);
    }
    diffGravityModifier = 1/difficulties[difficulty]
    currentPiece.timeAlive++
    //Drawing
    for(let y=0;y<currentBoard.length;y++){
        for(let x=0;x<currentBoard[y].length;x++){
            if(currentBoard[y][x]!=="a"){
                switch(currentBoard[y][x]){
                    case("i"):
                        ctx.fillStyle = tetrominoes.i.color;
                        break;
                    case("l"):
                        ctx.fillStyle = tetrominoes.l.color;
                        break;
                    case("j"):
                        ctx.fillStyle = tetrominoes.j.color;
                        break;
                    case("o"):
                        ctx.fillStyle = tetrominoes.o.color;
                        break;
                    case("s"):
                        ctx.fillStyle = tetrominoes.s.color;
                        break;
                    case("t"):
                        ctx.fillStyle = tetrominoes.t.color;
                        break;
                    case("z"):
                        ctx.fillStyle = tetrominoes.z.color;
                        break;
                    default:
                        alert("Error: Invalid Piece")
                    
                } 
                ctx.fillRect(x*cellWidth,y*cellWidth,cellWidth,cellWidth);
            }else if((y-currentPiece.y>=0&&x-currentPiece.x>=0)&&(y-currentPiece.y<currentPiece.grid.length)){
                // alert(`X:${y-currentPiece.y} Y:${x-currentPiece.x}`)
                if(currentPiece.grid[y-currentPiece.y][x-currentPiece.x]){
                    ctx.fillStyle = currentPiece.color;
                    ctx.fillRect(x*cellWidth,y*cellWidth,cellWidth,cellWidth);
                }


                
            }
            ctx.fillStyle = "rgb(0,0,0)";
            ctx.fillText(currentBoard[y][x],(x*cellWidth)+10,(y*cellWidth)+10);
            
            
        }
    }
    
    ctx.strokeStyle = "rgb(194, 194, 194)";
    for(let i=0;i<=canvasHeight/cellWidth;i++){
 
        ctx.beginPath();
        ctx.moveTo(0,i*cellWidth);
        ctx.lineTo(canvasWidth,i*cellWidth);
        ctx.stroke()
            
        
    }
    for(let i=0;i<=canvasWidth/cellWidth;i++){
 
        ctx.beginPath();
        ctx.moveTo(i*cellWidth,0);
        ctx.lineTo(i*cellWidth,canvasHeight);
        ctx.stroke()
            
        
    }
    drawPieceDisplays();
    if(promptValue!==""){
        eval(promptValue);
        promptValue = "";
    }
    ctx.strokeStyle = "rgb(0,0,0)";
    ctx.strokeRect(currentPiece.x*cellWidth,currentPiece.y*cellWidth,currentPiece.grid.length*cellWidth,currentPiece.grid.length*cellWidth);
    }catch(err){
        errors.push(`LocalTick error: ${err.stack}`)
        // alert(err.stack)
        // gravityModifier = 0;
        // console.error(error.stack);
    }

}
// setInterval(tick,30);
document.addEventListener("keydown",(evt)=>{

    // alert("as")
    let repeating = false;
    if(keyList.indexOf(evt.code) == -1){
        keyList.push(evt.code);
        newKeyList.push(evt.code);
    }else{
        repeating = true;
    }
    if(repeatingKeyList.findIndex((obj)=>{return(obj[0]==evt.code)})==-1){
        repeatingKeyList.push([evt.code,repeating]);
    }
    if(repeatingKeyList.findIndex((obj)=>{return(obj[0]==evt.code)})!==-1&&repeatingKeyList.findIndex((obj)=>{return(obj==[evt.code,repeating])})==-1){
        repeatingKeyList[repeatingKeyList.findIndex((obj)=>{return(obj[0]==evt.code)})][1] = repeating;
    }
    if(evt.code == "KeyP"){
        promptValue = prompt("Run Command:");
    }
    // alert("a")
})
document.addEventListener("keyup",(evt)=>{
    keyList.splice(keyList.indexOf(evt.code),1);
    repeatingKeyList.splice(repeatingKeyList.findIndex((obj)=>{return(obj[0]==evt.code)}),1)
})
window.addEventListener("keydown",(evt)=>{
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(evt.code) > -1) {
        evt.preventDefault();
    }
})
nextPiece();
// rotateCurrentPiece(2);
// alert(JSON.stringify(currentPiece.grid));
// alert(JSON.stringify(rotateClockwise(currentPiece.grid)));
// currentPiece.grid = rotateCounterclockwise(currentPiece.grid);
// let rotations = getSearchValue(window.location.search,"rot");
// rotations = Number(rotations);
// if(rotations>0){
//     for(let i = 0;i<rotations;i++){
//         currentPiece.grid = rotateClockwise(currentPiece.grid);
//     }
// }else if(rotations<0){
//     for( let i = 0;i<Math.abs(rotations);i++){
//         currentPiece.grid = rotateCounterclockwise(currentPiece.grid);
//     }
// }
gameInterval = setInterval(localTick,100/3);
// let serverInterval = setInterval(tick,100/3);

}catch(err){
    errors.push(`Error: ${err.stack}`)
    // alert(JSON.stringify(currentPiece));
    alert(err.stack)

}
}