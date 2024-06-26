const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const themeToggleBtn = document.getElementById('theme-toggle');
const chatMain = document.querySelector('.chat-main');
const chatSidebar = document.querySelector('.chat-sidebar');
const elementsToChangeColor = chatSidebar.querySelectorAll('h3, h2, ul');
const socket = io()




//get username and room from url

const {username , room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true 
})


//joining room
socket.emit('join-room' , {username, room})

//get room and users 
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
  });

//listen to this event (message from server)
socket.on('message' , message => {
    outputMsg(message)
    //scroll functionality 
    chatMessages.scrollTop = chatMessages.scrollHeight
})
themeToggleBtn.addEventListener('click', () => {
  chatMain.classList.toggle('chat-dark-mode');
  document.body.classList.toggle('dark-mode')
  themeToggleBtn.classList.toggle('light-mode')
  const isDarkMode = chatMain.classList.contains('chat-dark-mode');

  elementsToChangeColor.forEach(element => {
  if (!isDarkMode) {
    element.style.color = 'white'; 
    themeToggleBtn.textContent = 'Dark Mode';
  } else {
    themeToggleBtn.textContent = 'Light Mode';
    element.style.color = '#333'; 
}

});
});


//message submit
chatForm.addEventListener('submit' , (e) => {
    e.preventDefault()
    const msg = e.target.elements.msg.value
    socket.emit('send-msg' , msg)
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()

})


//Main message to DOM 

function outputMsg(msg) {
    const div = document.createElement('div')
    div.classList.add("message")
    div.innerHTML = `
    <p class="meta">${msg.username} <span>${msg.time}</span></p>
    <p class="text">
       ${msg.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div)
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
  }
  
  // Add users to DOM
  function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(users => `<li>${users.username}</li>`).join('')}
    `;
   
  }

  
  

