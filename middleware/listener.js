const server = require("./server");
const port = 8080;

server.listen(port, (err) => {
  if (err) {
    console.log(`Probably should do something more sensible with this ${err}`);
  } else {
    console.log(`The server is listening on port ${port}`);
  }
});
