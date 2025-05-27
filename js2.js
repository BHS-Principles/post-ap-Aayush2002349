var action = function(event){
    alert(event)
    console.log(event)
}

var list = ["a","b","c","d","e","f","g","h"];

var btn = document.getElementById("button");

for(var i = 0; i < list.length; i++){
    var newBtn = btn.cloneNode(true);
    document.body.append(newBtn);
    newBtn.innerHTML = list[i];

    newBtn.addEventListener("click",action)
}

document.addEventListener("keydown",action2)



var action2 = function(key){
    console.log(square.style)
    if(key.key == "w"){
        y -= 10
    }
    if(key.key == "s"){
        y += 10
    }
    if(key.key == "a"){
        x -= 10
    }
    if(key.key == "d"){
        x += 10
    }

    square.style.left = String(x) + "px"
    square.style.top = String(y) + "px"
}

var square = document.createElement("area")

square.style.backgroundColor = "rgb(198, 243, 247)"
square.style.position = "absolute"
square.style.top = "100px"
square.style.left = "100px"
var x = 100
var y = 100
document.body.append(square)
square.textContent = "abcdefghi"

var inputmap = {
    w:false,
    s:false,
    a:false,
    d:false
}