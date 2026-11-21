const availableItemsContainer = document.getElementById("availableItems");

async function loadAvailableItems() {
    try {
        const response = await fetch("/api/found-items");

        if (!response.ok) {
            throw new Error("Unable to retrieve found items.");
        }

        const foundItems = await response.json();

        // Only display items that are available
        const availableItems = foundItems.filter(
            item => item.status === "available"
        );

        availableItemsContainer.innerHTML = "";

        if (availableItems.length === 0) {
            availableItemsContainer.textContent =
                "No available found items at the moment.";

            return;
        }

        availableItems.forEach(item => {
            const card = document.createElement("div");
            card.className = "item-card";

            const title = document.createElement("h3");
            title.textContent = item.name;

            const category = document.createElement("p");
            category.textContent = "Category: " + item.category;

            const description = document.createElement("p");
            description.textContent = "Description: " + item.description;

            const location = document.createElement("p");
            location.textContent = "Location: " + item.location;

            const date = document.createElement("p");
            date.textContent = "Date Found: " + item.dateFound;

            const status = document.createElement("span");
            status.className = "item-status";
            status.textContent = "Available";

            const claimButton = document.createElement("a");
            claimButton.href = `claim-item.html?id=${item.id}`;
            claimButton.className = "action-button";
            claimButton.textContent = "Claim Item";

            card.appendChild(title);
            card.appendChild(category);
            card.appendChild(description);
            card.appendChild(location);
            card.appendChild(date);
            card.appendChild(status);
            card.appendChild(document.createElement("br"));
            card.appendChild(claimButton);

            availableItemsContainer.appendChild(card);
        });

    } catch (error) {
        availableItemsContainer.textContent =
            "Unable to load available items. Please try again later.";

        console.error("Dashboard error:", error);
    }
}

// Load items when the dashboard opens
loadAvailableItems();