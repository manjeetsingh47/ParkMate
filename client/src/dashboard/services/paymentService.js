
const PAYMENT_MODE = import.meta.env.VITE_PAYMENT_MODE || "mock";
const API_URL = import.meta.env.VITE_API_URL || "";

async function postRequest(endpoint, body) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Payment request failed.");
  }

  return data;
}

function createDemoPaymentResult() {
  return {
    success: true,
    status: "paid",
    paymentId: `DEMO-${Date.now()}`,
    provider: "mock",
    message: "Demo payment successful. No money was charged.",
  };
}

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = () =>
      reject(new Error("Could not load the payment gateway."));

    document.body.appendChild(script);
  });
}

async function startRazorpayPayment({
  bookingId,
  amount,
  customer = {},
}) {
  // The backend must create the order and calculate/validate the amount.
  const order = await postRequest("/api/payments/create-order", {
    bookingId,
  });

  if (!order.orderId || !order.keyId) {
    throw new Error("The backend returned incomplete payment order details.");
  }

  await loadRazorpayScript();

  return new Promise((resolve, reject) => {
    const checkout = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency || "INR",
      name: "ParkMate",
      description: "Parking booking payment",
      order_id: order.orderId,

      prefill: {
        name: customer.name || "",
        email: customer.email || "",
        contact: customer.phone || "",
      },

      theme: {
        color: "#0b8a4a",
      },

      handler: async (gatewayResponse) => {
        try {
          // Never mark a real payment successful until the backend verifies it.
          const verification = await postRequest(
            "/api/payments/verify",
            {
              bookingId,
              razorpay_order_id: gatewayResponse.razorpay_order_id,
              razorpay_payment_id: gatewayResponse.razorpay_payment_id,
              razorpay_signature: gatewayResponse.razorpay_signature,
            }
          );

          if (
            verification.verified !== true &&
            verification.status !== "paid"
          ) {
            resolve({
              success: false,
              status: "failed",
              message: "Payment verification failed.",
            });
            return;
          }

          resolve({
            success: true,
            status: "paid",
            paymentId: gatewayResponse.razorpay_payment_id,
            provider: "razorpay",
            message: "Payment verified successfully.",
          });
        } catch (error) {
          reject(error);
        }
      },

      modal: {
        ondismiss: () => {
          resolve({
            success: false,
            status: "cancelled",
            message: "Payment was cancelled.",
          });
        },
      },
    });

    checkout.on("payment.failed", (event) => {
      resolve({
        success: false,
        status: "failed",
        message:
          event.error?.description || "Payment could not be completed.",
      });
    });

    checkout.open();
  });
}

export async function processOnlinePayment({
  bookingId,
  amount,
  customer,
}) {
  if (!bookingId || !amount || Number(amount) <= 0) {
    throw new Error("Valid booking details are required for payment.");
  }

  if (PAYMENT_MODE === "mock") {
    // Demo only: no real transaction or money deduction.
    return createDemoPaymentResult();
  }

  if (PAYMENT_MODE === "razorpay") {
    return startRazorpayPayment({
      bookingId,
      amount,
      customer,
    });
  }

  throw new Error("Unsupported payment mode.");
}
