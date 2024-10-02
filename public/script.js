function getSearchValue(search,value){
    return(new URLSearchParams(search).get(value))
}
let userID = getSearchValue(window.location.search,"id");
function test(){
    let value = document.getElementById("input").value;
    alert(value);
    fetch("/data",{
        body: JSON.stringify({"userID":userID,"value":value})
    }).then(res=>{alert("a");return(res.json())}).then((data)=>{
        
        document.getElementById("output").innerHTML = data.returnValue;
    }).catch((err)=>{
        alert(err);
    })
}