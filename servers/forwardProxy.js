import express from "express";
import axios from "axios";
import https from "https";
import cors from "cors";

export default function createForwardProxy(port, authService) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use("/request", async (req, res) => {
    let reqBody = req.body;
    if (req.body.base64string) {
      reqBody = JSON.parse(atob(req.body.base64string));
    }

    try {
      let {
        method = "GET",
        url,
        headers = {},
        body = null,
        timeout = 15000,
        username,
        password,
      } = reqBody;

      const result = await authService.validate(username, password);
      if (!result.success) {
        return res.status(401).json({
          error: "Unauthorized",
        });
      }

      const response = await axios({
        method,
        url: url,
        headers,
        data: body,
        timeout,
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
        validateStatus: () => true,
      });

      return res.json({
        status: response.status,
        headers: response.headers,
        data: response.data,
      });
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  });

  const server = app.listen(port, () =>
    console.log(`createForwardProxy ${port}`),
  );

  return server;
}
