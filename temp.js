for(let y=0;y<currentPiece.grid.length;y++) {
    
    // let tempArray = [];
    for(let x=0;x<currentPiece.grid[y].length;x++){
        // alert(x);
        // tempArray.push("a");
        if(currentPiece.grid[y][x]!==0){
            // alert(`X:${y+currentPiece.y} Y:${+currentPiece.x}`)
            currentBoard[y+currentPiece.y][x+currentPiece.x]=currentPiece.id;
        }

    }
    // currentBoard.push(tempArray);   
}