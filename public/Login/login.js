const toggleButton = document.getElementById('togglePassword');
const password = document.getElementById('password');
toggleButton.addEventListener('click', showPassword);

function showPassword() {
    console.log(password);
    if (password.type === "password") {
        password.type = "text";
        toggleButton.classList.toggle('fa-eye-slash');
    }
    else {
        password.type = "password";
        toggleButton.classList.remove('fa-eye-slash');
    }
}

const form = document.getElementById('form');
form.addEventListener('submit', loginFunction);

async function loginFunction(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const loginDetails = {
        email: email,
        password: password
    };

    document.getElementById('email').value = "";
    document.getElementById('password').value = "";

    try {
        const response = await axios.post('http://localhost:3000/user/login', loginDetails);
        alert(response.data.message);
        localStorage.setItem('token', response.data.token);
    }
    catch(err) {
        const errMessage = err.response.data.error;
        const errContainer = document.getElementById('error-container');
        errContainer.innerHTML = `<h6>${errMessage}</h6>`;
    }

} 