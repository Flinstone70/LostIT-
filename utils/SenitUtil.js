const fs = require("fs").promises;
const path = require("path");

const databasePath = path.join(__dirname, "foundItems.json");

async function getFoundItems() {
    try {
        const data = await fs.readFile(databasePath, "utf8");
        return JSON.parse(data);
    } catch (error) {
        if (error.code === "ENOENT") {
            await fs.writeFile(databasePath, "[]");
            return [];
        }
        throw error;
    }
}

async function addFoundItem(item) {
    const requiredFields = [
        "name",
        "category",
        "description",
        "location",
        "dateFound",
        "contact"
    ];

    for (const field of requiredFields) {
        if (!item[field] || !String(item[field]).trim()) {
            throw new Error(`${field} is required.`);
        }
    }

    const dateFound = new Date(item.dateFound);

    if (Number.isNaN(dateFound.getTime())) {
        throw new Error("Invalid date found.");
    }

    if (dateFound > new Date()) {
        throw new Error("Date found cannot be in the future.");
    }

    if (!/^[0-9+\-\s]{8,15}$/.test(item.contact.trim())) {
        throw new Error("Invalid contact number.");
    }

    const foundItems = await getFoundItems();

    const newItem = {
        id: "F" + Date.now(),
        name: item.name.trim(),
        category: item.category.trim(),
        description: item.description.trim(),
        location: item.location.trim(),
        dateFound: item.dateFound,
        contact: item.contact.trim(),
        status: "available",
        createdAt: new Date().toISOString()
    };

    foundItems.push(newItem);

    await fs.writeFile(
        databasePath,
        JSON.stringify(foundItems, null, 4)
    );

    return newItem;
}

module.exports = {
    getFoundItems,
    addFoundItem
};