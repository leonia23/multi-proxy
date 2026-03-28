import ProxyChain from "proxy-chain";

function createServer(port = 3000) {
  const USERNAME = process.env.PROXY_USERNAME || null;
  const PASSWORD = process.env.PROXY_PASSWORD || null;

  const server = new ProxyChain.Server({
    port,

    prepareRequestFunction: ({ request, username, password }) => {
      console.log("Request:", request.url);

      if (USERNAME && PASSWORD) {
        if (username !== USERNAME || password !== PASSWORD) {
          return { requestAuthentication: true };
        }
      }
      return {};
    },
  });

  server.listen(() => {
    console.log(`HTTP Proxy running on port ${server.port}`);
  });
  return server;
}

export default createServer;
