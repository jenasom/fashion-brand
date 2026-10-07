import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

interface CartPageProps {
  onNavigate: (route: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const { cart, updateCartQuantity, removeCartItem, showToast } = useApp();
  const [couponCode, setCouponCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const discountAmount = discountApplied ? Math.round(subtotal * 0.1 * 100) / 100 : 0;
  const finalSubtotal = subtotal - discountAmount;
  const tax = Math.round(finalSubtotal * 0.08 * 100) / 100;
  const shipping = finalSubtotal > 500 || finalSubtotal === 0 ? 0 : 25;
  const total = Math.round((finalSubtotal + tax + shipping) * 100) / 100;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'ATELIER10') {
      setDiscountApplied(true);
      showToast('Atelier 10% privilege discount applied.');
    } else {
      showToast('Invalid atelier privilege code', 'error');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <ShoppingBag className="w-16 h-16 text-[#C5BBA8] mx-auto stroke-[1.2]" />
        <h1 className="font-serif text-3xl text-[#1A1A1A]">Your Wardrobe Bag is Empty</h1>
        <p className="text-xs text-[#7A7469] max-w-sm mx-auto">
          Explore our seasonal outerwear, silk eveningwear, and masterclass courses.
        </p>
        <button
          onClick={() => onNavigate('/shop')}
          className="mt-6 px-8 py-3.5 bg-[#1A1A1A] text-[#FAF9F5] text-xs uppercase tracking-widest font-semibold hover:bg-[#333] transition-colors"
        >
          Discover The Brand
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="border-b border-[#E8E3D8] pb-4">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#C2A676] font-semibold block mb-1">
          Review Selection
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-light">
          Your Wardrobe Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="divide-y divide-[#EBE6DC] border-y border-[#EBE6DC]">
            {items.map((item) => (
              <div key={item.id} className="py-6 flex flex-col sm:flex-row gap-6">
                <img
                  src={item.product.image || 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=300&q=80'}
                  alt={item.product.name}
                  className="w-24 h-32 object-cover bg-[#F0EDE6] border border-[#E5E0D5] shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3
                        onClick={() => onNavigate(`/shop/${item.product.slug}`)}
                        className="font-serif text-lg text-[#1A1A1A] hover:text-[#C2A676] cursor-pointer transition-colors"
                      >
                        {item.product.name}
                      </h3>
                      <span className="font-serif text-base font-medium text-[#1A1A1A] tabular-nums">
                        ${(item.variant.price * item.quantity).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs text-[#7A7469] mt-1">
                      Color: {item.variant.color} · Size: {item.variant.size} · SKU: {item.variant.sku}
                    </p>
                    <p className="text-xs text-[#8C8476] mt-0.5 tabular-nums">
                      ${item.variant.price.toLocaleString()} each
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-[#D8D2C5] rounded bg-[#FAF9F5]">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 text-xs text-[#4A453E] hover:bg-[#EBE6DC]"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-semibold tabular-nums">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 text-xs text-[#4A453E] hover:bg-[#EBE6DC]"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeCartItem(item.id)}
                      className="text-xs text-[#7A7469] hover:text-[#991B1B] flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-xs text-[#7A7469]">
            <span>Prices include French & Italian artisan atelier production fees.</span>
            <button
              onClick={() => onNavigate('/shop')}
              className="text-[#1A1A1A] font-semibold hover:text-[#C2A676] underline"
            >
              Continue Browsing
            </button>
          </div>
        </div>

        {/* Summary Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#FAF9F5] border border-[#E8E3D8] p-6 space-y-5">
            <h3 className="font-serif text-xl text-[#1A1A1A]">Order Summary</h3>

            <div className="space-y-2.5 text-xs text-[#554F44]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="tabular-nums font-medium text-[#1A1A1A]">${subtotal.toLocaleString()}</span>
              </div>

              {discountApplied && (
                <div className="flex justify-between text-[#3F7535]">
                  <span>Privilege Discount (10%)</span>
                  <span className="tabular-nums">-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Atelier Tax (8%)</span>
                <span className="tabular-nums text-[#1A1A1A]">${tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Insured White-Glove Shipping</span>
                <span className="tabular-nums text-[#1A1A1A]">
                  {shipping === 0 ? 'Complimentary' : `$${shipping}`}
                </span>
              </div>

              <div className="border-t border-[#E8E3D8] pt-3 flex justify-between text-base font-semibold text-[#1A1A1A]">
                <span>Total</span>
                <span className="font-serif text-xl tabular-nums">${total.toLocaleString()}</span>
              </div>
            </div>

            {/* Coupon form */}
            <form onSubmit={handleApplyCoupon} className="pt-2 flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Code: ATELIER10"
                className="flex-1 bg-[#F5F2EB] border border-[#D8D2C5] px-3 py-1.5 text-xs rounded uppercase"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#1A1A1A] text-[#FAF9F5] text-xs uppercase tracking-wider font-semibold hover:bg-[#333]"
              >
                Apply
              </button>
            </form>

            <button
              onClick={() => onNavigate('/checkout')}
              className="w-full py-3.5 bg-[#1A1A1A] text-[#FAF9F5] hover:bg-[#333] transition-colors text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-md"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 border-t border-[#E8E3D8] text-[11px] text-[#7A7469] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C2A676] shrink-0" />
              <span>Paystack Secured & Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
