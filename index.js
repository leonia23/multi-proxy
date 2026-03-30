import createhttpProxy from "./servers/httpProxy.js";
import createSocks5Proxy from "./servers/socks5Proxy.js";
import AuthService from "./auth.js";

const authService = new AuthService();

const portProxyServer = 3000;
createhttpProxy(portProxyServer, authService);

const portSocks5Server = 1080;
createSocks5Proxy(portSocks5Server, authService);
