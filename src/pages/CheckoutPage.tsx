import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { ShieldCheck, Lock, CreditCard, ArrowLeft } from 'lucide-react';

interface CheckoutPageProps {
  onNavigate: (route: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { cart, user, refreshCart, showToast } = useApp();

  const [customerEmail, setCustomerEmail] = useState(user?.email || 'claire.chen@fashion.com');
  const [customerName, setCustomerName] = useState(user?.name || 'Claire Chen');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+1 (555) 234-8901');

  // Address
  const [street, setStreet] = useState('740 Park Avenue');
  const [apartment, setApartment] = useState('Penthouse B');
  const [city, setCity] = useState('New York');
  const [state, setState] = useState('NY');
  const [postalCode, setPostalCode] = useState('10021');
  const [country, setCountry] = useState('United States');

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const tax = cart?.tax || 0;
  const shipping = cart?.shipping || 0;
  const total = cart?.total || 0;

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <h2 className="font-serif text-2xl text-[#1A1A1A]">Your Bag is Empty</h2>
        <p className="text-xs text-[#7A7469]">Add garments or accessories before proceeding to checkout.</p>
        <button
          onClick={() => onNavigate('/shop')}
          className="px-5 py-2.5 bg-[#1A1A1A] text-[#FAF9F5] text-xs uppercase tracking-wider font-semibold"
        >
          Return to Storefront
        </button>
      </div>
    );
  }

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage('');

    try {
      // Step 1: Create Order in DB (this atomically reserves inventory)
      const orderPayload = {
        userId: user?.id,
        customerEmail,
        customerName,
        customerPhone,
        shippingAddress: {
          id: `addr_${Date.now()}`,
          fullName: customerName,
          street,
          apartment,
          city,
          state,
          postalCode,
          country
        },
        cartId: cart?.id || 'atelier_cart_session_1',
        paymentMethod: 'paystack'
      };

      const { order } = await api.createOrder(orderPayload);

      // Step 2: Initialize Payment via Paystack Abstraction
      const paymentInit = await api.initializePayment({
        amount: order.total,
        email: customerEmail,
        metadata: {
          type: 'ORDER',
          targetId: order.id,
          userId: user?.id
        }
      });

      // Step 3: Server-side Payment Verification
      await api.verifyPayment(paymentInit.reference, {
        type: 'ORDER',
        targetId: order.id,
        userId: user?.id
      });

      // Step 4: Refresh cart and navigate to order detail
      await refreshCart();
      showToast('Payment confirmed! Order registered in atelier ledger.');
      onNavigate(`/orders/${order.id}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Checkout failed. Stock or payment rejected.');
      showToast(err.message || 'Payment failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="flex items-center justify-between border-b border-[#E8E3D8] pb-4">
        <div>
          <button
            onClick={() => onNavigate('/cart')}
            className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#7A7469] hover:text-[#1A1A1A] mb-1"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Wardrobe Bag
          </button>
          <h1 className="font-serif text-3xl text-[#1A1A1A]">Atelier Checkout</h1>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#7A7469]">
          <Lock className="w-3.5 h-3.5 text-[#C2A676]" />
          <span>Paystack 256-Bit SSL Encrypted</span>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-xs">
          <strong>Checkout Error:</strong> {errorMessage}
        </div>
      )}

      <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Form: Customer & Shipping (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl text-[#1A1A1A] border-b border-[#EBE6DC] pb-2">
              01. Client Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#666] font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#D8D2C5] px-3 py-2 rounded focus:outline-hidden focus:border-[#1A1A1A]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#666] font-medium mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#D8D2C5] px-3 py-2 rounded focus:outline-hidden focus:border-[#1A1A1A]"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] uppercase tracking-wider text-[#666] font-medium mb-1">
                  Private Email Address (Receipt & Tracking)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#D8D2C5] px-3 py-2 rounded focus:outline-hidden focus:border-[#1A1A1A]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl text-[#1A1A1A] border-b border-[#EBE6DC] pb-2">
              02. Destination Address
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-[11px] uppercase tracking-wider text-[#666] font-medium mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#D8D2C5] px-3 py-2 rounded focus:outline-hidden focus:border-[#1A1A1A]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#666] font-medium mb-1">
                  Apartment / Suite (Optional)
                </label>
                <input
                  type="text"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#D8D2C5] px-3 py-2 rounded focus:outline-hidden focus:border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#666] font-medium mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#D8D2C5] px-3 py-2 rounded focus:outline-hidden focus:border-[#1A1A1A]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#666] font-medium mb-1">
                  State / Province
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#D8D2C5] px-3 py-2 rounded focus:outline-hidden focus:border-[#1A1A1A]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#666] font-medium mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#D8D2C5] px-3 py-2 rounded focus:outline-hidden focus:border-[#1A1A1A]"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] uppercase tracking-wider text-[#666] font-medium mb-1">
                  Country
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#D8D2C5] px-3 py-2 rounded focus:outline-hidden focus:border-[#1A1A1A]"
                >
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="France">France</option>
                  <option value="Italy">Italy</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Canada">Canada</option>
                  <option value="Germany">Germany</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment Method Badge */}
          <div className="space-y-3">
            <h3 className="font-serif text-xl text-[#1A1A1A] border-b border-[#EBE6DC] pb-2">
              03. Payment Architecture
            </h3>
            <div className="p-4 bg-[#F5F2EB] border border-[#D8D2C5] rounded flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-[#C2A676]" />
                <div>
                  <span className="text-xs font-semibold text-[#1A1A1A] block">
                    Paystack Secure Payment Gateway
                  </span>
                  <span className="text-[11px] text-[#7A7469]">
                    Credit Cards, Debit Cards, Apple Pay, Bank Transfer
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 bg-[#E8E2D5] text-[#1A1A1A]">
                VERIFIED
              </span>
            </div>
          </div>
        </div>

        {/* Right Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FAF9F5] border border-[#E8E3D8] p-6 space-y-5 sticky top-28">
            <h3 className="font-serif text-xl text-[#1A1A1A]">Order Summary ({items.length})</h3>

            {/* Mini list */}
            <div className="divide-y divide-[#EBE6DC] max-h-64 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="py-3 flex gap-3 text-xs">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-16 object-cover bg-[#F0EDE6] border border-[#E5E0D5]"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-[#1A1A1A] line-clamp-1">{item.product.name}</p>
                    <p className="text-[11px] text-[#7A7469]">
                      {item.variant.color} · Size {item.variant.size} × {item.quantity}
                    </p>
                    <p className="text-xs font-semibold text-[#1A1A1A] mt-1 tabular-nums">
                      ${(item.variant.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs text-[#554F44] border-t border-[#E8E3D8] pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="tabular-nums font-medium text-[#1A1A1A]">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Atelier Tax</span>
                <span className="tabular-nums text-[#1A1A1A]">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Insured Courier Delivery</span>
                <span className="tabular-nums text-[#1A1A1A]">
                  {shipping === 0 ? 'Complimentary' : `$${shipping}`}
                </span>
              </div>
              <div className="border-t border-[#E8E3D8] pt-2 flex justify-between text-base font-semibold text-[#1A1A1A]">
                <span>Total Due</span>
                <span className="font-serif text-xl tabular-nums">${total.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-[#1A1A1A] text-[#FAF9F5] hover:bg-[#333] transition-colors text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-lg disabled:bg-[#888]"
            >
              {isProcessing ? 'Processing Transaction...' : `Authorize & Pay $${total.toLocaleString()}`}
            </button>

            <div className="pt-2 text-[10px] text-[#7A7469] text-center space-y-1">
              <p>By placing this order you accept the Atelier Terms of Savoir-Faire.</p>
              <p className="text-[#A89F90]">Direct Paystack Integration · 100% Idempotent Payment Guarantee</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
