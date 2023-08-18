const signUp = document.getElementById('form');
signUp.addEventListener('submit', signUpfunction);

async function signUpfunction(event) {

    event.preventDefault();
    const errorContainer = document.getElementById('error-container');
    errorContainer.innerHTML = "";

    let username = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let number = document.getElementById('number').value;
    let password = document.getElementById('password').value;

    const userDetails = {
        name: username,
        email: email,
        number: number,
        password: password
    }
    document.getElementById('name').value = "";
    document.getElementById('email').value = "";
    document.getElementById('number').value = "";
    document.getElementById('password').value = "";

    try {
        await axios.post(`http://localhost:3000/user/signup`, userDetails);
        alert('You have successfully created account');
        window.location.href = '../Login/login.html';
    }
    catch (err) {
        const errorMessage = err.response.data.error;
        const errorContainer = document.getElementById('error-container');
        errorContainer.innerHTML = `<h6>${errorMessage}</h6>`;
    }
}