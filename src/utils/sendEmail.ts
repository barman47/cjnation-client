// import formData from 'form-data';
// import MailGun from 'mailgun.js';
import { Resend } from 'resend';



interface Variables {
    [key: string]: string;
}

interface Message {
    to: string | string[];
    subject: string;
    variables?: Variables;
    template?: string;
    html?: string;
    attachment?: File
}

// export const sendEmail = async (message: Message) => {
//     const mailgun = new MailGun(formData);
//     const mg = mailgun.client({
//         username: 'api',
//         key: process.env.MAILGUN_API_KEY!,
//         url: process.env.MAILGUN_API_URL,
//     });
//     await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
//         from: process.env.SENDER_EMAIL,
//         to: message.to,
//         subject: message.subject,
//         template: message.template!,
//         // text,
//         html: message.html,
//         attachment: message.attachment,

//         'h:X-Mailgun-Variables': JSON.stringify(message.variables)
//     });
// };

export const sendEmail = async (message: Message) => {
    const resend = new Resend(process.env.RESEND_API_KEY!);
    await resend.emails.send({
        from: process.env.SENDER_EMAIL!,
        to: message.to,
        subject: message.subject,
        html: message.html!
    });
};