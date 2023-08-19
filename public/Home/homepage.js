
const name = localStorage.getItem('username');
const newJoiner = document.querySelector('.joiner');
newJoiner.innerHTML = `${name} joined`;
setTimeout(() => {
    newJoiner.innerHTML = ``;
}, 3000);


const userList = document.querySelector('.list-group');
const newUser = document.createElement('li');
newUser.innerHTML = `${name}`;
newUser.classList.add('contact-names');
userList.appendChild(newUser);

const sendBtn = document.querySelector('.send-button');
sendBtn.addEventListener('click', sendMessage);

async function sendMessage(e) {
    e.preventDefault();

    const message = document.getElementById('message').value;
    const messageDetails = {
        message: message
    };
    document.getElementById('message').value = "";

    try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:3000/message/sendmessage',messageDetails,
            {
                headers:{ "Authorization": token }
            }
        );
        if(response.data.success) {
            showMessage();
        }
        function showMessage() {
            const chat = document.querySelector('.chat');
            const newChat = document.createElement('div');
            newChat.innerHTML = `${message}`;
            newChat.classList.add('message-receiver');
            chat.appendChild(newChat);
        }
    }
    catch(err) {
        console.log(err);
    }
 }