import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, setIsCartOpen, updateCartQuantity, removeCartItem } = useApp();

  if (!isCartOpen) return null;

  const items = cart?.items || [];
  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF9F5] border-l border-[#E5E0D5] flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#E5E0D5] flex items-center justify-between">
            <div>
              <h2 className="text-lg font-serif tracking-tight text-[#1A1A1A]">Wardrobe Bag</h2>
              <p className="text-xs text-[#7A7469]">
                {itemCount} {itemCount === 1 ? 'bespoke item' : 'bespoke items'}
              </p>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-[#7A7469] hover:text-[#1A1A1A] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-12 h-12 text-[#C5BBA8] mx-auto mb-3 stroke-[1.2]" />
                <p className="font-serif text-lg text-[#1A1A1A]">Your bag is empty</p>
                <p className="text-xs text-[#7A7469] mt-1 max-w-xs mx-auto">
                  Explore our Autumn/Winter ready-to-wear pieces and artisan capsule collections.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    window.location.hash = '#/shop';
                  }}
                  className="mt-6 px-5 py-2.5 bg-[#1A1A1A] text-[#FAF9F5] text-xs uppercase tracking-widest hover:bg-[#333] transition-colors"
                >
                  Discover Products
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-[#EBE6DC]">
                  <img
                    src={item.product.image || 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=300&q=80'}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover rounded-xs bg-[#F0EDE6] border border-[#E5E0D5]"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-[#1A1A1A] leading-snug">{item.product.name}</h4>
                      <p className="text-[11px] text-[#7A7469] mt-0.5">
                        {item.variant.color} · Size {item.variant.size}
                      </p>
                      <p className="text-xs font-semibold text-[#1A1A1A] mt-1 tabular-nums">
                        ${item.variant.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#D8D2C5] rounded bg-[#FAF9F5]">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-0.5 text-xs text-[#4A453E] hover:bg-[#EBE6DC] transition-colors"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-medium tabular-nums">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-0.5 text-xs text-[#4A453E] hover:bg-[#EBE6DC] transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeCartItem(item.id)}
                        className="text-[#999] hover:text-[#B91C1C] transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Totals */}
          {items.length > 0 && (
            <div className="px-6 py-5 border-t border-[#E5E0D5] bg-[#F7F5EE] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#7A7469]">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-medium text-[#1A1A1A]">${cart?.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#7A7469]">
                  <span>Estimated Tax</span>
                  <span className="tabular-nums text-[#1A1A1A]">${cart?.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#7A7469]">
                  <span>Atelier Delivery</span>
                  <span className="tabular-nums text-[#1A1A1A]">
                    {cart?.shipping === 0 ? 'Complimentary' : `$${cart?.shipping}`}
                  </span>
                </div>
                <div className="border-t border-[#E5E0D5] pt-2 flex justify-between text-sm font-semibold text-[#1A1A1A]">
                  <span>Total</span>
                  <span className="tabular-nums font-serif text-base">${cart?.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    window.location.hash = '#/checkout';
                  }}
                  className="w-full py-3 bg-[#1A1A1A] text-[#FAF9F5] text-xs uppercase tracking-widest hover:bg-[#333] transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    window.location.hash = '#/cart';
                  }}
                  className="w-full py-2 text-center text-xs text-[#7A7469] hover:text-[#1A1A1A] underline transition-colors"
                >
                  View Full Cart & Summary
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
