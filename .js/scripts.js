const canvas = document.querySelector('canvas'), 
ctx = canvas.getContext('2d');

let isDrawing = false;

window.addEventListener('load', () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
});

const startDrawing = () => {
    isDrawing = true;
    ctx.beginPath(); //Cria nova inicio de desenho
}

const drawing = (e) => {
    if(!isDrawing ){
        return;
    }
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
}

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);