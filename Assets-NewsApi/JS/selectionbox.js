 
var expanded = false;

function showCheckboxes() {
  var checkboxes = document.getElementById("checkboxes");
  if (!expanded) {
    checkboxes.style.display = "block";
    expanded = true;
  } else {
    checkboxes.style.display = "none";
    expanded = false;
  }
}



let boxes = document.getElementsByClassName('cb-query').length;

function save() {	
  for(let i = 1; i <= boxes; i++){
	  var checkbox = document.getElementById(String(i));
    localStorage.setItem("query" + String(i), checkbox.checked);	
  }
}

//for loading
for(let i = 1; i <= boxes; i++){
  if(localStorage.length > 0){
    var checked = JSON.parse(localStorage.getItem("query" + String(i)));
    document.getElementById(String(i)).checked = checked;
  }
}
window.addEventListener('change', save);



$(function () {
    var data = localStorage.getItem("query");

    if (data !== null) {
        $("input[name='query']").attr("checked", "checked");
        
    }


});


const inputs = document.getElementsByClassName("input");
console.log(`First label for first element is: $inputs[0].labels[0].innerText`)