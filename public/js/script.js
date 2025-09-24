const checkbox = document.querySelector("#pswd-check");

checkbox.addEventListener("click", () => {
    const checkboxText = document.querySelector(".show-hide-pswd");
    const passwordInput = document.querySelector(".pswd");
    const type = passwordInput.getAttribute("type");
    if (checkbox.checked && type === "password") {
        passwordInput.setAttribute("type", "text");
    } else {
        passwordInput.setAttribute("type", "password");
    }
})