"use client";

import { useState, useEffect } from "react";
import { BillingInfo as BillingData, Invoice } from "@/types/linode";

export default function BillingInfo() {
  const [billing, setBilling] = useState<BillingData | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBillingInfo();
  }, []);

  const fetchBillingInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/billing");
      const data = await response.json();

      if (data.success) {
        setBilling(data.data);
        setError(null);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to fetch billing information");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading billing information...</div>;
  }

  if (error) {
    return (
      <div>
        <div className="error">Error: {error}</div>
        <button className="btn btn-primary" onClick={fetchBillingInfo}>
          Retry
        </button>
      </div>
    );
  }

  if (!billing) {
    return <div className="error">No billing information available</div>;
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
          Billing Information
        </h2>
        <button className="btn btn-primary" onClick={fetchBillingInfo}>
          Refresh
        </button>
      </div>

      <div className="card-grid">
        <div className="card">
          <h3>Current Balance</h3>
          <div className="card-value">${billing.balance.toFixed(2)}</div>
          <div className="card-label">Account Balance</div>
        </div>

        <div className="card">
          <h3>Uninvoiced Balance</h3>
          <div className="card-value">
            ${billing.balance_uninvoiced.toFixed(2)}
          </div>
          <div className="card-label">Current Month Usage</div>
        </div>

        <div className="card">
          <h3>Account Active Since</h3>
          <div className="card-value">
            {new Date(billing.active_since).toLocaleDateString()}
          </div>
          <div className="card-label">Account Creation Date</div>
        </div>

        {billing.credit_card && (
          <div className="card">
            <h3>Payment Method</h3>
            <div className="card-value">
              **** {billing.credit_card.last_four}
            </div>
            <div className="card-label">
              Expires {billing.credit_card.expiry}
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h3
          style={{
            fontSize: "1.25rem",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          Recent Invoices
        </h3>

        {invoices.length === 0 ? (
          <div className="card">
            <p>No recent invoices available</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Subtotal</th>
                  <th>Tax</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>#{invoice.id}</td>
                    <td>{new Date(invoice.date).toLocaleDateString()}</td>
                    <td>{invoice.label}</td>
                    <td>${invoice.subtotal.toFixed(2)}</td>
                    <td>${invoice.tax.toFixed(2)}</td>
                    <td>${invoice.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
