export const supportConfig = {
    company: "Freedom POS Support",
    phone: "+1 (555) 123-4567",
    email: "support@freedompos.com",
    hours: "24/7",
    website: "https://support.freedompos.com",

    // Support levels
    levels: {
        basic: {
            name: "Basic Support",
            response_time: "24 hours",
            channels: ["email", "web portal"],
        },
        premium: {
            name: "Premium Support",
            response_time: "4 hours",
            channels: ["email", "phone", "web portal", "remote assistance"],
        },
        enterprise: {
            name: "Enterprise Support",
            response_time: "1 hour",
            channels: [
                "email",
                "phone",
                "web portal",
                "remote assistance",
                "dedicated agent",
            ],
        },
    },

    // Common issues and solutions
    troubleshooting: {
        printer_issues: {
            title: "Printer Connection Issues",
            steps: [
                "Check printer power and connection",
                "Verify printer driver installation",
                "Test printer from Windows settings",
                "Restart POS application",
            ],
        },
        barcode_scanner: {
            title: "Barcode Scanner Issues",
            steps: [
                "Verify USB connection",
                "Check scanner configuration",
                "Test in notepad",
                "Reinstall scanner drivers",
            ],
        },
    },
};
