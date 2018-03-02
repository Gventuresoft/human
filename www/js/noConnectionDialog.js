var dialog = document.createElement("DIV");
var dialogContainer = document.createElement("DIV");
var dialogTitle = document.createElement("DIV");
var dialogBody = document.createElement("DIV");
var dialogOkButton = document.createElement("BUTTON");

dialogTitle.appendChild(document.createTextNode("Aviso de Conexión"));
dialogBody.appendChild(document.createTextNode("Una conexión a Internet es necesaria para continuar."));
dialogOkButton.appendChild(document.createTextNode("OK"));

dialog.style.display = "flex";
dialog.style.justifyContent = "center";

dialogContainer.style.position = "absolute";
dialogContainer.style.zIndex = "9999999";
dialogContainer.style.width = "80%";
dialogContainer.style.textAlign = "center";
dialogContainer.style.color = "white";
dialogContainer.style.backgroundColor = "#212121";
dialogContainer.style.margin = "auto";
dialogContainer.style.padding = "10px";
dialogContainer.style.top = "50%";
dialogContainer.style.left = "50%";
dialogContainer.style.transform = "translate(-50%, -50%)";

dialogBody.style.padding = "10px";

dialogOkButton.onclick = function () {
    dialog.remove();
}

dialogContainer.appendChild(dialogTitle);
dialogContainer.appendChild(dialogBody);
dialogContainer.appendChild(dialogOkButton);
dialog.appendChild(dialogContainer);

if (document.body) {
    document.body.appendChild(dialog);
} else {
    var body = document.createElement("BODY");
    body.appendChild(dialog);
    document.write(body.innerHTML);
}