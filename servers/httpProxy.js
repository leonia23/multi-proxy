import ProxyChain from "proxy-chain";

function createServer(port = 3000, authService) {
  const USERNAME = process.env.PROXY_USERNAME || null;
  const PASSWORD = process.env.PROXY_PASSWORD || null;

  const server = new ProxyChain.Server({
    port,

    prepareRequestFunction: async ({ request, username, password }) => {
      console.log("Request:", request.url);

      const resultAuth = await authService.validate(username, password);

      if (!resultAuth.success) {
        console.log(`incorrect user/pass:${username}  ${password}`);
        return { requestAuthentication: true };
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
