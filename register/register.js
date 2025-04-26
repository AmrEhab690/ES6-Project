const form = document.querySelector("form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const termsCheckbox = document.getElementById("terms");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  let name = nameInput.value.trim();
  let email = emailInput.value.trim();
  let password = passwordInput.value.trim();
  let confirmPassword = confirmPasswordInput.value.trim();
  let termsAccepted = termsCheckbox.checked;

  clearPreviousErrors();

  let errors = [];

  if (name === "") {
    errors.push({ field: "name", message: "Username is required." });
  } else if (!/^[a-zA-Z0-9_]+$/.test(name)) {
    errors.push({
      field: "name",
      message: "Username must contain only letters, numbers, or underscores without spaces.",
    });
  } else if (/^[0-9_]+$/.test(name)) {
    errors.push({
      field: "name",
      message: "Username must include at least one letter.",
    });
  }

  if (email === "") {
    errors.push({ field: "email", message: "Email is required." });
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.push({ field: "email", message: "Email is not valid." });
  }

  if (password === "") {
    errors.push({ field: "password", message: "Password is required." });
  } else {
    if (password.length < 8) {
      errors.push({
        field: "password",
        message: "Password must be at least 8 characters.",
      });
    }
    if (!/[A-Z]/.test(password)) {
      errors.push({
        field: "password",
        message: "Password must contain at least one uppercase letter.",
      });
    }
    if (!/[a-z]/.test(password)) {
      errors.push({
        field: "password",
        message: "Password must contain at least one lowercase letter.",
      });
    }
    if (!/[0-9]/.test(password)) {
      errors.push({
        field: "password",
        message: "Password must contain at least one digit.",
      });
    }
    if (!/[\W_]/.test(password)) {
      errors.push({
        field: "password",
        message: "Password must contain at least one special character.",
      });
    }
  }

  if (password !== confirmPassword) {
    errors.push({
      field: "confirmPassword",
      message: "Passwords do not match.",
    });
  }

  if (!termsAccepted) {
    errors.push({
      field: "terms",
      message: "You must accept the terms and conditions.",
    });
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const emailExists = users.some((user) => user.email === email);
  const usernameExists = users.some((user) => user.name === name);

  if (emailExists) {
    errors.push({
      field: "email",
      message: "Email is already registered.",
    });
  }

  if (usernameExists) {
    errors.push({
      field: "name",
      message: "Username is already taken.",
    });
  }

  if (errors.length > 0) {
    displayErrors(errors);
    showToast("Please fix the errors below.", "error");
  
  } else {
    const userData = {
      name: name,
      email: email,
      password: password,
    };

    users.push(userData);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUserEmail", email);

    showToast("Registration Successful!", "success");

    form.reset();

    setTimeout(function () {
      window.location.href = "../sign_in/signin.html";
    }, 1500);  
  }
});

function showToast(message, type) {
  const toast = document.createElement("div");
  toast.classList.add("toast", type === "success" ? "success-toast" : "error-toast");
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);  
}

function displayErrors(errors) {
  errors.forEach((error) => {
    const errorSpan = document.getElementById(`${error.field}Error`);
    if (errorSpan) {
      errorSpan.textContent = error.message;
    }
  });
}

function clearPreviousErrors() {
  const errorSpans = document.querySelectorAll(".error-message");
  errorSpans.forEach((span) => {
    span.textContent = "";
  });
}
