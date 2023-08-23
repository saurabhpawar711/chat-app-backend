const createTableModal = document.getElementById('createGroupModal');
const groupCreateBtn = document.getElementById('groupCreateBtn');
groupCreateBtn.addEventListener('click', async () => {
    const groupName = document.getElementById('groupName').value;
    const users = document.getElementById('emailAddresses').value;
    const userToBeAdd = users.split(',');
    const groupDetails = {
        name: groupName,
        userToBeAdd: userToBeAdd
    };
    console.log(groupDetails);
    const token = localStorage.getItem('token');
    const response = await axios.post('http://localhost:3000/group/create-group', groupDetails, { headers: { "Authorization": token } });

    window.location.href = 'homepage.html';
})


window.addEventListener('DOMContentLoaded', getGroupName);

async function getGroupName() {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/user/groups', { headers: { "Authorization": token } });
    const groupId = [];
    for (let i = 0; i < response.data.groupIds.length; i++) {
        groupId.push(response.data.groupIds[i].groupId);
    }
    for (let i = 0; i < response.data.groupDetails.length; i++) {
        groupCreated(response.data.groupDetails[i], groupId[i]);
    }

}

function groupCreated(groupName, groupId) {
    const groupList = document.querySelector('.list-group');
    const newGroup = document.createElement('li');
    newGroup.innerHTML = `${groupName}`;
    newGroup.classList.add('contact-names');
    newGroup.setAttribute('data-group-id', groupId);
    groupList.appendChild(newGroup);
}

const addUserModal = document.getElementById('addMemberModal');
const addUserBtn = document.getElementById('addUserBtn');
addUserBtn.addEventListener('click', async () => {
    try {
        const groupName = document.getElementById('groupName1').value;
        const user = document.getElementById('emailAddress').value;
        const groupDetails = {
            name: groupName,
            userToBeAdd: user
        };
        console.log(groupDetails);
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:3000/group/add-user', groupDetails, { headers: { "Authorization": token } });
        window.location.href = 'homepage.html';
        alert(response.data.message);
    }
    catch(err) {
        const error = err.response.data.error;
        window.location.href = 'homepage.html';
        alert(error);
    }
})


