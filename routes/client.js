const socket = io('http://localhost:8000');
socket.emit('new-user-joined', name)
 // to able to work we need to create chat ejs document for front end and put a form which encloses the 
 //input message and send button 
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container')

//This helps in appending msgs left or right according to user his msgs will be visible on the right ad others msgs on left
const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position)
    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

//now when user sends a message this eventlistener helps to send other users that msg using sockets
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send-message', message);
    messageInput.value = '';
})



//the below has same functionalities as mentioned by the names
socket.on('user-joined', name=>{
    append(`${name} joined the chat`, 'right');
})

socket.on('receive', data=>{
    append(`${data.name }: ${data.message}`, 'left')
})

socket.on('left', name=>{
    append(`${name } left the chat`, 'left');
})