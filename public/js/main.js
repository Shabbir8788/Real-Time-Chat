const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// Get Username & Room for URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join Chatroom
socket.emit("joinRoom", { username, room });

// Get Room & Users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from Server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  //   scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message Submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //   Get Message Text
  const msg = e.target.elements.msg.value;

  //   Emit Message to Server
  socket.emit("chatMessage", msg);

  //   clear input
  e.target.elements.msg.value = " ";
  e.target.elements.msg.focus();
});

// Output message to DOM
const outputMessage = (message) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
            <p class="meta">${message.username} <span>${message.time}</span></p>
            <p class="text">
               ${message.text}
            </p>
  `;

  document.querySelector(".chat-messages").appendChild(div);
};

// Add Room Name to DOM
const outputRoomName = (room) => {
  roomName.innerText = room;
};

// Add Users to DOM
const outputUsers = (users) => {
  userList.innerHTML = `
      ${users.map((user) => `<li>${user.username}</li>`).join("")}
    `;
};
