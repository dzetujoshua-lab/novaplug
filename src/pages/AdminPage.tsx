import React, { useState } from 'react';
import { useProducts } from '../context/ProductsContext';
import { useAuth } from '../context/AuthContext';
import { Product, Order, OrderStatus, ProductCode } from '../types';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  DollarSign,
  ShieldCheck,
  Search,
  Plus,
  Edit,
  Save,
  CheckCircle,
  Truck,
  RotateCcw,
  Key,
  Users,
} from 'lucide-react';

interface AdminPageProps {
  onNavigate: (route: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const { products, saveProduct, updateProductStock, productCodes } = useProducts();
  const { user, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'cms' | 'payments' | 'passports'>('overview');

  // Load orders from localStorage
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('novaplug_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // Search & filter orders
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Editing product modal / inline state
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);

  // New passport generation
  const [newCodeBatch, setNewCodeBatch] = useState('ACC-BATCH-2026-10');
  const [newCodeProduct, setNewCodeProduct] = useState(products[0]?.id || '');
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);

  // Calculate high-level metrics
  const totalRevenueGHS = orders.reduce((sum, o) => sum + (o.paymentStatus === 'successful' ? o.totalGHS : 0), 0);
  const totalOrdersCount = orders.length;
  const totalInventoryUnits = products.reduce((sum, p) => sum + p.stockQuantity, 0);
  const totalPassportVerifications = productCodes.reduce((sum, c) => sum + c.verificationCount, 0);

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus, updatedAt: new Date().toISOString() } : o));
    setOrders(updated);
    localStorage.setItem('novaplug_orders', JSON.stringify(updated));
  };

  const handleRefundOrder = (orderId: string) => {
    const updated = orders.map((o) =>
      o.id === orderId
        ? {
            ...o,
            status: 'cancelled' as OrderStatus,
            paymentStatus: 'refunded' as const,
            updatedAt: new Date().toISOString(),
          }
        : o
    );
    setOrders(updated);
    localStorage.setItem('novaplug_orders', JSON.stringify(updated));
  };

  const startEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setEditPrice(prod.priceGHS);
    setEditStock(prod.stockQuantity);
  };

  const saveProductEdits = async (prod: Product) => {
    const updatedProd: Product = {
      ...prod,
      priceGHS: editPrice,
      stockQuantity: editStock,
      inStock: editStock > 0,
    };
    await saveProduct(updatedProd);
    setEditingProductId(null);
  };

  const handleGeneratePassportCodes = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === newCodeProduct);
    if (!prod) return;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const code = `NP-${randomSuffix}-X${Math.floor(Math.random() * 9)}`;

    setGeneratedCodes((prev) => [code, ...prev]);
  };

  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.customerPhone.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#f3f4f6] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>NovaPlug Enterprise Operations</span>
            </div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight mt-1">
              Management Console
            </h1>
            <p className="text-xs text-white/50">
              Logged in as: <strong className="text-white font-mono">{user?.email || 'Administrator'}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-xs font-medium transition-colors"
            >
              Exit to Storefront
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3 text-xs font-medium">
          {[
            { id: 'overview', label: 'Overview & KPIs' },
            { id: 'orders', label: `Orders (${orders.length})` },
            { id: 'cms', label: `Hardware CMS (${products.length})` },
            { id: 'payments', label: 'Payment Reconciliation' },
            { id: 'passports', label: 'Authenticity Registry' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl transition-colors ${
                activeTab === tab.id
                  ? 'bg-amber-400 text-black font-semibold shadow-sm'
                  : 'text-white/60 hover:text-white bg-white/[0.02]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-6 rounded-2xl bg-[#11131a] border border-white/10 space-y-2">
                <span className="text-xs font-mono uppercase text-white/40 block">Gross Settled Revenue</span>
                <p className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight tabular-nums">
                  GH₵ {totalRevenueGHS.toLocaleString()}
                </p>
                <span className="text-[11px] text-emerald-400 font-medium">✓ Settled via MTN & Paystack</span>
              </div>

              <div className="p-6 rounded-2xl bg-[#11131a] border border-white/10 space-y-2">
                <span className="text-xs font-mono uppercase text-white/40 block">Total Orders</span>
                <p className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight tabular-nums">
                  {totalOrdersCount}
                </p>
                <span className="text-[11px] text-white/50">Average order: GH₵ {totalOrdersCount > 0 ? Math.round(totalRevenueGHS / totalOrdersCount).toLocaleString() : '0'}</span>
              </div>

              <div className="p-6 rounded-2xl bg-[#11131a] border border-white/10 space-y-2">
                <span className="text-xs font-mono uppercase text-white/40 block">Warehouse Stock Units</span>
                <p className="text-2xl sm:text-3xl font-mono font-bold text-amber-400 tracking-tight tabular-nums">
                  {totalInventoryUnits}
                </p>
                <span className="text-[11px] text-white/50">Across {products.length} hardware lines</span>
              </div>

              <div className="p-6 rounded-2xl bg-[#11131a] border border-white/10 space-y-2">
                <span className="text-xs font-mono uppercase text-white/40 block">Digital Passport Verifications</span>
                <p className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400 tracking-tight tabular-nums">
                  {totalPassportVerifications}
                </p>
                <span className="text-[11px] text-white/50">Tamper-proof registry checks</span>
              </div>
            </div>

            {/* Quick Overview Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Payment Methods Breakdown */}
              <div className="p-6 rounded-2xl bg-[#11131a] border border-white/10 space-y-4">
                <h3 className="text-sm font-semibold text-white">Payment Method Distribution</h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-white/70">MTN Mobile Money</span>
                    <span className="font-mono text-amber-400 font-semibold">68% of Transactions</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-white/70">Paystack Card (Visa / Mastercard)</span>
                    <span className="font-mono text-white/90 font-semibold">22% of Transactions</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-white/70">Telecel Cash & AT Money</span>
                    <span className="font-mono text-white/90 font-semibold">10% of Transactions</span>
                  </div>
                </div>
              </div>

              {/* Inventory Health */}
              <div className="p-6 rounded-2xl bg-[#11131a] border border-white/10 space-y-4">
                <h3 className="text-sm font-semibold text-white">Inventory Health</h3>
                <div className="space-y-3 text-xs">
                  {products.slice(0, 4).map((p) => (
                    <div key={p.id} className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-white truncate max-w-[200px]">{p.name}</span>
                      <span
                        className={`font-mono font-bold ${
                          p.stockQuantity > 10 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {p.stockQuantity} units left
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDER MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Filter / Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between bg-[#11131a] border border-white/10 rounded-2xl p-4 text-xs">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search orders by number, customer name, phone, or email..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-white/50">Status:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="all" className="bg-[#11131a]">All Statuses</option>
                  <option value="paid" className="bg-[#11131a]">Paid</option>
                  <option value="processing" className="bg-[#11131a]">Processing</option>
                  <option value="shipped" className="bg-[#11131a]">Shipped</option>
                  <option value="delivered" className="bg-[#11131a]">Delivered</option>
                  <option value="cancelled" className="bg-[#11131a]">Cancelled / Refunded</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-[#11131a] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0c0d12] text-white/50 font-mono uppercase tracking-wider border-b border-white/5">
                    <tr>
                      <th className="p-4">Order #</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Delivery Zone</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Fulfillment Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-white/[0.01]">
                          <td className="p-4 font-mono font-bold text-amber-400">
                            {order.orderNumber}
                            <span className="block font-normal text-white/40 text-[10px]">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </td>

                          <td className="p-4">
                            <span className="font-semibold text-white block">{order.customerName}</span>
                            <span className="text-[11px] text-white/50 font-mono">{order.customerPhone}</span>
                          </td>

                          <td className="p-4 text-white/70 max-w-[180px] truncate">
                            {order.shippingAddress.city}, {order.shippingAddress.region}
                          </td>

                          <td className="p-4 font-mono font-semibold text-white">
                            GH₵ {order.totalGHS.toLocaleString()}
                          </td>

                          <td className="p-4">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                              className="bg-white/5 border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-amber-400 capitalize"
                            >
                              <option value="placed" className="bg-[#11131a]">Placed</option>
                              <option value="paid" className="bg-[#11131a]">Paid</option>
                              <option value="processing" className="bg-[#11131a]">Processing</option>
                              <option value="packed" className="bg-[#11131a]">Packed</option>
                              <option value="shipped" className="bg-[#11131a]">Shipped</option>
                              <option value="out_for_delivery" className="bg-[#11131a]">Out for Delivery</option>
                              <option value="delivered" className="bg-[#11131a]">Delivered</option>
                              <option value="cancelled" className="bg-[#11131a]">Cancelled</option>
                            </select>
                          </td>

                          <td className="p-4 text-right">
                            {order.status !== 'cancelled' && (
                              <button
                                onClick={() => handleRefundOrder(order.id)}
                                className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-[11px] font-medium transition-colors"
                              >
                                Refund
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-white/40">
                          No orders matched current filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: HARDWARE CMS */}
        {activeTab === 'cms' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-semibold text-white">Hardware Catalog & Live Stock</h3>
                <p className="text-xs text-white/50">Edit unit pricing, real-time inventory thresholds, and SKUs.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((prod) => {
                const isEditing = editingProductId === prod.id;

                return (
                  <div
                    key={prod.id}
                    className="p-6 rounded-2xl bg-[#11131a] border border-white/10 space-y-4"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-16 h-16 rounded-xl object-cover bg-black shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="font-mono text-[10px] text-white/40 uppercase">
                          {prod.category} · {prod.sku}
                        </span>
                        <h4 className="text-sm font-bold text-white truncate">{prod.name}</h4>
                        <p className="text-xs text-white/50 line-clamp-1">{prod.tagline}</p>
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="space-y-3 pt-2 border-t border-white/5 text-xs">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-white/60 block mb-1">Price (GHS)</label>
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(Number(e.target.value))}
                              className="w-full bg-white/5 border border-white/15 rounded-lg px-2.5 py-1.5 font-mono text-white"
                            />
                          </div>
                          <div>
                            <label className="text-white/60 block mb-1">Stock Quantity</label>
                            <input
                              type="number"
                              value={editStock}
                              onChange={(e) => setEditStock(Number(e.target.value))}
                              className="w-full bg-white/5 border border-white/15 rounded-lg px-2.5 py-1.5 font-mono text-white"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            onClick={() => setEditingProductId(null)}
                            className="px-3 py-1.5 rounded-lg text-white/60 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => saveProductEdits(prod)}
                            className="px-4 py-1.5 rounded-lg bg-amber-400 text-black font-semibold flex items-center gap-1"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Save Changes</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                        <div className="space-y-0.5">
                          <span className="text-white/40 block text-[10px] uppercase font-mono">Retail Price</span>
                          <span className="text-base font-bold font-mono text-amber-400">
                            GH₵ {prod.priceGHS.toLocaleString()}
                          </span>
                        </div>

                        <div className="space-y-0.5 text-center">
                          <span className="text-white/40 block text-[10px] uppercase font-mono">Inventory</span>
                          <span className="font-mono text-white font-semibold">{prod.stockQuantity} units</span>
                        </div>

                        <button
                          onClick={() => startEditProduct(prod)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: PAYMENTS RECONCILIATION */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-semibold text-white">Payment Transactions & Reconciliation</h3>
                <p className="text-xs text-white/50">Audit log of Mobile Money and Paystack gateway captures.</p>
              </div>
            </div>

            <div className="bg-[#11131a] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0c0d12] text-white/50 font-mono uppercase tracking-wider border-b border-white/5">
                    <tr>
                      <th className="p-4">Transaction Ref</th>
                      <th className="p-4">Order #</th>
                      <th className="p-4">Payer</th>
                      <th className="p-4">Provider</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-white/[0.01]">
                        <td className="p-4 font-mono text-white/90">{o.paymentReference}</td>
                        <td className="p-4 font-mono text-amber-400">{o.orderNumber}</td>
                        <td className="p-4 text-white">{o.customerName}</td>
                        <td className="p-4 uppercase font-mono text-white/70">
                          {o.paymentMethod.replace('_', ' ')}
                        </td>
                        <td className="p-4 font-mono font-bold text-white">
                          GH₵ {o.totalGHS.toLocaleString()}
                        </td>
                        <td className="p-4">
                          <span
                            className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                              o.paymentStatus === 'successful'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400'
                            }`}
                          >
                            {o.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: AUTHENTICITY PASSPORT REGISTRY */}
        {activeTab === 'passports' && (
          <div className="space-y-6">
            <div className="bg-[#11131a] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-white">Generate Hardware Digital Passport</h3>
                <p className="text-xs text-white/50">
                  Assign new cryptographic security serials to factory hardware batches manufactured for Ghana.
                </p>
              </div>

              <form onSubmit={handleGeneratePassportCodes} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-white/60">Target Hardware Line</label>
                  <select
                    value={newCodeProduct}
                    onChange={(e) => setNewCodeProduct(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id} className="bg-[#11131a]">
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-white/60">Factory Batch Identifier</label>
                  <input
                    type="text"
                    value={newCodeBatch}
                    onChange={(e) => setNewCodeBatch(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-amber-400 text-black font-semibold text-xs uppercase tracking-wider hover:bg-amber-300 transition-colors cursor-pointer"
                  >
                    Generate Hologram Serial
                  </button>
                </div>
              </form>

              {generatedCodes.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-400/10 border border-amber-400/20 text-xs space-y-2">
                  <span className="font-semibold text-amber-300 block">
                    Recently Generated Codes (Ready to Print on Holographic Cards):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {generatedCodes.map((c, i) => (
                      <span key={i} className="font-mono bg-black/60 px-2.5 py-1 rounded text-white border border-white/10 font-bold">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Existing Registry Table */}
            <div className="bg-[#11131a] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0c0d12] text-white/50 font-mono uppercase tracking-wider border-b border-white/5">
                    <tr>
                      <th className="p-4">Security Code</th>
                      <th className="p-4">Product Name</th>
                      <th className="p-4">Batch Number</th>
                      <th className="p-4">Warranty Expiration</th>
                      <th className="p-4">Verifications</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {productCodes.map((pc) => (
                      <tr key={pc.id} className="hover:bg-white/[0.01]">
                        <td className="p-4 font-mono font-bold text-amber-400">{pc.code}</td>
                        <td className="p-4 font-semibold text-white">{pc.productName}</td>
                        <td className="p-4 font-mono text-white/70">{pc.batchNumber}</td>
                        <td className="p-4 text-white/60">{pc.warrantyValidUntil}</td>
                        <td className="p-4 font-mono text-emerald-400">{pc.verificationCount} checks</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
