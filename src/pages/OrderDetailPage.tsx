import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageTransition from "../components/ui/PageTransition";
import { Loader2, ArrowLeft, Package, MapPin, CreditCard } from "lucide-react";
import type { UserOrder, Shoe } from "../types";

interface OrderItemShoe extends Shoe {
  __item?: {
    name: string;
    brand: string;
    images: string[];
    price: number;
  };
}

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, isLoading, token } = useAuth();
  const [order, setOrder] = useState<UserOrder | null>(null);
  const [orderLoading, setOrderLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!token || !id) {
        setOrderLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:1337/api"}/orders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch order");
        }

        const data = await response.json();
        setOrder(data.data || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load order");
      } finally {
        setOrderLoading(false);
      }
    };

    fetchOrder();
  }, [token, id]);

  if (isLoading || orderLoading) {
    return (
      <PageTransition>
        <div className="max-w-4xl mx-auto px-4 py-16 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </PageTransition>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (error || !order) {
    return (
      <PageTransition>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Orders
          </Link>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <p className="text-red-500">{error || "Order not found"}</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAddressString = (address: Record<string, string> | undefined) => {
    if (!address) return "Not provided";
    return `${address.street || ""}, ${address.city || ""}, ${address.state || ""} ${address.zipCode || ""}, ${address.country || ""}`;
  };

  const items = order.items || [];
  const shippingAddress = order.shippingAddress as unknown as
    | Record<string, string>
    | undefined;
  const billingAddress = order.billingAddress as unknown as
    | Record<string, string>
    | undefined;

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Orders
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Order #{order.orderNumber}</h1>
            <p className="text-gray-500 mt-1">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
              order.status,
            )}`}
          >
            {formatStatus(order.status)}
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Order Items
          </h2>

          <div className="space-y-4">
            {items.map((item, index) => {
              const shoeData =
                (item.shoe as unknown as OrderItemShoe)?.__item || item.shoe;
              const shoeName =
                shoeData?.name || item.shoe?.name || "Unknown Product";
              const shoeBrand = shoeData?.brand || item.shoe?.brand || "";
              const shoeImage =
                shoeData?.images?.[0] || item.shoe?.images?.[0] || "";
              const shoePrice = shoeData?.price || item.price;

              return (
                <div
                  key={index}
                  className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                    {shoeImage && (
                      <img
                        src={shoeImage}
                        alt={shoeName}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{shoeName}</p>
                    {shoeBrand && (
                      <p className="text-sm text-gray-600">{shoeBrand}</p>
                    )}
                    <p className="text-sm text-gray-600">
                      Size: {item.size} | Color: {item.color} | Quantity:{" "}
                      {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      ${((shoePrice || item.price) * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      ${(shoePrice || item.price).toFixed(2)} each
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Shipping Address
            </h2>
            <p className="text-gray-600 whitespace-pre-line">
              {getAddressString(shippingAddress)}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Billing Address
            </h2>
            <p className="text-gray-600 whitespace-pre-line">
              {getAddressString(billingAddress)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment & Summary
          </h2>

          <div className="mb-4">
            <p className="text-sm text-gray-600">Payment Method</p>
            <p className="font-medium">
              {order.paymentMethod || "Not specified"}
            </p>
          </div>

          <div className="space-y-3 border-t border-gray-100 pt-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${order.subtotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>
                {order.shipping === 0 ? (
                  <span className="text-green-600 font-medium">FREE</span>
                ) : (
                  `$${order.shipping?.toFixed(2)}`
                )}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>${order.tax?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center border-t border-gray-200 pt-3">
              <span className="text-xl font-bold">Total Paid</span>
              <span className="text-2xl font-bold text-primary">
                ${order.total?.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
          <ul className="space-y-1 text-blue-800 text-sm">
            <li>Contact us if you have any questions about this order</li>
            <li>
              You can cancel or modify the order while status is "pending"
            </li>
          </ul>
        </div>
      </div>
    </PageTransition>
  );
};

export default OrderDetailPage;
