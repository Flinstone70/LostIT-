const foundItemForm = document.getElementById("foundItemForm");
const formMessage = document.getElementById("formMessage");

foundItemForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const foundItem = {
        name: document.getElementById("name").value.trim(),
        category: document.getElementById("category").value,
        description: document.getElementById("description").value.trim(),
        location: document.getElementById("location").value.trim(),
        dateFound: document.getElementById("dateFound").value,
        contact: document.getElementById("contact").value.trim()
    };

    try {
        const response = await fetch("/api/found-items", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(foundItem)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        formMessage.textContent = result.message;
        formMessage.style.color = "green";

        foundItemForm.reset();

    } catch (error) {
        formMessage.textContent = error.message || "Something went wrong.";
        formMessage.style.color = "red";
    }
});