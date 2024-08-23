import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';

interface EmailConfiguration {
    host: string,
    port: number,
    user: string,
    password: string,
    from: string
}

interface Email {
    to: string,
    subject: string,
    text: string | undefined,
    html: string | undefined
}

@Injectable()
export class MailService {

    constructor(
        private readonly config: ConfigService
    ) {
    }

    /**
     * Send a simple email
     */
    public async send(email: Email, token: string) {

        const 
            configuration = await this.getConfiguration(),
            transporter = await this.createTransporter();

        transporter.sendMail({
            from: configuration.from,
            to: email.to,
            subject: email.subject,
            text: email.text,
            html: `
                <html>
                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                            }
                            .container {
                                max-width: 600px;
                                margin: 0 auto;
                                padding: 20px;
                                border: 1px solid #ccc;
                                border-radius: 5px;
                            }
                            .title {
                                font-size: 24px;
                                font-weight: bold;
                                margin-bottom: 20px;
                            }
                            .message {
                                margin-bottom: 20px;
                            }
                            .link {
                                display: inline-block;
                                padding: 10px 20px;
                                background-color: #007bff;
                                color: #fff;
                                text-decoration: none;
                                border-radius: 5px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1 class="title">Restablecimiento de contraseña</h1>
                            <p class="message">Por favor, use el siguiente enlace para restablecer su contraseña:</p>
                            <a class="link" href="${token}">Restablecer contraseña</a>
                        </div>
                    </body>
                </html>
            `,
        });
    }

    /**
     * Get configuration section related to email from Configuration Service
     * @returns Get email configuration
     */
    private async getConfiguration(): Promise<EmailConfiguration> {

        let config = {} as EmailConfiguration;
        config.host = this.config.get<string>('EMAIL_HOST');
        config.port = this.config.get<number>('EMAIL_PORT');
        config.user = this.config.get<string>('EMAIL_USER');
        config.password = this.config.get<string>('EMAIL_PASSWORD');
        config.from = this.config.get<string>('EMAIL_FROM');

        return config;
    }

    async sendPasswordReset(email: string, token: string) {
        const mailOptions = {
            from: 'SecureAdmin <secure.adm1n.app@gmail.com>',
            to: email,
            subject: 'Restablecimiento de contraseña',
            html: `
                <html>
                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                            }
                            .container {
                                max-width: 600px;
                                margin: 0 auto;
                                padding: 20px;
                                border: 1px solid #ccc;
                                border-radius: 5px;
                            }
                            .title {
                                font-size: 24px;
                                font-weight: bold;
                                margin-bottom: 20px;
                            }
                            .message {
                                margin-bottom: 20px;
                            }
                            .link {
                                display: inline-block;
                                padding: 10px 20px;
                                background-color: #007bff;
                                color: #fff;
                                text-decoration: none;
                                border-radius: 5px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1 class="title">Restablecimiento de contraseña</h1>
                            <p class="message">Por favor, use el siguiente token para restablecer su contraseña:</p>
                            <p>${token}</p>
                        </div>
                    </body>
                </html>
            `,
        };

        const 
            configuration = await this.getConfiguration(),
            transporter = await this.createTransporter();

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Correo enviado: %s', info.messageId);
        } catch (error) {
            console.error('Error enviando el correo:', error);
        }
    }

    private async createTransporter() {
        const configuration = await this.getConfiguration();
        return createTransport({
            host: configuration.host,
            port: configuration.port,
            secure: true,
            auth: {
                user: configuration.user,
                pass: configuration.password
            }
        });
    }

}
