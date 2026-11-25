const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get("id")
const claimItemForm = document.getElementById("claimItemForm");

claimItemForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const claimDetails = {
        username: document.getElementById("username").value.trim(),
        contact: document.getElementById("contact").value.trim(),
    }

    // Validate contact number
    const contactFormat = /^[89]\d{7}$/;

    if (!contactFormat.test(claimDetails.contact)) {
        formMessage.textContent = "Enter a valid Singapore contact number";
        formMessage.style.color = "red";
        return;
    }

    try {
        const response = await fetch(`/api/claim-item/${itemId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(claimDetails)
        });

        const result = await response.json();
        console.log(result)

        if (!response.ok){
            throw new Error(result.message);
        }

        formMessage.textContent = result.message;
        formMessage.style.color = "green";

    } catch (error) {
        console.error(error);
        formMessage.textContent = error.message || "Something went wrong";
        formMessage.style.color = "red";
    }
})