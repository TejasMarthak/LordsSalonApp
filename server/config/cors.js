const corsConfig = () => {
  const isDev = process.env.NODE_ENV !== "production";
  
  // Always allow localhost in development
  let allowedOrigins = [
    "http://localhost:3000",    // Client dev
    "http://localhost:3001",    // Admin dev
    "http://localhost:3002",    // Client dev (fallback port)
    "http://localhost:3003",    // Admin dev (fallback port)
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:3002",
    "http://127.0.0.1:3003",
  ];

  // Add production URLs if provided
  if (!isDev) {
    if (process.env.CLIENT_PROD_URL) allowedOrigins.push(process.env.CLIENT_PROD_URL);
    if (process.env.ADMIN_PROD_URL) allowedOrigins.push(process.env.ADMIN_PROD_URL);
  }

  // Also allow the URLs from env variables
  if (process.env.CLIENT_URL && !allowedOrigins.includes(process.env.CLIENT_URL)) {
    allowedOrigins.push(process.env.CLIENT_URL);
  }
  if (process.env.ADMIN_URL && !allowedOrigins.includes(process.env.ADMIN_URL)) {
    allowedOrigins.push(process.env.ADMIN_URL);
  }

  const corsOptions = {
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`CORS: Blocked request from origin: ${origin}`);
        console.warn(`CORS: Allowed origins: ${allowedOrigins.join(", ")}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    maxAge: 86400, // 24 hours
  };

  return corsOptions;
};

export default corsConfig;
