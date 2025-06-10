document.querySelector('.logIn-button').addEventListener('click', async () => {
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;
    const errorDiv = document.getElementById('error-messages');

    const response = await fetch('/pvi/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    console.log(result);

    if (result.success) {
        sessionStorage.setItem('user_id', result.user_id);
        sessionStorage.setItem('first_name', result.first_name);
        sessionStorage.setItem('last_name', result.last_name);

        window.location.href = '/pvi/students/index';
    } else {
        errorDiv.textContent = result.message;
    }
});
