const path = require("path");
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/angular-build'));

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'angular-build', 'index.html'))
});
// Start the app by listening on the default Heroku port
app.listen(port, () => {
    console.log(`Server started on ${port}`)
});
