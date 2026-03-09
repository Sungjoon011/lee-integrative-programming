// ================= LOGIN =================
const loginForm = document.getElementById("loginForm");

if (loginForm) {

    const usernameInput = loginForm.querySelector("input[type='text']");
    const passwordInput = loginForm.querySelector("input[type='password']");
    const rememberCheckbox = loginForm.querySelector("input[type='checkbox']");

    const rememberedUser = localStorage.getItem("rememberedUsername");

    if (rememberedUser) {
        usernameInput.value = rememberedUser;
        rememberCheckbox.checked = true;
    }

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (!storedUser) {
            showMessage("No user found. Please sign up first.");
            return;
        }

        if (
            usernameInput.value === storedUser.username &&
            passwordInput.value === storedUser.password
        ) {

            if (rememberCheckbox.checked) {
                localStorage.setItem("rememberedUsername", usernameInput.value);
            } else {
                localStorage.removeItem("rememberedUsername");
            }

            // Redirect directly
            window.location.href = "Profile.html";

        } else {
            showMessage("Invalid username or password.");
        }
    });
}


// ================= SIGNUP =================
const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const username = registerForm.querySelector("input[type='text']").value;
        const email = registerForm.querySelector("input[type='email']").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password.length < 8) {
            showMessage("Password must be at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            showMessage("Passwords do not match.");
            return;
        }

        const user = {
            username: username,
            email: email,
            password: password
        };

        localStorage.setItem("user", JSON.stringify(user));

        // Automatically log them in
        window.location.href = "Profile.html";
    });
}


// ================= MESSAGE FUNCTION =================
function showMessage(message) {
    let errorBox = document.getElementById("error");

    if (!errorBox) {
        errorBox = document.createElement("p");
        errorBox.id = "error";
        errorBox.style.color = "red";
        errorBox.style.marginTop = "10px";

        const form = document.querySelector("form");
        form.appendChild(errorBox);
    }

    errorBox.textContent = message;
}
// ================= login Show Password =================
function toggleLoginPassword() {
  const password = document.getElementById("loginPassword");

  if (password.type === "password") {
    password.type = "text";
  } else {
    password.type = "password";
  }
}
// =================  Show Password =================
function toggleBothPasswords() {
  const password = document.getElementById("password");
  const confirm = document.getElementById("confirmPassword");

  // Check if currently password type is "password"
  const isPassword = password.type === "password";

  // Toggle both fields at the same time
  password.type = isPassword ? "text" : "password";
  confirm.type = isPassword ? "text" : "password";
}