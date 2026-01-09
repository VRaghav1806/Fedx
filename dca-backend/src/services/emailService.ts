import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Default sender - use Resend's test domain or your verified domain
const FROM_EMAIL = process.env.FROM_EMAIL || 'DCA Platform <onboarding@resend.dev>';

export const testConnection = async () => {
    console.log('--- 📧 EMAIL SERVICE STARTUP CHECK ---');

    if (!process.env.RESEND_API_KEY) {
        console.warn('⚠️ RESEND_API_KEY not set. Email notifications will fail.');
        console.warn('   Get your free API key at: https://resend.com');
        return;
    }

    console.log('✅ Resend API Key detected');
    console.log('📧 From Email:', FROM_EMAIL);
    console.log('📬 Notify Email:', process.env.NOTIFY_EMAIL || 'Not set');
};

export const sendNotification = async (to: string, subject: string, text: string, html: string) => {
    try {
        if (!process.env.RESEND_API_KEY) {
            throw new Error("RESEND_API_KEY not configured. Get your free key at https://resend.com");
        }

        console.log('📧 Sending email via Resend...');
        console.log('   To:', to);
        console.log('   Subject:', subject);

        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: [to],
            subject,
            text,
            html,
        });

        if (error) {
            console.error("❌ RESEND API ERROR:", error);
            throw new Error(error.message);
        }

        console.log("================================================");
        console.log("📧 EMAIL SENT SUCCESSFULLY!");
        console.log("   To:", to);
        console.log("   Message ID:", data?.id);
        console.log("================================================");

        return data;
    } catch (error) {
        console.error("❌ EMAIL SEND ERROR:", error);
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
