import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        alert(error.message);
        return;
      }

      setOrders(data || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function openOrderDetails(order) {
    setSelectedOrder(order);

    const { data, error } = await supabase
      .from("order_files")
      .select("*")
      .eq("order_id", order.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setSelectedFiles([]);
      return;
    }

    setSelectedFiles(data || []);
  }

  async function updateOrderField(orderId, updates) {
    const { error } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", orderId);

    if (error) {
      alert(error.message);
      return;
    }

    await loadOrders();

    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => ({ ...prev, ...updates }));
    }
  }

  return (
    <div className="admin-two-column">
      <div className="table-card">
        <h3>Orders</h3>

        {loading ? <div className="login-note">Loading orders...</div> : null}

        <div className="referral-list">
          {orders.map((order) => (
            <div className="referral-row" key={order.id}>
              <div>
                <div className="referral-name">
                  {order.customer_name || "Customer"} - {order.job_number || "-"}
                </div>
                <div className="referral-meta">
                  ₹{order.final_amount || order.total_amount || 0} |{" "}
                  {order.payment_status || "Pending"} |{" "}
                  {order.status || "Received"}
                </div>
              </div>

              <div className="form-actions">
                <button
                  className="btn btn-ghost small-btn"
                  type="button"
                  onClick={() => openOrderDetails(order)}
                >
                  Open
                </button>

                <button
                  className="btn btn-ghost small-btn"
                  type="button"
                  onClick={() => updateOrderField(order.id, { status: "In Progress" })}
                >
                  In Progress
                </button>

                <button
                  className="btn btn-ghost small-btn"
                  type="button"
                  onClick={() => updateOrderField(order.id, { status: "Delivered" })}
                >
                  Delivered
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="table-card">
        <h3>Order Details</h3>

        {!selectedOrder ? (
          <div className="login-note">Select an order to view details.</div>
        ) : (
          <>
            <div className="admin-detail-grid">
              <div className="admin-detail-item">
                <span className="dash-label">Job Number</span>
                <strong>{selectedOrder.job_number || "-"}</strong>
              </div>

              <div className="admin-detail-item">
                <span className="dash-label">Customer</span>
                <strong>{selectedOrder.customer_name || "-"}</strong>
              </div>

              <div className="admin-detail-item">
                <span className="dash-label">Email</span>
                <strong>{selectedOrder.email || "-"}</strong>
              </div>

              <div className="admin-detail-item">
                <span className="dash-label">Phone</span>
                <strong>{selectedOrder.phone || "-"}</strong>
              </div>

              <div className="admin-detail-item">
                <span className="dash-label">Location</span>
                <strong>{selectedOrder.location || "-"}</strong>
              </div>

              <div className="admin-detail-item">
                <span className="dash-label">Template</span>
                <strong>{selectedOrder.template_name || selectedOrder.template_id || "-"}</strong>
              </div>

              <div className="admin-detail-item">
                <span className="dash-label">Package</span>
                <strong>{selectedOrder.package_name || selectedOrder.package_id || "-"}</strong>
              </div>

              <div className="admin-detail-item">
                <span className="dash-label">Package Price</span>
                <strong>₹{selectedOrder.package_price || 0}</strong>
              </div>

              <div className="admin-detail-item">
                <span className="dash-label">Referral Code</span>
                <strong>{selectedOrder.referral_code || "-"}</strong>
              </div>

              <div className="admin-detail-item">
                <span className="dash-label">Referral Discount</span>
                <strong>₹{selectedOrder.referral_discount || selectedOrder.discount || 0}</strong>
              </div>

              <div className="admin-detail-item">
                <span className="dash-label">Final Amount</span>
                <strong>₹{selectedOrder.final_amount || selectedOrder.total_amount || 0}</strong>
              </div>
            </div>

            <div className="admin-status-actions">
              <div className="field-block">
                <label className="field-label">Order Status</label>
                <select
                  className="field-input"
                  value={selectedOrder.status || "Received"}
                  onChange={(e) =>
                    updateOrderField(selectedOrder.id, { status: e.target.value })
                  }
                >
                  <option value="Received">Received</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Due Tomorrow">Due Tomorrow</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              <div className="field-block">
                <label className="field-label">Payment Status</label>
                <select
                  className="field-input"
                  value={selectedOrder.payment_status || "Pending"}
                  onChange={(e) =>
                    updateOrderField(selectedOrder.id, {
                      payment_status: e.target.value,
                    })
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
            </div>

            <div className="table-card inner-card">
              <h3>Submitted Form Data</h3>

              <div className="json-view">
                {selectedOrder.form_data ? (
                  Object.entries(selectedOrder.form_data).map(([key, value]) => (
                    <div className="json-row" key={key}>
                      <span>{key}</span>
                      <strong>{String(value)}</strong>
                    </div>
                  ))
                ) : (
                  <div className="login-note">No form data found.</div>
                )}
              </div>
            </div>

            <div className="table-card inner-card">
              <h3>Attached Files</h3>

              <div className="referral-list">
                {selectedFiles.length === 0 ? (
                  <div className="login-note">No attached files.</div>
                ) : (
                  selectedFiles.map((file) => (
                    <div className="referral-row" key={file.id}>
                      <div>
                        <div className="referral-name">{file.file_name}</div>
                        <div className="referral-meta">Uploaded file</div>
                      </div>

                      <button
                        className="btn btn-ghost small-btn"
                        type="button"
                        onClick={() => window.open(file.file_url, "_blank")}
                      >
                        Download
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}