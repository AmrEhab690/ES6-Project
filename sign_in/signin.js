document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const rememberCheckbox = document.getElementById("remember");
  
    form.addEventListener("submit", function (e) {
      e.preventDefault();
  
      clearPreviousErrors();
  
      const enteredEmail = emailInput.value.trim();
      const enteredPassword = passwordInput.value.trim();
      const users = JSON.parse(localStorage.getItem("users")) || [];
  
      const errors = [];
  
      if (enteredEmail === "") {
        errors.push({ field: "email", message: "Email is required." });
      }
  
      if (enteredPassword === "") {
        errors.push({ field: "password", message: "Password is required." });
      }
  
      if (errors.length > 0) {
        displayErrors(errors);
        showtoast2("Please fix the highlighted errors.");
        return;
      }
  
      if (users.length === 0) {
        showtoast2("No registered user found. Please register first.");
        setTimeout(() => {
          window.location.href = "../register/register.html";
        }, 2500);
        return;
      }
  
      const user = users.find(u => u.email === enteredEmail);
  
      if (!user) {
        displayErrors([{ field: "email", message: "Email not found. Please register first." }]);
        showtoast2("Email is not registered.");
        return;
      }
  
      if (user.password !== enteredPassword) {
        displayErrors([{ field: "password", message: "Incorrect password." }]);
        showtoast2("Incorrect password.");
        return;
      }
  
      if (rememberCheckbox.checked) {
        localStorage.setItem("isLoggedIn", "true");
      } else {
        sessionStorage.setItem("isLoggedIn", "true");
      }
  
      localStorage.setItem("username", user.name);
      showtoast2("Login successful!");
      setTimeout(() => {
        window.location.href = "../home/home.html";
      }, 1500);
    });
  
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
  
    function showtoast2(message) {
      const toast2 = document.getElementById("toast2");
      toast2.textContent = message;
      toast2.classList.add("show");
      setTimeout(() => {
        toast2.classList.remove("show");
      }, 3000);
    }
  });
  