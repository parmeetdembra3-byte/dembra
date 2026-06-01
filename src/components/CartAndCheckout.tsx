import React, { useState } from 'react';
import { CartItem, CustomerOrder } from '../types';
import { AVAILABLE_COUPONS } from '../data';
import { ShoppingCart, Check, Ticket, ChevronRight, CreditCard, Banknote, ShieldCheck, X, ShoppingBag } from 'lucide-react';

interface CartAndCheckoutProps {
  cart: CartItem[];
  onUpdateQuantity: (medicineId: string, delta: number) => void;
  onRemoveItem: (medicineId: string) => void;
  onCheckoutComplete: (order: CustomerOrder) => void;
  onClearCart: () => void;
}

export default function CartAndCheckout({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckoutComplete,
  onClearCart
}: CartAndCheckoutProps) {
  const [couponCode, setCouponCode] = useState('');
  const [activeCoupon, setActiveCoupon] = useState<any | null>(null);
  const [couponError, setCouponError] = useState('');

  // Delivery details
  const [patientName, setPatientName] = useState('Parmeet Dembra');
  const [patientPhone, setPatientPhone] = useState('0333-1234567');
  const [shippingAddress, setShippingAddress] = useState('House 42B, Lane 5, DHA Phase 6, Karachi 75500');
  const [deliveryType, setDeliveryType] = useState<'Home Delivery' | 'Store Pickup'>('Home Delivery');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'Debit/Credit Card' | 'JazzCash' | 'EasyPaisa'>('Cash on Delivery');
  const [cardNumber, setCardNumber] = useState('');
  const [digitalWalletNo, setDigitalWalletNo] = useState('');
  const [isOrdered, setIsOrdered] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<CustomerOrder | null>(null);

  // Computed Prices
  const subtotal = cart.reduce((acc, item) => acc + (item.medicine.price * item.quantity), 0);
  
  // Calculate Promo Discount
  let discount = 0;
  if (activeCoupon) {
    if (subtotal >= activeCoupon.minPurchase) {
      if (activeCoupon.discountPercent) {
        discount = Math.round((subtotal * activeCoupon.discountPercent) / 100);
      }
    }
  }

  const deliveryCharges = deliveryType === 'Store Pickup' || (activeCoupon && activeCoupon.isFreeDelivery) ? 0 : 180;
  const grandTotal = Math.max(0, subtotal - discount + deliveryCharges);

  const handleApplyCoupon = () => {
    setCouponError('');
    const found = AVAILABLE_COUPONS.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase());
    if (!found) {
      setCouponError('Invalid Coupon Code.');
      setActiveCoupon(null);
      return;
    }
    if (subtotal < found.minPurchase) {
      setCouponError(`Min order Rs. ${found.minPurchase} required to apply.`);
      setActiveCoupon(null);
      return;
    }
    setActiveCoupon(found);
  };

  const handlePlaceOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Your Cart is empty!');
      return;
    }

    const orderId = 'ORD-' + Math.floor(10000 + Math.random() * 90000);
    const newOrder: CustomerOrder = {
      id: orderId,
      items: [...cart],
      patientName,
      patientPhone,
      shippingAddress: deliveryType === 'Store Pickup' ? 'SHRIDI WALA Store Pickup Area Counter' : shippingAddress,
      deliveryType,
      paymentMethod,
      subtotal,
      discount,
      deliveryCharges,
      total: grandTotal,
      couponCode: activeCoupon ? activeCoupon.code : undefined,
      date: new Date().toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' }),
      status: 'Order Confirmation'
    };

    onCheckoutComplete(newOrder);
    setPlacedOrder(newOrder);
    setIsOrdered(true);
    onClearCart();
  };

  if (isOrdered && placedOrder) {
    return (
      <div className="space-y-6 pb-20 select-none text-left animate-fade-in font-sans">
        <div className="p-8 bg-white border border-slate-200 rounded-3xl text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 bg-green-50 text-green-600 border border-green-200 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
            ✓
          </div>
          <div className="space-y-1.5">
            <h2 className="text-base font-extrabold text-slate-900">Order Placed Successfully!</h2>
            <p className="text-xs text-slate-500 font-medium">
              Thank you for trusting SHRIDI WALA MEDICOS. Your medical supply order has been received.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-205 space-y-2 text-xs font-mono text-slate-600 shadow-inner">
            <div className="flex justify-between">
              <span>Order Reference ID:</span>
              <span className="font-bold text-blue-600">{placedOrder.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Method:</span>
              <span className="font-medium">{placedOrder.deliveryType}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Type:</span>
              <span className="font-medium">{placedOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 font-sans font-bold text-slate-800">
              <span>Total Amount (PKR):</span>
              <span className="text-slate-900">Rs. {placedOrder.total}</span>
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[10px] text-blue-800 leading-relaxed font-sans font-medium">
            👨‍🔬 <strong>Clinical Verification:</strong> A registered pharmacist in our medicos database is verifying the prescription/inventory availability of your items. Follow progress inside the <strong>Order Tracker</strong> module.
          </div>

          <button
            onClick={() => {
              setIsOrdered(false);
              setPlacedOrder(null);
              setActiveCoupon(null);
            }}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer transition shadow"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-20 select-none text-left animate-fade-in">
      
      {/* Title */}
      <h2 className="text-lg font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-2">
        <ShoppingCart className="w-5 h-5 text-blue-600" />
        Shopping Bag & Checkout
      </h2>

      {cart.length === 0 ? (
        <div className="p-10 bg-white border border-slate-205 rounded-3xl text-center space-y-4 shadow-sm animate-fade-in">
          <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto" />
          <div className="space-y-1">
            <p className="text-slate-850 text-sm font-semibold">Your Shopping Bag is empty</p>
            <p className="text-slate-500 text-xs">Navigate to Medications or Dermal tabs to add healthcare formulations.</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handlePlaceOrderSubmit} className="space-y-5">
          
          {/* Cart item listing */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-0.5">Selected Formulations ({cart.length})</h3>
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.medicine.id} className="p-3 bg-white border border-slate-205 rounded-2xl flex justify-between items-center text-xs shadow-sm animate-fade-in">
                  <div className="space-y-0.5 max-w-[60%]">
                    <div className="font-bold text-slate-800 line-clamp-1">{item.medicine.name}</div>
                    <div className="text-[9px] font-mono text-slate-500 font-medium">{item.medicine.brand} • Rs. {item.medicine.price}</div>
                  </div>
                  
                  {/* Quantity Actions */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-slate-200 bg-slate-50 rounded-lg shadow-inner">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.medicine.id, -1)}
                        className="px-2.5 py-1 text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2 font-mono font-bold text-slate-800">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.medicine.id, 1)}
                        className="px-2.5 py-1 text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.medicine.id)}
                      className="p-1 rounded bg-slate-50 border border-slate-200 hover:text-red-650 hover:bg-slate-100 cursor-pointer text-slate-400 font-bold transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coupon codes block */}
          <div className="p-4 bg-white border border-slate-205 rounded-2xl space-y-2.5 shadow-sm">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Ticket className="w-3.5 h-3.5 text-amber-500" />
              Apply Medicos Coupon Code
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="PROMO CODE (e.g. SHRIDI10)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono uppercase focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="px-4 py-2 bg-blue-50 text-blue-600 font-extrabold text-xs rounded-xl border border-blue-200 active:scale-95 transition cursor-pointer hover:bg-blue-100"
              >
                Apply
              </button>
            </div>

            {couponError && <p className="text-[10px] text-red-500 font-semibold">{couponError}</p>}
            {activeCoupon && (
              <p className="text-[10px] text-green-800 font-bold flex items-center gap-1 leading-normal bg-green-50 border border-green-200 p-2 rounded-lg">
                ✓ Coupon Applied Successfully! ({activeCoupon.description})
              </p>
            )}
          </div>

          {/* Checkout delivery and address block */}
          <div className="space-y-3.5 bg-white border border-slate-205 p-4 rounded-3xl shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 tracking-wider uppercase font-sans border-b border-slate-150 pb-1.5">Shipping & Payment details</h3>
            
            {/* Delivery Medium */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDeliveryType('Home Delivery')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold cursor-pointer text-center ${
                  deliveryType === 'Home Delivery'
                    ? 'bg-blue-50 border-blue-500 text-blue-800 shadow'
                    : 'bg-white border-slate-200 text-slate-555'
                }`}
              >
                🏠 Home Delivery
              </button>
              <button
                type="button"
                onClick={() => setDeliveryType('Store Pickup')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold cursor-pointer text-center ${
                  deliveryType === 'Store Pickup'
                    ? 'bg-blue-50 border-blue-500 text-blue-800 shadow'
                    : 'bg-white border-slate-200 text-slate-555'
                }`}
              >
                🏬 Store Pickup
              </button>
            </div>

            {/* Address fields */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Consignee Name</span>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 font-bold uppercase font-sans">Contact Phone</span>
                  <input
                    type="tel"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {deliveryType === 'Home Delivery' && (
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Shipping Address</span>
                  <textarea
                    rows={2}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 leading-normal focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              )}
            </div>

            {/* Payment medium selectors */}
            <div className="space-y-2 border-t border-slate-150 pt-3">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Select Secure Gateway</span>
              
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'Cash on Delivery', name: 'Cash on Delivery', icon: Banknote },
                  { id: 'Debit/Credit Card', name: 'Visa & MasterCard', icon: CreditCard },
                  { id: 'JazzCash', name: 'JazzCash Wallet', icon: CreditCard },
                  { id: 'EasyPaisa', name: 'EasyPaisa Wallet', icon: CreditCard }
                ].map((pay) => (
                  <button
                    type="button"
                    key={pay.id}
                    onClick={() => setPaymentMethod(pay.id as any)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold cursor-pointer transition flex items-center gap-2 ${
                      paymentMethod === pay.id
                        ? 'bg-blue-50 border-blue-500 text-blue-800'
                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <pay.icon className="w-4 h-4 shrink-0 text-blue-600" />
                    <span className="truncate">{pay.name}</span>
                  </button>
                ))}
              </div>

              {/* Dynamic details for card / wallets */}
              {paymentMethod === 'Debit/Credit Card' && (
                <div className="space-y-1 pt-1.5 animate-fade-in">
                  <span className="text-[9px] text-slate-450 block font-mono">16-Digit Card Number ID</span>
                  <input
                    type="text"
                    required
                    placeholder="xxxx xxxx xxxx xxxx"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              )}

              {(paymentMethod === 'JazzCash' || paymentMethod === 'EasyPaisa') && (
                <div className="space-y-1 pt-1.5 animate-fade-in">
                  <span className="text-[9px] text-slate-450 block font-mono">Registered Wallet Mobile Number ({paymentMethod})</span>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 03001234567"
                    value={digitalWalletNo}
                    onChange={(e) => setDigitalWalletNo(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>

          </div>

          {/* Pricing summary widget */}
          <div className="p-4 bg-white border border-slate-205 rounded-3xl space-y-2.5 shadow-sm">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-150 pb-1 font-medium font-bold">Price Summary</h3>
            
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>Items Total:</span>
              <span className="font-mono text-slate-800 font-bold">Rs. {subtotal}</span>
            </div>
            
            {discount > 0 && (
              <div className="flex justify-between text-xs text-green-700 font-bold">
                <span>Coupon Sale Discount:</span>
                <span className="font-mono font-bold">- Rs. {discount}</span>
              </div>
            )}
            
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>Delivery Shipping Fees:</span>
              <span className="font-mono text-slate-800 font-medium font-bold">Rs. {deliveryCharges}</span>
            </div>

            <div className="flex justify-between items-center text-sm font-bold text-slate-800 border-t border-slate-150 pt-2 font-semibold">
              <span>Payable Net Amount:</span>
              <span className="text-slate-900 font-mono text-lg font-black">Rs. {grandTotal}</span>
            </div>

            <div className="flex items-center gap-1.5 text-[9px] text-slate-450 leading-relaxed font-sans mt-2">
              <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
              <span>
                By completing checkout, you guarantee clinical legitimacy of ordered formulations.
              </span>
            </div>
          </div>

          {/* Submit Checkout trigger */}
          <button
            type="submit"
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-705 text-white font-bold text-xs rounded-2xl transition tracking-wider uppercase active:scale-95 shadow-lg shadow-blue-500/10 cursor-pointer"
          >
            Authenticate & Proceed PKR {grandTotal}
          </button>

        </form>
      )}

    </div>
  );
}
