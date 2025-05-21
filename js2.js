var action = function(event){
    alert(event)
}
var action2 = function(key){
    alert(key.key)
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