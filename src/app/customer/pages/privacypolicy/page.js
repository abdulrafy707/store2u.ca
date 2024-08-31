import React from 'react';
import Head from 'next/head';

const PrivacyPolicy = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy - Store2U</title>
      </Head>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-4">Last Updated: 2-8-2024</p>
        <p className="mb-4">
          Welcome to Store2U! Your privacy is critically important to us. This privacy policy explains how we collect, use, disclose, and protect your personal information when you visit or make a purchase from <a href="http://www.store2u.ca" className="text-blue-500 hover:underline">www.store2u.ca</a>.
        </p>

        <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
        <h3 className="text-xl font-semibold mb-2">Personal Information:</h3>
        <p className="mb-4">
          When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device. Additionally, as you browse the Site, we collect information about the individual web pages or products that you view, what websites or search terms referred you to the Site, and information about how you interact with the Site. We refer to this automatically-collected information as “Device Information.”
        </p>

        <h3 className="text-xl font-semibold mb-2">Order Information:</h3>
        <p className="mb-4">
          When you make a purchase or attempt to make a purchase through the Site, we collect certain information from you, including your name, billing address, shipping address, payment information (including credit card numbers), email address, and phone number. We refer to this information as “Order Information.”
        </p>

        <h3 className="text-xl font-semibold mb-2">Account Information:</h3>
        <p className="mb-8">
          If you create an account on our Site, we collect your username, password, and email address.
        </p>

        <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
        <p className="mb-8">
          We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations). Additionally, we use this Order Information to:
        </p>
        <ul className="list-disc list-inside mb-8">
          <li className="mb-2">Communicate with you;</li>
          <li className="mb-2">Screen our orders for potential risk or fraud; and</li>
          <li className="mb-2">When in line with the preferences you have shared with us, provide you with information or advertising relating to our products or services.</li>
        </ul>
        <p className="mb-8">
          We use the Device Information that we collect to help us screen for potential risk and fraud (in particular, your IP address), and more generally to improve and optimize our Site (for example, by generating analytics about how our customers browse and interact with the Site, and to assess the success of our marketing and advertising campaigns).
        </p>

        <h2 className="text-2xl font-semibold mb-4">3. Sharing Your Personal Information</h2>
        <p className="mb-8">
          We share your Personal Information with third parties to help us use your Personal Information, as described above. We also use Google Analytics to help us understand how our customers use the Site--you can read more about how Google uses your Personal Information here: <a href="https://policies.google.com/privacy" className="text-blue-500 hover:underline">https://policies.google.com/privacy</a>. You can also opt-out of Google Analytics here: <a href="https://accounts.google.com" className="text-blue-500 hover:underline">https://accounts.google.com</a>.
        </p>
        <p className="mb-8">
          Finally, we may also share your Personal Information to comply with applicable laws and regulations, to respond to a subpoena, search warrant, or other lawful requests for information we receive, or to otherwise protect our rights.
        </p>

        <h2 className="text-2xl font-semibold mb-4">4. Your Rights</h2>
        <p className="mb-8">
          If you are a European resident, you have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. If you would like to exercise this right, please contact us through the contact information below.
        </p>
        <p className="mb-8">
          Additionally, if you are a European resident, we note that we are processing your information in order to fulfill contracts we might have with you (for example, if you make an order through the Site), or otherwise to pursue our legitimate business interests listed above. Additionally, please note that your information will be transferred outside of Europe, including to Canada and the United States.
        </p>

        <h2 className="text-2xl font-semibold mb-4">5. Data Retention</h2>
        <p className="mb-8">
          When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information.
        </p>

        <h2 className="text-2xl font-semibold mb-4">6. Changes</h2>
        <p className="mb-8">
          We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons.
        </p>

        <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
        <p className="mb-4">
          For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by email at <a href="mailto:info@store2u.ca" className="text-blue-500 hover:underline">info@store2u.ca</a> or by mail using the details provided below:
        </p>
        <address className="mb-8">
          Store2U<br />
          Tahir Sajjad<br />
          15C 12street, Garden Town<br />
          Gojra, Punjab, Pakistan<br />
          56000<br />
          PAKISTAN<br />
          0092-3310356111<br />
          <a href="mailto:info@store2u.ca" className="text-blue-500 hover:underline">info@store2u.ca</a>
        </address>

        <p className="mb-4">
          <strong>Additional Notes:</strong> We have all the rights to collect your information which helps us to grow our business and use according to our need. We claimed that we are not involved in any information breach. Your privacy is our first priority and will not transfer to third person.
        </p>
      </div>
    </>
  );
};

export default PrivacyPolicy;
