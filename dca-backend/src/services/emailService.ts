import nodemailer from 'nodemailer';

// Cache the transporter to avoid re-creating test accounts on every request
let transporterPromise: Promise<nodemailer.Transporter> | null = null;

const getTransporter = async () => {
    if (transporterPromise) return transporterPromise;

    transporterPromise = (async () => {
        // Check if real SMTP credentials are provided in .env
        const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

        console.log('--- 📧 SMTP DIAGNOSTICS ---');
        console.log('SMTP_HOST:', SMTP_HOST ? `✅ Detected (${SMTP_HOST})` : '❌ Missing');
        console.log('SMTP_USER:', SMTP_USER ? '✅ Detected' : '❌ Missing');
        console.log('SMTP_PASS:', SMTP_PASS ? '✅ Detected' : '❌ Missing');

        if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
            console.log(`🌐 Initializing Real SMTP Service: ${SMTP_HOST}`);
            return nodemailer.createTransport({
                host: SMTP_HOST,
                port: parseInt(SMTP_PORT || '587'),
                secure: SMTP_PORT === '465', // true for 465, false for other ports
                auth: {
                    user: SMTP_USER,
                    pass: SMTP_PASS,
                },
            });
        }

        // Fallback to Sandbox for local testing
        console.log("🧪 No SMTP credentials found. Initializing Ethereal Sandbox...");
        let testAccount = await nodemailer.createTestAccount();
        console.log("Ethereal test account created:", testAccount.user);

        return nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    })();

    return transporterPromise;
};

export const testConnection = async () => {
    console.log('--- 📧 SMTP STARTUP CHECK ---');
    try {
        await getTransporter();
        console.log('✅ Email service initialized.');
    } catch (error) {
        console.error('❌ Email service failed to initialize:', error);
    }
};

export const sendNotification = async (to: string, subject: string, text: string, html: string) => {
    try {
        const transporter = await getTransporter();

        const info = await transporter.sendMail({
            from: `"DCA Platform Alerts" <${process.env.SMTP_USER || 'alerts@dcaplatform.com'}>`,
            to,
            subject,
            text,
            html,
        });

        console.log("================================================");
        console.log("📧 EMAIL SENT SUCCESSFULLY");
        console.log("Message ID:", info.messageId);

        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
            console.log("Preview URL (Sandbox):", previewUrl);
        } else {
            console.log("Mode: Production (Real inbox delivery)");
        }
        console.log("================================================");

        return info;
    } catch (error) {
        console.error("❌ EMAIL SEND ERROR:", error);
        // Reset promise on error to allow retry
        transporterPromise = null;
        throw error;
    }
};

export const notifyCaseCreated = async (caseData: any) => {
    const subject = `New Case Registered: ${caseData.accountNumber}`;
    const text = `A new case for ${caseData.customerName} with amount $${caseData.amount} has been registered.`;
    const html = `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #0070f3;">New Case Registration</h2>
            <p>A new debt recovery case has been assigned to the system.</p>
            <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Account:</strong></td><td>${caseData.accountNumber}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Customer:</strong></td><td>${caseData.customerName}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Amount:</strong></td><td>$${caseData.amount.toLocaleString()}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Priority:</strong></td><td>${caseData.priority}</td></tr>
            </table>
            <p style="margin-top: 20px;">Please login to the dashboard for more details.</p>
        </div>
    `;

    return sendNotification(process.env.NOTIFY_EMAIL || 'admin@dcaplatform.com', subject, text, html);
};

export const notifyEscalation = async (caseData: any) => {
    const subject = `URGENT: Case Escalated - ${caseData.accountNumber}`;
    const text = `Case for ${caseData.customerName} has been escalated!`;
    const html = `
        <div style="font-family: sans-serif; padding: 20px; border: 2px solid red; border-radius: 8px;">
            <h2 style="color: red;">Priority Escalation Alert</h2>
            <p>Immediate intervention is required for the following account:</p>
            <div style="background: #fff5f5; padding: 15px; border-radius: 4px;">
                <p><strong>Account:</strong> ${caseData.accountNumber}</p>
                <p><strong>Customer:</strong> ${caseData.customerName}</p>
                <p><strong>Amount:</strong> $${caseData.amount.toLocaleString()}</p>
            </div>
            <p>This case has breached normal SLA parameters.</p>
        </div>
    `;

    return sendNotification(process.env.NOTIFY_EMAIL || 'admin@dcaplatform.com', subject, text, html);
};
