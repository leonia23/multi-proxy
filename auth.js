import fs from "fs";
import path from "path";
import axios from "axios";

class AuthService {
  constructor(options = {}) {
    this.method = options.method || process.env.AUTH_METHOD || "env";
    this.filePath =
      options.filePath ||
      process.env.AUTH_FILE ||
      path.join(process.cwd(), "config/users.txt");
    this.apiUrl = options.apiUrl || process.env.AUTH_API_URL || null;
  }

  async validate(username, password) {
    if (!username || !password) {
      return { success: false, message: "Missing credentials" };
    }

    switch (this.method) {
      case "env":
        return this.checkEnv(username, password);
      case "file":
        return this.checkFile(username, password);
      case "api":
        return this.checkApi(username, password);
      default:
        throw new Error("Unknown auth method");
    }
  }

  checkEnv(username, password) {
    const envUser = process.env.AUTH_USER;
    const envPass = process.env.AUTH_PASS;

    if (username === envUser && password === envPass) {
      return { success: true, user: username, method: "env" };
    }

    return { success: false, message: "Invalid credentials" };
  }

  checkFile(username, password) {
    if (!fs.existsSync(this.filePath)) {
      throw new Error(`File ${this.filePath} not found`);
    }

    const lines = fs
      .readFileSync(this.filePath, "utf-8")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    for (const line of lines) {
      const [user, pass] = line.split(":");

      if (username === user && password === pass) {
        return { success: true, user: username, method: "file" };
      }
    }

    return { success: false, message: "Invalid credentials" };
  }

  async checkApi(username, password) {
    if (!this.apiUrl) {
      throw new Error("API URL not set");
    }

    try {
      const response = await axios.post(this.apiUrl, {
        username,
        password,
      });

      if (response.data && response.data.success) {
        return {
          success: true,
          user: response.data.user || username,
          method: "api",
        };
      }

      return { success: false, message: "Invalid credentials" };
    } catch (err) {
      return { success: false, message: "API error" };
    }
  }
}

export default AuthService;
