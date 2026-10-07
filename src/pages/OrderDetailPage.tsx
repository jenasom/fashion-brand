import React, { useEffect, useState } from 'react';
import { Order } from '../types/index';
import { api } from '../services/api';
import { CheckCircle2, Clock, Truck, Package, ArrowRight, Printer } from 'lucide-react';

interface OrderDetailPageProps {
  orderId: string;
  onNavigate: (route: string) => void;
}

export const OrderDetailPage: React.FC<OrderDetailPageProps> = ({ orderId, onNavigate }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.getOrder(orderId);
        setOrder(res.order);
      } catch (err) {
        console.warn('Failed to load order', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <p className="font-serif text-lg text-[#7A7469] animate-pulse">Retrieving order details from atelier ledger...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl text-[#1A1A1A]">Order Not Found</h2>
        <p className="text-xs text-[#7A7469]">Unable to locate order reference in database.</p>
        <button
          onClick={() => onNavigate('/shop')}
          className="px-5 py-2.5 bg-[#1A1A1A] text-white text-xs uppercase tracking-wider font-semibold"
        >
          Return to Storefront
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Success banner */}
      <div className="bg-[#FAF9F5] border border-[#E8E3D8] p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-[#EBF3E8] text-[#3F7535] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#C2A676] font-semibold block">
          Order Confirmed & Paid
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A]">
          Thank you, {order.customerName.split(' ')[0]}
        </h1>
        <p className="text-xs text-[#666055] max-w-md mx-auto leading-relaxed">
          Order <strong>#{order.orderNumber}</strong> has been verified. Your garments are currently being prepared
          by our master tailors. A comprehensive receipt has been sent to <strong>{order.customerEmail}</strong>.
        </p>

        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 border border-[#D8D2C5] bg-white text-xs text-[#1A1A1A] rounded hover:bg-[#F2EFE9] flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Print Atelier Receipt
          </button>
        </div>
      </div>

      {/* Order Timeline (Audit Trail) */}
      <div className="bg-[#FAF9F5] border border-[#E8E3D8] p-6 sm:p-8 space-y-6">
        <h3 className="font-serif text-xl text-[#1A1A1A]">Fulfillment & Production Timeline</h3>
        <div className="space-y-4">
          {order.timeline.map((step, idx) => (
            <div key={idx} className="flex items-start gap-4 text-xs">
              <div className="w-7 h-7 rounded-full bg-[#1A1A1A] text-[#FAF9F5] flex items-center justify-center shrink-0 mt-0.5 font-medium text-[11px]">
                {idx + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#1A1A1A] uppercase tracking-wider text-[11px]">
                    {step.status}
                  </span>
                  <span className="text-[10px] text-[#8C8476]">
                    {new Date(step.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-[#666055] mt-0.5">{step.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Itemized Order Details */}
      <div className="bg-[#FAF9F5] border border-[#E8E3D8] p-6 sm:p-8 space-y-6">
        <h3 className="font-serif text-xl text-[#1A1A1A]">Purchased Items ({order.items.length})</h3>
        <div className="divide-y divide-[#EBE6DC]">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-4 flex gap-4 text-xs">
              <img
                src={item.imageUrl || 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=200&q=80'}
                alt={item.name}
                className="w-16 h-20 object-cover bg-[#F0EDE6] border border-[#E5E0D5]"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-medium text-[#1A1A1A]">{item.name}</h4>
                  <p className="text-[11px] text-[#7A7469]">
                    Color: {item.color} · Size: {item.size} · SKU: {item.sku}
                  </p>
                  <p className="text-xs text-[#7A7469]">Qty: {item.quantity}</p>
                </div>
                <p className="font-serif text-sm font-medium text-[#1A1A1A] tabular-nums">
                  ${(item.unitPrice * item.quantity).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Financial Breakdown */}
        <div className="border-t border-[#E8E3D8] pt-4 space-y-2 text-xs text-[#554F44]">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="tabular-nums font-medium">${order.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Estimated Atelier Tax</span>
            <span className="tabular-nums">${order.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Insured Courier Shipping</span>
            <span className="tabular-nums">
              {order.shippingCost === 0 ? 'Complimentary' : `$${order.shippingCost}`}
            </span>
          </div>
          <div className="border-t border-[#E8E3D8] pt-2 flex justify-between text-base font-semibold text-[#1A1A1A]">
            <span>Total Paid</span>
            <span className="font-serif text-xl tabular-nums">${order.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Shipping destination */}
      <div className="bg-[#FAF9F5] border border-[#E8E3D8] p-6 text-xs text-[#554F44] space-y-2">
        <h4 className="font-serif text-lg text-[#1A1A1A]">Shipping Destination</h4>
        <p className="font-medium text-[#1A1A1A]">{order.shippingAddress.fullName}</p>
        <p>
          {order.shippingAddress.street}
          {order.shippingAddress.apartment && `, ${order.shippingAddress.apartment}`}
        </p>
        <p>
          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
        </p>
        <p>{order.shippingAddress.country}</p>
      </div>

      {/* Next Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          onClick={() => onNavigate('/shop')}
          className="flex-1 py-3 bg-[#1A1A1A] text-[#FAF9F5] hover:bg-[#333] transition-colors text-xs uppercase tracking-wider font-semibold text-center"
        >
          Continue Shopping
        </button>
        <button
          onClick={() => onNavigate('/academy')}
          className="flex-1 py-3 border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors text-xs uppercase tracking-wider font-semibold text-center flex items-center justify-center gap-1.5"
        >
          Explore Fashion Academy <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
