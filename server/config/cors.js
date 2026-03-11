const corsConfig = (app) => {
  const clientUrl =
    process.env.NODE_ENV === "production"
      ? process.env.CLIENT_PROD_URL
      : process.env.CLIENT_URL;

  const adminUrl =
    process.env.NODE_ENV === "production"
      ? process.env.ADMIN_PROD_URL
      : process.env.ADMIN_URL;

  const allowedOrigins = [clientUrl, adminUrl];

  const corsOptions = {
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400, // 24 hours
  };

  return corsOptions;
};

export default corsConfig;
