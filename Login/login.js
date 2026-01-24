document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const u = document.getElementById('logUser').value;
    const p = document.getElementById('logPass').value;
    const user = await DB.login(u, p);

    if (user) {
        if (user.role === 'admin') window.location.href = '../DashBoard/index.html';
        else window.location.href = '../Landingpage/#';
    } else {
        document.getElementById('alertMsg').textContent = "Datos incorrectos.";
    }
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        await DB.register(
            document.getElementById('regName').value,
            document.getElementById('regUser').value,
            document.getElementById('regPass').value
        );
        alert('Registrado. Inicia sesión.');
        window.location.reload();
    } catch (err) {
        document.getElementById('alertMsg').textContent = err.message;
    }
});
