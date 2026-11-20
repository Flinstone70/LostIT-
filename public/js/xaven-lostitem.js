const lostItemForm = document.getElementById("lostItemForm");
const formMessage = document.getElementById("formMessage");

lostItemForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const lostItem = {
    name: document.getElementById("name").value.trim(),
    category: document.getElementById("category").value,
    description: document.getElementById("description").value.trim(),
    location: document.getElementById("location").value.trim(),
    dateLost: document.getElementById("dateLost").value,
    contact: document.getElementById("contact").value.trim(),
  };

  formMessage.textContent = "";

  const hasEmptyField = Object.values(lostItem).some(function (value) {
    return !value;
  });

  if (hasEmptyField) {
    formMessage.textContent = "Please complete all required fields.";
    formMessage.style.color = "red";
    return;
  }

  const selectedDate = new Date(lostItem.dateLost + "T00:00:00");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (Number.isNaN(selectedDate.getTime())) {
    formMessage.textContent = "Please enter a valid date.";
    formMessage.style.color = "red";
    return;
  }

  if (selectedDate > today) {
    formMessage.textContent = "Date lost cannot be in the future.";
    formMessage.style.color = "red";
    return;
  }

  const normalizedContact = lostItem.contact.replace(/[\s-]/g, "");
  const contactPattern = /^(?:\+65)?[689]\d{7}$/;

  if (!contactPattern.test(normalizedContact)) {
    formMessage.textContent = "Enter a valid Singapore contact number.";
    formMessage.style.color = "red";
    return;
  }

  try {
    const response = await fetch("/api/lost-items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(lostItem),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    formMessage.textContent =
      result.message || "Lost item reported successfully.";
    formMessage.style.color = "green";

    lostItemForm.reset();
  } catch (error) {
    formMessage.textContent = error.message || "Something went wrong.";
    formMessage.style.color = "red";
  }
});
