const toggleButton = document.getElementById('togglePassword');
const password = document.getElementById('password');
toggleButton.addEventListener('click', showPassword);

function showPassword() {
    console.log(password);
    if(password.type === "password") {
        password.type = "text";
        toggleButton.classList.toggle('fa-eye-slash');
    }
    else {
        password.type = "password";
        toggleButton.classList.remove('fa-eye-slash');
    }
}
