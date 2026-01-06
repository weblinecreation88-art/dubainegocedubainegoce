import React from 'react';

// This function tells Next.js not to pre-render any static invoice pages.
// Invoices are typically dynamic and user-specific, fetched at runtime.
export async function generateStaticParams() {
  return [];
}

interface InvoicePageProps {
  params: {
    orderId: string;
  };
}

const InvoicePage: React.FC<InvoicePageProps> = ({ params }) => {
  const { orderId } = params;

  return (
    <div>
      <h1>Invoice for Order ID: {orderId}</h1>
      <p>This page is currently a placeholder. Invoice details will be loaded dynamically.</p>
      {/* TODO: Implement client-side data fetching for invoice details here */}
    </div>
  );
};

export default InvoicePage;
