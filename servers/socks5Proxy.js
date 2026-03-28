import socks5 from "simple-socks";

function createServer(port = 1080, authService) {
  const options = {
    authenticate: async function (username, password, socket, callback) {
      const result = await authService.validate(username, password);
      if (result.success) {
        return setImmediate(callback);
      }

      return setImmediate(
        callback,
        new Error("incorrect username and password"),
      );
    },
  };

  const server = socks5.createServer(options).listen(port, () => {
    console.log(`SOCKS5 Proxy running on port ${port}`);
  });
  return server;
}

export default createServer;
