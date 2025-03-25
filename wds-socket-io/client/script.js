import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js"

const joinRoomButton = document.getElementById("room-button");
const messageInput = document.getElementById("message-input");
const roomInput = document.getElementById("room-input");
const form = document.getElementById("form");

const socket = io("http://localhost:3000")
socket.on('connect', () => {
    displayMessage(`You connected with id: ${socket.id}`)
})

socket.on('receive-message', message => {
    displayMessage(message);
})

// socket.emit('custom-event', 10, 'Hi', {a: 'a'});

form.addEventListener("submit", e => {
    e.preventDefault();
    console.log("Form Submitted.");
    const message = messageInput.value;
    const room = roomInput.value;

    if (message === "") return;
    displayMessage(message);
    socket.emit("send-message", message);

    messageInput.value = "";
})

joinRoomButton.addEventListener("click", () => {
    const room = roomInput.value;
})

function displayMessage(message) {
    const div = document.createElement("div");
    div.textContent = message;
    document.getElementById("message-container").append(div);
}