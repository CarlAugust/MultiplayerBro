const socket = io("http://localhost:80");

socket.on('message', (data) => {
    console.log(data);
});

document.getElementById("updateButton").addEventListener("click", () =>
{
    socket.emit('message', "Hello everynyan");
})

