const API_URL = "https://sos-alimentos-servidor.onrender.com/api";

//CHECAR SE O USUÁRIO JÁ ESTÁ LOGADO
async function checarLogin() {
    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            method: "GET",
            credentials: "include",
        });

        if (response.ok) {
            window.location.href = "../../";
        }
    } catch (error) {
        console.error("Erro ao verificar sessão inicial:", error);
    }
}

// Inicializadores do DOM
document.addEventListener("DOMContentLoaded", () => {
    checarLogin();
    initLogin();
});


// login
function initLogin() {
    const form = document.getElementById("login-form");
    const button = document.getElementById("login-button");
    const message = document.getElementById("login-message");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const usuario = document.getElementById("usuario-login").value.trim();
        const senha = document.getElementById("senha-login").value;

        if (!usuario || !senha) {
            mostrarMensagem(message, "Preencha usuário e senha.", "erro");
            setTimeout(() => {
                message.style.display = "none";
            }, 3000);
            return;
        }

        button.disabled = true;
        button.textContent = "Entrando...";
        mostrarMensagem(message, "Validando suas credenciais...", "pendente");

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ login: usuario, password: senha }),
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.erro || "Falha no login");
            } else {
                mostrarMensagem(message, "Login realizado com sucesso! Redirecionando...", "sucesso");
                form.reset();

                window.setTimeout(() => {
                    // Caminho corrigido!
                    window.location.href = "../../";
                }, 1500);
            }
        } catch (error) {
            mostrarMensagem(message, error.message || "Não foi possível fazer login.", "erro");
        } finally {
            button.disabled = false;
            button.textContent = "Entrar";
        }
    });
}

// Atualiza o texto e o estado visual (via classe) da mensagem de status do formulário
function mostrarMensagem(elemento, texto, tipo) {
    elemento.style.display = "block";
    elemento.textContent = texto;
    elemento.classList.remove("login-message--erro", "login-message--sucesso", "login-message--pendente");
    elemento.classList.add(`login-message--${tipo}`);
}