const form = document.querySelector("#edit-inventory")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector("#submit")
      updateBtn.removeAttribute("disabled")
    })