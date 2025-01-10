export function getEmailTemplate(otp: string): string {
  return `
    <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f0f4f8;
            color: #333;
            padding: 20px;
            margin: 0;
          }

          .container {
            background-color: #ffffff;
            border-radius: 12px;
            padding: 30px;
            max-width: 600px;
            margin: 0 auto;
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
            font-size: 16px;
            line-height: 1.6;
          }

          h2 {
            color: #4caf50;
            text-align: center;
            font-size: 26px;
            margin-bottom: 20px;
          }

          p {
            font-size: 16px;
            color: #555;
            margin: 12px 0;
          }

          .otp {
            font-size: 24px;
            font-weight: bold;
            color: #ff5722;
            text-align: center;
            padding: 10px;
            background-color: #ffebee;
            border-radius: 8px;
            display: inline-block;
          }

          .footer {
            font-size: 14px;
            text-align: center;
            color: #888;
            margin-top: 30px;
          }

          .footer a {
            color: #4caf50;
            text-decoration: none;
          }

          .container p:last-child {
            margin-bottom: 0;
          }

          @media (max-width: 600px) {
            .container {
              padding: 25px;
            }

            h2 {
              font-size: 22px;
            }

            .otp {
              font-size: 26px;
              padding: 15px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Email Verification</h2>
          <p>Dear User,</p>
          <p>
            Thank you for registering with us. Please verify your email by entering
            the OTP below:
          </p>
          <p class="otp">${otp}</p>
          <p>
            This OTP is valid for 1 minutes. If you didn't request this, please
            ignore this email.
          </p>
          <div class="footer">
            <p>
              Need help?
              <a href="mailto:support@yourwebsite.com">Contact support</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}
