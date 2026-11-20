const fs = require("fs").promises;
const path = require("path");

const databasePath = path.join(__dirname, "lostItems.json");

async function getLostItems() {
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

async function addLostItem(item) {
    const requiredFields = [
        "name",
        "category",
        "description",
        "location",
        "dateLost",
        "contact"
    ];

    for (const field of requiredFields) {
        if (!item[field] || !String(item[field]).trim()) {
            throw new Error(`${field} is required.`);
        }
    }

    const dateLost = new Date(item.dateLost);

    if (Number.isNaN(dateLost.getTime())) {
        throw new Error("Invalid date lost.");
    }

    if (dateLost > new Date()) {
        throw new Error("Date lost cannot be in the future.");
    }

    if (!/^[0-9+\-\s]{8,15}$/.test(item.contact.trim())) {
        throw new Error("Invalid contact number.");
    }

    const lostItems = await getLostItems();

    const duplicateExists = lostItems.some(function (existingItem) {
    const sameName =
        existingItem.name.trim().toLowerCase() ===
        item.name.trim().toLowerCase();

    const sameLocation =
        existingItem.location.trim().toLowerCase() ===
        item.location.trim().toLowerCase();

    const sameDate = existingItem.dateLost === item.dateLost;

    return sameName && sameLocation && sameDate;
});

if (duplicateExists) {
    throw new Error("A similar lost item report already exists.");
}
    

    const newItem = {
        id: "L" + Date.now(),
        name: item.name.trim(),
        category: item.category.trim(),
        description: item.description.trim(),
        location: item.location.trim(),
        dateLost: item.dateLost,
        contact: item.contact.trim(),
        status: "lost",
        createdAt: new Date().toISOString()
    };

    lostItems.push(newItem);

    await fs.writeFile(
        databasePath,
        JSON.stringify(lostItems, null, 4)
    );

    return newItem;
}

module.exports = {
    getLostItems,
    addLostItem
};