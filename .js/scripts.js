let canvas = null,
      toolBtns = null,
      ctx = null;
      
// Variaveis globais com valores padroes
let prevMouseX, prevMouseY, snapshot,
    isDrawing = false,
    selectedTool = "brush",
    brushWidth = 5,
    selectedColor = "#000";

const setCanvasBackground = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0,0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;
}

window.addEventListener('load', () => {
    mapElements();
    setOffSets();
    addEvents();
    setCanvasBackground();
});

function mapElements(){
    canvas = document.querySelector("#canvas"); 
    ctx = canvas.getContext('2d');
    toolBtns = document.querySelectorAll(".tool");
    fillColor = document.querySelector("#fill-color");
    sizeSlider = document.querySelector("#size-slider");
    colorBtns = document.querySelectorAll(".colors .option");
    colorPicker = document.querySelector("#color-picker");
    clearCanvas = document.querySelector(".clear-canvas");
    saveImg = document.querySelector(".save-img");
    
}

function setOffSets(){
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

function addEvents(){
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", drawing);
    canvas.addEventListener("mouseup", () => isDrawing = false);
    sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value);
    saveImg.addEventListener("click", () => {
        const link = document.createElement("a");
        link.download = `${Date.now()}.jpg`;
        link.href = canvas.toDataURL();
        link.click();
    });
    clearCanvas.addEventListener("click", () => {
        ctx.clearRect(0,0, canvas.width, canvas.height);
        setCanvasBackground();
    });
    
    
    colorPicker.addEventListener("change", () => {
        colorPicker.parentElement.style.background = colorPicker.value;
        colorPicker.parentElement.click();
    })

    toolBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            // remove marca destaque apenas no obj selecionado
            document.querySelector(".options .active").classList.remove("active");
            btn.classList.add("active");
            selectedTool = btn.id;
        })
    })

    colorBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            // remove marca destaque apenas no obj selecionado
            document.querySelector(".options .selected").classList.remove("selected");
            btn.classList.add("selected");
            selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
        });
    })
}

const drawRect = (e) => {
    if(!fillColor.checked){
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}
const drawCircle = (e) => {
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.sqrt(Math.pow((prevMouseY - e.offsetY), 2)));
    if(!fillColor.checked){
        ctx.beginPath();
        ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
        ctx.stroke();
        return 
    }
    ctx.beginPath();
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    ctx.fill();
}

const drawLine = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
}
const drawTrig = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();
    ctx.stroke();
    fillColor.checked ? ctx.fill() : ctx.stroke(); //Se o Fill tiver marcado preenche
}

const startDrawing = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX; //passa posição atual do mouse eixo X
    prevMouseY = e.offsetY; //passa posição atual do mouse eixo Y
    ctx.beginPath(); //Cria nova inicio de desenho
    ctx.lineWidth = brushWidth; //passa o tamanho atual do brush
    ctx.strokeStyle = selectedColor; //passa cor atual
    ctx.fillStyle = selectedColor; //passa a cor atual do preenchimento
    // copia data canvas e passa como snapshot
    snapshot = ctx.getImageData(0,0, canvas.width, canvas.height);
}

const drawing = (e) => {
    if(!isDrawing ){
        return;
    }

    ctx.putImageData(snapshot, 0, 0); //Adiciona a copia do data canvas para esse

    if(selectedTool === "brush"){
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }
    else if(selectedTool === "line"){
        drawLine(e);
    }
    else if(selectedTool === "rectangle"){
        drawRect(e);
    }
    else if(selectedTool === "circle"){
        drawCircle(e);
    }
    else if(selectedTool === "triangle"){
        drawTrig(e);
    }
    else if(selectedTool === "eraser"){
        ctx.strokeStyle = "#fff";
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }
}

