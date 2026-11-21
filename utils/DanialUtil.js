//Util for claiming lost items

const fs = require("fs").promises;
const path = require("path");

const databasePath = path.join(__dirname, "founditems.json");
//Ask if need put in claimItems.json VVV
//const databasePath = path.join(__dirname, "claimItems.json")

async function claimItem(id, username, contact) {
    try {
        let item = [];

        const data = await fs.readFile(databasePath, "utf8");
        item = JSON.parse(data);
        console.log(item) //-------------------

        const itemIndex = item.findIndex(r => r.id == id);
        console.log(itemIndex) //--------------

        if (itemIndex === -1) {
            const error = new Error("Item not found")
            error.statusCode = 404;
            throw error;

        } else if(item[itemIndex].status === "available"){

            //Update Status from "available" to "claimed"
            item[itemIndex].status = "claimed";
            item[itemIndex].claimedBy = { username: username, contact: contact };
            
            //Save updated status
            await fs.writeFile(databasePath, JSON.stringify(item, null, 2), "utf8");
            console.log("Item successfully claimed")

            return item[itemIndex]

        } else {
            const error = new Error("Item already claimed")
            error.statusCode = 409;
            throw error;
        }

    } catch (error) {
        if (error.code === "ENOENT"){
            error.message = "File not found";
            error.statusCode = 404;
        }
        throw error
    }
}

module.exports = { claimItem };

