import React from 'react';
import Head from 'next/head';

const Terms = () => {
  return (
    <>
      <Head>
        <title>Terms and Conditions - Store2U</title>
      </Head>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Terms and Conditions</h1>
        <p className="text-sm text-gray-500 mb-4">Last Updated: [Date]</p>
        <p className="mb-4">
          Welcome to Store2U! These terms and conditions outline the rules and regulations for the use of Store2U's website, located at <a href="http://www.store2u.com" className="text-blue-500 hover:underline">www.store2u.com</a> (the "Site").
        </p>
        <p className="mb-8">
          By accessing this website, we assume you accept these terms and conditions. Do not continue to use Store2U if you do not agree to take all of the terms and conditions stated on this page.
        </p>

        <h2 className="text-2xl font-semibold mb-4">1. Definitions</h2>
        <p className="mb-8">
          "Company," "We," "Our," "Us": Refers to Store2U.<br />
          "Customer," "User," "You": Refers to the person using our website.<br />
          "Products": Refers to the goods and services offered on the Site.
        </p>

        <h2 className="text-2xl font-semibold mb-4">2. Use of the Site</h2>
        <p className="mb-4">By using our Site, you agree to the following:</p>
        <ul className="list-disc list-inside mb-8">
          <li className="mb-2">You are at least 18 years of age or accessing the Site under the supervision of a parent or legal guardian.</li>
          <li className="mb-2">You will use the Site only for lawful purposes and in accordance with these terms and conditions.</li>
          <li className="mb-2">You will provide accurate and up-to-date information about yourself as prompted by the Site's registration forms.</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">3. Account Registration</h2>
        <p className="mb-8">
          To access certain features of the Site, you may be required to register for an account.<br />
          You are responsible for maintaining the confidentiality of your account information, including your password, and for all activities that occur under your account.
        </p>

        <h2 className="text-2xl font-semibold mb-4">4. Orders and Payments</h2>
        <p className="mb-8">
          By placing an order on the Site, you agree to provide current, complete, and accurate purchase and account information.<br />
          We reserve the right to refuse or cancel any order for any reason, including but not limited to product availability, errors in the description or price of the product, or errors in your order.<br />
          We accept various forms of payment, including credit cards and PayPal. All payments must be received before the shipment of the product.
        </p>

        <h2 className="text-2xl font-semibold mb-4">5. Shipping and Delivery</h2>
        <p className="mb-8">
          Shipping and delivery times are estimates and are not guaranteed. We are not responsible for any delays in shipping.<br />
          Risk of loss and title for products purchased from us pass to you upon delivery of the products to the carrier.
        </p>

        <h2 className="text-2xl font-semibold mb-4">6. Returns and Exchanges</h2>
        <p className="mb-8">Please refer to our Return and Exchange Policy for information on returns and exchanges.</p>

        <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
        <p className="mb-8">
          All content included on the Site, such as text, graphics, logos, images, and software, is the property of Store2U or its content suppliers and protected by copyright laws.<br />
          You may not use, reproduce, distribute, or create derivative works of any content on the Site without our express written permission.
        </p>

        <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
        <p className="mb-8">
          To the fullest extent permitted by law, Store2U shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from your use of the Site or purchase of products.
        </p>

        <h2 className="text-2xl font-semibold mb-4">9. Indemnification</h2>
        <p className="mb-8">
          You agree to indemnify, defend, and hold harmless Store2U and our affiliates, officers, directors, employees, agents, and suppliers from and against any claims, liabilities, damages, losses, costs, or expenses, including reasonable attorneys' fees, arising out of or in any way connected with your use of the Site or your violation of these terms and conditions.
        </p>

        <h2 className="text-2xl font-semibold mb-4">10. Changes to These Terms</h2>
        <p className="mb-8">
          We reserve the right to modify or replace these terms and conditions at any time. Your continued use of the Site following any changes constitutes your acceptance of the new terms.
        </p>

        <h2 className="text-2xl font-semibold mb-4">11. Governing Law</h2>
        <p className="mb-8">
          These terms and conditions are governed by and construed in accordance with the laws of [Your Country/State], and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
        </p>

        <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about these terms and conditions, please contact us at <a href="mailto:support@store2u.com" className="text-blue-500 hover:underline">support@store2u.com</a> or by mail at:
        </p>
        <address className="mb-8">
          Store2U<br />
          [Your Company Address]<br />
          [City, State, Zip Code]<br />
          [Country]
        </address>
      </div>
    </>
  );
};

export default Terms;
