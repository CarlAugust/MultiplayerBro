const socket = io(`${window.location.host}`);

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let player = {
    id: null,
    x: canvas.width / 2,
    y: canvas.height / 2,
    color: "red"
};

let players = new Map();

let x = canvas.width / 2;
let y = canvas.height / 2;
const radius = 10;

function drawOrb() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let val of players.values())
    {
        console.log("render", val.x, val.y);
        ctx.beginPath();
        ctx.arc(val.x, val.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = val.color;
        ctx.fill();
        ctx.closePath();
    }
}

function moveOrb(event) {
    socket.emit("move", event.key);
    drawOrb();
}

socket.on('update', (data) => {
    players = new Map(JSON.parse(data));
    drawOrb();
});

window.addEventListener('keydown', moveOrb);
drawOrb();

