const name = localStorage.getItem('username');
const userList = document.querySelector('.list-group');
const newUser = document.createElement('li');
newUser.innerHTML = `${name}`;
newUser.classList.add('contact-names');
userList.appendChild(newUser);

const form = document.querySelector('#form');
form.addEventListener('submit', sendMessage);

async function sendMessage(e) {
    e.preventDefault();
    const message = document.getElementById('message').value;
    const messageDetails = {
        message: message
    };
    document.getElementById('message').value = "";
    console.log(messageDetails);
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:3000/message/sendmessage', messageDetails,
            {
                headers: { "Authorization": token }
            }
        );
        if (response.data.success) {
            const message = response.data.message;
            showMessage(message);
        }
    }
    catch (err) {
        console.log(err);
    }
}

window.addEventListener('DOMContentLoaded', getChats);

async function getChats() {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get("http://localhost:3000/message/getmessages", { headers: { "Authorization": token } });
        const message = response.data.messages;
        for (let i = 0; i < message.length; i++) {
            showMessage(message[i]);
        }
    }
    catch (err) {
        console.log(err);
    }
}

async function showMessage(message) {

    const username = localStorage.getItem('username');
    const chat = document.querySelector('.chat');
    const newDiv = document.createElement('div');
    const messageDiv = document.createElement('div');
    const nameDiv = document.createElement('div');
    messageDiv.innerHTML = message.message;
    nameDiv.innerHTML = message.name;

    if (username === message.name) {
        newDiv.classList.add('receiver');
        messageDiv.classList.add('message-receiver');
    }
    else {
        newDiv.classList.add('sender');   
        nameDiv.classList.add('sender-name');  
        messageDiv.classList.add('message-sender'); 
        newDiv.appendChild(nameDiv);
    }
    newDiv.appendChild(messageDiv);
    chat.appendChild(newDiv);
}