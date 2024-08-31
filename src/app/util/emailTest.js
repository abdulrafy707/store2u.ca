import { sendVerificationEmail } from './sendVerificationEmail';

(async () => {
  try {
    await sendVerificationEmail('pulsifyhealthcare@gmail.com', 'testtoken123');
    console.log('Test email sent successfully');
  } catch (error) {
    console.error('Test email failed:', error);
  }
})();
