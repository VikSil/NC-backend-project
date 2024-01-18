const server = require("./middleware/server");
const { PORT = 9090 } = process.env;

server.listen(port, (err) => {
  if (err) {
    console.log(`Probably should do something more sensible with this ${err}`);
  } else {
    console.log(`The server is listening on port ${port}`);
  }
});
