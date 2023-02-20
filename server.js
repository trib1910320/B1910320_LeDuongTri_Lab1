const app = require("./app");
const config = require("./app/config");

//Start Server
const PORT = config.app.port;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

