const socket = io("http://localhost:80");

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

socket.on('id', (data) => {
    player.id = data;
});

socket.emit("idpls", "plsid");

const player = {
    id: null,
    x: canvas.width / 2,
    y: canvas.height / 2
};

const playerArray = [player];

let x = canvas.width / 2;
let y = canvas.height / 2;
const radius = 10;
const speed = 10;

function drawOrb() {
    for (let val of playerArray)
    {
        console.log("Render", val.id);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.arc(val.x, val.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
    }
}

function sendData()
{
    socket.emit('action', player);
};

function moveOrb(event) {
    switch (event.key) {
        case 'ArrowUp':
            player.y -= speed;
            break;
        case 'ArrowDown':
            player.y += speed;
            break;
        case 'ArrowLeft':
            player.x -= speed;
            break;
        case 'ArrowRight':
            player.x += speed;
            break;
    }
    drawOrb();
    sendData();
}

socket.on('update', (data) => {
    let newPlayer = true;
    for (let val in playerArray)
    {
        if (playerArray[val].id == data.id)
        {
            newPlayer = false;
            playerArray[val].x = data.x;
            playerArray[val].y = data.y;
            break;
        }
    }

    if (newPlayer)
    {
        playerArray.push(data);
    }
});

window.addEventListener('keydown', moveOrb);
drawOrb();

