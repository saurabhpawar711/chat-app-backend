const name = localStorage.getItem('username');
const userList = document.querySelector('.list-group');
const newUser = document.createElement('li');
newUser.innerHTML = `${name}`;
newUser.classList.add('contact-names');
userList.appendChild(newUser);

const displayedMessages = new Set();
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
            displayedMessages.add(message.id);
        }
    }
    catch (err) {
        console.log(err);
    }
}

setInterval(() => {
    getChats();
}, 1000);
window.addEventListener('DOMContentLoaded', getChats);
async function getChats() {
    try {
        const messages = JSON.parse(localStorage.getItem('messages'));
        const length = messages.length;
        const lastMsgId = messages[length - 1].id;
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/message/getmessages?id=${lastMsgId}`, { headers: { "Authorization": token } });
        const newMessage = response.data.messages;
        const noOfMsgs = response.data.noOfMsgs;
        if (noOfMsgs > 10) {
            showLoadingBtn();
        }

        if (!messages) {
            localStorage.setItem('messages', JSON.stringify(newMessage));
        }
        else if (newMessage.length > 0) {
            newMessage.forEach(element => {
                messages.shift();
                messages.push(element);
            });
        }
        localStorage.setItem('messages', JSON.stringify(messages));

        for (let i = 0; i < messages.length; i++) {
            if (!displayedMessages.has(messages[i].id)) {
                showMessage(messages[i]);
                displayedMessages.add(messages[i].id);
            }
        }
    }

    catch (err) {
        console.log(err);
    }
}


async function showMessage(message, isPreviousChat) {

    const previousChat = document.querySelector('.previousChat');
    const chat = document.querySelector('.chat');
    const username = localStorage.getItem('username');
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
    if (isPreviousChat) {
        previousChat.appendChild(newDiv);
    }
    else {
        chat.appendChild(newDiv);
    }
}
let buttonCreated = false;
function showLoadingBtn(message) {

    if (!buttonCreated) {
        const chattingDiv = document.querySelector('.chatting');
        const loadBtnDiv = document.querySelector('.loadBtn');
        const loadButton = document.createElement('button');
        loadButton.classList.add('btn', 'btn-info', 'mb-3');
        loadButton.innerHTML = '<span class="bi bi-arrow-clockwise"></span> Load messages';
        loadBtnDiv.appendChild(loadButton);
        loadButton.addEventListener('click', async () => {
            const token = localStorage.getItem('token');
            const gotMessages = await axios.get('http://localhost:3000/message/getmessages', { headers: { "Authorization": token } })
            const messages = gotMessages.data.messages;
            let isPreviousChat = true;
            for (let i = 0; i < messages.length; i++) {
                if (!displayedMessages.has(messages[i].id)) {
                    showMessage(messages[i], isPreviousChat);
                    displayedMessages.add(messages[i].id);
                }
            }
            chattingDiv.removeChild(loadBtnDiv);
        });
    }
    buttonCreated = true;
}

