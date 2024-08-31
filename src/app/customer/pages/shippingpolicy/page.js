import React from 'react';
import Head from 'next/head';

const ShippingPolicy = () => {
  return (
    <>
      <Head>
        <title>Shipping Policy - Store2U</title>
      </Head>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Shipping Policy</h1>
        <p className="text-sm text-gray-500 mb-4">Last Updated: 2-8-2024</p>
        <p className="mb-4">
          At Store2U, we strive to provide you with the best shopping experience possible. This shipping policy explains the terms under which we ship items purchased from our website, <a href="http://www.store2u.ca" className="text-blue-500 hover:underline">www.store2u.ca</a>.
        </p>

        <h2 className="text-2xl font-semibold mb-4">1. Shipping Methods</h2>
        <p className="mb-8">
          We offer various shipping methods to ensure your order reaches you in a timely manner. The available shipping methods and estimated delivery times will be displayed at checkout.
        </p>

        <h2 className="text-2xl font-semibold mb-4">2. Processing Time</h2>
        <p className="mb-8">
          Orders are processed within 1-2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.
        </p>

        <h2 className="text-2xl font-semibold mb-4">3. Shipping Rates</h2>
        <p className="mb-8">
          Shipping charges for your order will be calculated and displayed at checkout. We offer free shipping for orders over a certain amount, which will also be displayed at checkout.
        </p>

        <h2 className="text-2xl font-semibold mb-4">4. Delivery Time</h2>
        <p className="mb-8">
          Delivery times are estimates and start from the date of shipping rather than the date of order. Delivery times are to be used as a guide only and are subject to the acceptance and approval of your order.
        </p>

        <h2 className="text-2xl font-semibold mb-4">5. International Shipping</h2>
        <p className="mb-8">
          We offer international shipping to many countries. Shipping rates and delivery times for international orders will be calculated and displayed at checkout. Please note that you are responsible for any customs and import taxes that may apply to your order.
        </p>

        <h2 className="text-2xl font-semibold mb-4">6. Order Tracking</h2>
        <p className="mb-8">
          You will receive a shipment confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.
        </p>

        <h2 className="text-2xl font-semibold mb-4">7. Shipping Address</h2>
        <p className="mb-8">
          Please ensure that your shipping address is correct. We are not responsible for orders shipped to incorrect addresses provided by the customer. If you realize that you made an error in your shipping address, please contact us as soon as possible at <a href="mailto:support@store2u.ca" className="text-blue-500 hover:underline">support@store2u.ca</a>.
        </p>

        <h2 className="text-2xl font-semibold mb-4">8. Damages</h2>
        <p className="mb-8">
          Store2U is not liable for any products damaged or lost during shipping. If you received your order damaged, please contact the shipment carrier to file a claim. Please save all packaging materials and damaged goods before filing a claim.
        </p>

        <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about our shipping policy, please contact us at <a href="mailto:support@store2u.ca" className="text-blue-500 hover:underline">support@store2u.ca</a> or by mail at:
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
      </div>
    </>
  );
};

export default ShippingPolicy;

