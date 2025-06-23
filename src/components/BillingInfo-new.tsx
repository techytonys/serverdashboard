"use client";

import { useState, useEffect } from "react";
import { BillingInfo as BillingData, Invoice } from "@/types/linode";

export default function BillingInfo() {
  const [billing, setBilling] = useState<BillingData | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCharges, setCurrentCharges] = useState(0);

  useEffect(() => {
    fetchBillingInfo();
    // Update current charges every 5 seconds for real-time effect
    const interval = setInterval(updateCurrentCharges, 5000);
    return () => clearInterval(interval);
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
        // Mock data for development
        setBilling({
          balance: 25.47,
          balance_uninvoiced: 8.92,
          active_since: "2024-01-01T00:00:00Z",
        });

        // Mock invoices
        setInvoices([
          {
            id: 12345,
            date: "2024-12-01T00:00:00Z",
            label: "Invoice for December 2024",
            subtotal: 45.5,
            tax: 3.64,
            total: 49.14,
          },
          {
            id: 12344,
            date: "2024-11-01T00:00:00Z",
            label: "Invoice for November 2024",
            subtotal: 38.2,
            tax: 3.06,
            total: 41.26,
          },
          {
            id: 12343,
            date: "2024-10-01T00:00:00Z",
            label: "Invoice for October 2024",
            subtotal: 52.3,
            tax: 4.18,
            total: 56.48,
          },
        ]);
      }
    } catch (err) {
      setError("Failed to fetch billing information");
    } finally {
      setLoading(false);
    }
  };

  const updateCurrentCharges = () => {
    // Simulate real-time charge accumulation
    setCurrentCharges((prev) => prev + Math.random() * 0.02);
  };

  const downloadInvoice = (invoiceId: number) => {
    // Mock download functionality
    const invoice = invoices.find((inv) => inv.id === invoiceId);
    if (invoice) {
      // Create a mock PDF download
      const element = document.createElement("a");
      const file = new Blob(
        [`Invoice ${invoiceId} - ${invoice.label}\nTotal: $${invoice.total}`],
        { type: "text/plain" }
      );
      element.href = URL.createObjectURL(file);
      element.download = `invoice-${invoiceId}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  if (loading) {
    return (
      <div className="billing-loading">
        <div className="loading-spinner"></div>
        <p>Loading your billing dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="billing-error">
        <div className="error-icon">⚠️</div>
        <h3>Unable to load billing information</h3>
        <p>{error}</p>
        <button className="btn-retry" onClick={fetchBillingInfo}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="billing-dashboard">
      {/* Header Section */}
      <div className="billing-header">
        <div className="billing-title">
          <h1>💳 Billing Dashboard</h1>
          <p>Manage your account and view usage</p>
        </div>
        <div className="billing-actions">
          <button className="btn-primary-modern">💾 Export Report</button>
          <button className="btn-secondary-modern">⚙️ Billing Settings</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="billing-summary">
        <div className="summary-card balance-card">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3>Account Balance</h3>
            <div className="balance-amount">
              ${billing?.balance?.toFixed(2) || "0.00"}
            </div>
            <p className="balance-status">
              {(billing?.balance || 0) > 0
                ? "Credit Available"
                : "Current Balance"}
            </p>
          </div>
        </div>

        <div className="summary-card charges-card">
          <div className="card-icon">⚡</div>
          <div className="card-content">
            <h3>Current Period Charges</h3>
            <div className="charges-amount">
              ${(billing?.balance_uninvoiced || 0 + currentCharges).toFixed(4)}
            </div>
            <p className="charges-status">
              <span className="live-indicator"></span>
              Live Usage
            </p>
          </div>
        </div>

        <div className="summary-card payment-card">
          <div className="card-icon">💳</div>
          <div className="card-content">
            <h3>Payment Method</h3>
            <div className="payment-method">
              {billing?.credit_card
                ? `•••• ${billing.credit_card.last_four}`
                : "Credit Card"}
            </div>
            <p className="payment-status">Active</p>
          </div>
        </div>

        <div className="summary-card forecast-card">
          <div className="card-icon">📊</div>
          <div className="card-content">
            <h3>Monthly Forecast</h3>
            <div className="forecast-amount">
              ${((billing?.balance_uninvoiced || 0) * 2.5).toFixed(2)}
            </div>
            <p className="forecast-trend">📈 +12% vs last month</p>
          </div>
        </div>
      </div>

      {/* Invoices Section */}
      <div className="invoices-section">
        <div className="section-header">
          <h2>📋 Recent Invoices</h2>
          <button className="btn-view-all">View All Invoices</button>
        </div>

        <div className="invoices-grid">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="invoice-card">
              <div className="invoice-header">
                <div className="invoice-info">
                  <h4>Invoice #{invoice.id}</h4>
                  <p className="invoice-date">
                    {new Date(invoice.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="invoice-status">
                  <span className="status-badge paid">Paid</span>
                </div>
              </div>

              <div className="invoice-details">
                <div className="invoice-line">
                  <span>Subtotal</span>
                  <span>${invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="invoice-line">
                  <span>Tax</span>
                  <span>${invoice.tax.toFixed(2)}</span>
                </div>
                <div className="invoice-line total">
                  <span>Total</span>
                  <span>${invoice.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="invoice-actions">
                <button
                  className="btn-download"
                  onClick={() => downloadInvoice(invoice.id)}
                >
                  📥 Download PDF
                </button>
                <button className="btn-view">👁️ View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Chart Placeholder */}
      <div className="usage-section">
        <div className="section-header">
          <h2>📈 Usage Trends</h2>
          <div className="time-filters">
            <button className="filter-btn active">7 Days</button>
            <button className="filter-btn">30 Days</button>
            <button className="filter-btn">90 Days</button>
          </div>
        </div>

        <div className="usage-chart">
          <div className="chart-placeholder">
            <div className="chart-bars">
              <div className="bar" style={{ height: "60%" }}></div>
              <div className="bar" style={{ height: "80%" }}></div>
              <div className="bar" style={{ height: "45%" }}></div>
              <div className="bar" style={{ height: "90%" }}></div>
              <div className="bar" style={{ height: "70%" }}></div>
              <div className="bar" style={{ height: "85%" }}></div>
              <div className="bar" style={{ height: "95%" }}></div>
            </div>
            <p className="chart-label">Daily Usage ($)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
