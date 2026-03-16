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

// ================= RANDOM JOKE API =================

function getJoke() {
  const jokeBox = document.getElementById("jokeBox");
  jokeBox.innerHTML = "<p><em>Thinking of something funny...</em></p>";

  fetch("https://official-joke-api.appspot.com/random_joke")
    .then(response => response.json())
    .then(data => {
      jokeBox.innerHTML = `
        <p><strong>${data.setup}</strong></p>
        <p>${data.punchline}</p>
      `;
    })
    .catch(error => {
      jokeBox.innerHTML = "<p>Comedy is hard. Try again later!</p>";
      console.error("Joke Error:", error);
    });
}

function searchPlanet() {
  const planet = document.getElementById("planetInput").value.trim().toLowerCase();
  const result = document.getElementById("planetResult");

  if (!planet) {
    result.innerHTML = "<p style='color: #ff4d4d;'>Please enter a destination.</p>";
    return;
  }

  result.innerHTML = "<p>📡 Contacting deep space probes...</p>";

  // Fetching from NASA's Image Library (Free & Open)
  fetch(`https://images-api.nasa.gov/search?q=${planet}&media_type=image`)
    .then(response => {
      if (!response.ok) throw new Error("Connection lost.");
      return response.json();
    })
    .then(data => {
      const items = data.collection.items;
      
      if (items.length > 0) {
        // We grab the first result from the NASA database
        const firstItem = items[0];
        const imageUrl = firstItem.links[0].href;
        const title = firstItem.data[0].title;
        const description = firstItem.data[0].description;

        result.innerHTML = `
          <div class="planet-card" style="margin-top: 20px; border: 1px solid #00d4ff; padding: 15px; border-radius: 10px; background: rgba(0,0,0,0.7); color: white;">
            <h4 style="color: #00d4ff; margin-bottom: 10px;">${title}</h4>
            <img src="${imageUrl}" alt="${title}" style="width: 100%; border-radius: 5px; box-shadow: 0 0 15px rgba(0,212,255,0.3);">
            <p style="font-size: 0.85rem; line-height: 1.4; margin-top: 10px;">${description.substring(0, 150)}...</p>
          </div>
        `;
      } else {
        result.innerHTML = "<p>No records found in the NASA archives.</p>";
      }
    })
    .catch(error => {
      result.innerHTML = "<p>Static on the line. The 401 ghost is gone, but the server is busy!</p>";
      console.error(error);
    });
}