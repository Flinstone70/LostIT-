const http = require("http");
const fs = require("fs");
const path = require("path");

const { addFoundItem, getFoundItems } =
    require("./utils/SenitUtil");

const PORT = 3000;
const publicFolder = path.join(__dirname, "public");

const server = http.createServer(async (req, res) => {

    // Common response headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Handle preflight requests
    if (req.method === "OPTIONS") {
        res.writeHead(204);
        return res.end();
    }

    // ========================================
    // POST: REPORT A FOUND ITEM
    // ========================================

    if (req.method === "POST" && req.url === "/api/found-items") {

        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", async () => {
            try {
                const item = JSON.parse(body);

                const savedItem = await addFoundItem(item);

                res.writeHead(201, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    success: true,
                    message: "Found item reported successfully.",
                    item: savedItem
                }));

            } catch (error) {

                res.writeHead(400, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    success: false,
                    message: error.message
                }));
            }
        });

        return;
    }


    // ========================================
    // GET: RETRIEVE FOUND ITEMS
    // ========================================

    if (req.method === "GET" && req.url === "/api/found-items") {

        try {
            const items = await getFoundItems();

            res.writeHead(200, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify(items));

        } catch (error) {

            console.error("Error retrieving found items:", error);

            res.writeHead(500, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                success: false,
                message: "Unable to retrieve found items."
            }));
        }

        return;
    }


    // ========================================
    // SERVE FRONTEND FILES
    // ========================================

    const requestedPath = req.url === "/"
        ? "/index.html"
        : decodeURIComponent(req.url.split("?")[0]);

    const filePath = path.resolve(
        publicFolder,
        "." + requestedPath
    );

    // Prevent access outside public folder
    if (!filePath.startsWith(publicFolder + path.sep)) {
        res.writeHead(403);
        return res.end("Forbidden");
    }

    fs.readFile(filePath, (error, data) => {

        if (error) {
            res.writeHead(404);
            return res.end("File not found");
        }

        const extension = path.extname(filePath);

        const contentTypes = {
            ".html": "text/html",
            ".css": "text/css",
            ".js": "application/javascript",
            ".json": "application/json"
        };

        res.writeHead(200, {
            "Content-Type": contentTypes[extension] || "text/plain"
        });

        res.end(data);
    });

});


// ========================================
// START SERVER
// ========================================

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});