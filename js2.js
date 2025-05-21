var list = ["a","b","c","d","e","f","g","h"];

var btn = document.getElementById("button");
for(var i = 0; i < list.length; i++){
    var newBtn = btn.cloneNode(true);
    newBtn.innerHTML = list[i];
    document.body.append(newBtn);

    newBtn.addEventListener("click",action)

}
var action = function(event){
    alert(event)
}