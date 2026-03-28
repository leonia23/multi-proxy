module.exports = {
  apps: [
    {
      name: "proxy-server",
      script: "./index.js",
      exec_mode: "fork",
      autorestart: true, // перезапуск при падении
      watch: false, // watch отключен в prod
      max_memory_restart: "300M", // перезапуск при превышении памяти
    },
  ],
};
