var action = function(event){
    alert(event)
    console.log(event)
}
var action2 = function(key){
    console.log(square.style)
    var x = Number(square.style.top.substring(0,square.style.top - 2))
    var y = Number(square.style.left.substring(0,square.style.left - 2))
    if(key.key == "w"){
        y -= 1
    }
    if(key.key == "s"){
        y += 1
    }
    if(key.key == "a"){
        x -= 1
    }
    if(key.key == "d"){
        x += 1
    }

    square.style.left = String(x) + "px"
    square.style.top = String(y) + "px"
}

var list = ["a","b","c","d","e","f","g","h"];

var btn = document.getElementById("button");
var square = document.createElement("area")

square.style.backgroundColor = "rgb(198, 243, 247)"
square.style.position = "absolute"
square.style.top = "100px"
square.style.left = "100px"
document.body.append(square)
square.textContent = "abcdefghi"

for(var i = 0; i < list.length; i++){
    var newBtn = btn.cloneNode(true);
    document.body.append(newBtn);
    newBtn.innerHTML = list[i];

    newBtn.addEventListener("click",action)
}

document.addEventListener("keydown",action2)