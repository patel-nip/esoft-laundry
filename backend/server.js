const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./src/routes/authRoutes");
const customerRoutes = require("./src/routes/customerRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const reportRoutes = require("./src/routes/reportRoutes");
const ncfRoutes = require("./src/routes/ncfRoutes");
const servicePriceRoutes = require("./src/routes/servicePriceRoutes");
const companyRoutes = require("./src/routes/companyRoutes");
const invoiceSettingsRoutes = require("./src/routes/invoiceSettingsRoutes");
const userRoutes = require("./src/routes/userRoutes");
const roleRoutes = require("./src/routes/roleRoutes");
const printerRoutes = require("./src/routes/printerRoutes");
const backupRoutes = require("./src/routes/backupRoutes");

const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://esoft-35325.netlify.app',
        'https://esoft-laundry.vercel.app' // Add your Netlify URL later
    ],
    credentials: true
};

dotenv.config();

const app = express();

app.use(cors(corsOptions));
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Laundry backend API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/ncf", ncfRoutes);
app.use("/api/service-prices", servicePriceRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/invoice-settings", invoiceSettingsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/printers", printerRoutes);
app.use("/api/backup", backupRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
