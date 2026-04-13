const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

async function testGmail() {
  const gmailUser = process.env.GMAIL_USER || 'abderelmalki@gmail.com';
  const appPassword = process.env.GMAIL_APP_PASSWORD;

  console.log('Testing Gmail SMTP...');
  console.log('Gmail User:', gmailUser);
  console.log('App Password:', appPassword ? '✓ Configured' : '✗ Missing');

  if (!appPassword) {
    console.error('❌ GMAIL_APP_PASSWORD not set in .env.local');
    process.exit(1);
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: appPassword
      }
    });

    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP Connection: OK');

    console.log('\nSending test email...');
    const result = await transporter.sendMail({
      from: `Test <${gmailUser}>`,
      to: 'abderelmalki@gmail.com',
      subject: 'Test Email from Dubai Négoce',
      html: '<h1>Hello!</h1><p>This is a test email from your app.</p>',
      replyTo: 'contact@dubainegoce.fr'
    });

    console.log('✅ Email sent successfully!');
    console.log('Message ID:', result.messageId);
    console.log('Response:', result.response);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Code:', error.code);
    console.error('Command:', error.command);
    process.exit(1);
  }
}

testGmail();
