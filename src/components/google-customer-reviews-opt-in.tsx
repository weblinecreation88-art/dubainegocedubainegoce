'use client';

import { useEffect } from 'react';

interface GoogleCustomerReviewsOptInProps {
  merchantId: number;
  orderId: string;
  email: string;
  deliveryCountry: string;
  estimatedDeliveryDate: string;
  products?: Array<{ gtin: string }>;
}

export function GoogleCustomerReviewsOptIn({
  merchantId,
  orderId,
  email,
  deliveryCountry,
  estimatedDeliveryDate,
  products = [],
}: GoogleCustomerReviewsOptInProps) {
  useEffect(() => {
    // Ensure window.gapi and window.gapi.surveyoptin are available
    // This will be called by the platform.js script once loaded in layout.tsx
    // @ts-ignore
    window.renderOptIn = function() {
      // @ts-ignore
      if (window.gapi && window.gapi.load) {
        // @ts-ignore
        window.gapi.load('surveyoptin', function() {
          // @ts-ignore
          window.gapi.surveyoptin.render(
            {
              "merchant_id": merchantId,
              "order_id": orderId,
              "email": email,
              "delivery_country": deliveryCountry,
              "estimated_delivery_date": estimatedDeliveryDate,
              "products": products,
            }
          );
        });
      }
    };

    // Cleanup function if component unmounts
    return () => {
      // @ts-ignore
      if (window.renderOptIn) {
        // @ts-ignore
        delete window.renderOptIn;
      }
    };
  }, [merchantId, orderId, email, deliveryCountry, estimatedDeliveryDate, products]);

  return null; // This component does not render anything visible
}

