import React, { useEffect, useState } from 'react';
import { Product, Order, Course, ClassSession, AuditLog } from '../types/index';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  ShoppingBag,
  AlertTriangle,
  GraduationCap,
  Calendar,
  Layers,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2
} from 'lucide-react';

interface AdminDashboardPageProps {
  onNavigate: (route: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'metrics' | 'products' | 'orders' | 'academy' | 'audit'>('metrics');

  const [metrics, setMetrics] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Quick stock edit state
  const [editingVariantStock, setEditingVariantStock] = useState<{ productId: string; variantId: string; stock: number } | null>(null);

  // New product form modal
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('650');
  const [newProductCategory, setNewProductCategory] = useState('cat_outerwear');
  const [newProductDesc, setNewProductDesc] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [mRes, pRes, oRes, cRes, clsRes, logRes] = await Promise.all([
        api.getAdminMetrics(),
        api.getAdminProducts(),
        api.getAdminOrders(),
        api.getCourses(),
        api.getClasses(),
        api.getAdminAuditLogs()
      ]);

      setMetrics(mRes.metrics);
      setProducts(pRes.products);
      setOrders(oRes.orders);
      setCourses(cRes.courses);
      setClasses(clsRes.classes);
      setAuditLogs(logRes.logs);
    } catch (err) {
      console.warn('Failed to load admin data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStock = async (productId: string, variantId: string, newStock: number) => {
    try {
      await api.updateInventoryStock(productId, variantId, newStock);
      showToast('Inventory level updated in atelier database.');
      setEditingVariantStock(null);
      await loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update stock', 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.updateOrderStatus(orderId, newStatus, 'Status updated via admin console');
      showToast(`Order status updated to ${newStatus}`);
      await loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update order', 'error');
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createAdminProduct({
        name: newProductName,
        tagline: 'Hand-tailored limited production',
        description: newProductDesc || 'Sculptural luxury garment crafted from sustainably sourced natural fibers.',
        price: Number(newProductPrice),
        categoryId: newProductCategory,
        details: ['100% Artisan Wool', 'Hand-stitched hems', 'Bespoke fit'],
        fabricCare: 'Specialist dry clean only.',
        isPublished: true,
        images: ['https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=800&q=80'],
        variants: [
          {
            id: `var_${Date.now()}_s`,
            productId: '',
            sku: `AT-NEW-S`,
            title: 'Noir / S',
            size: 'S',
            color: 'Midnight Noir',
            price: Number(newProductPrice),
            stock: 5,
            reservedStock: 0
          },
          {
            id: `var_${Date.now()}_m`,
            productId: '',
            sku: `AT-NEW-M`,
            title: 'Noir / M',
            size: 'M',
            color: 'Midnight Noir',
            price: Number(newProductPrice),
            stock: 8,
            reservedStock: 0
          }
        ],
        averageRating: 5.0,
        reviewCount: 0
      });

      showToast('New garment added to atelier database.');
      setIsAddProductOpen(false);
      setNewProductName('');
      setNewProductDesc('');
      await loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to create product', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="font-serif text-lg text-[#7A7469] animate-pulse">Loading atelier command center...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E3D8] pb-4">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#C2A676] font-semibold block mb-1">
            Backoffice Command Center
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A]">
            Atelier Executive Administration
          </h1>
        </div>

        <button
          onClick={loadData}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-[#D8D2C5] rounded bg-white text-xs hover:bg-[#F5F2EB] text-[#1A1A1A] transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#C2A676]" /> Refresh Metrics
        </button>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 bg-[#FAF9F5] border border-[#E8E3D8] rounded-xs space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-[#7A7469] flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-[#C2A676]" /> Revenue
          </span>
          <span className="font-serif text-2xl font-medium text-[#1A1A1A] block tabular-nums">
            ${metrics?.totalRevenue.toLocaleString() || '0'}
          </span>
          <span className="text-[10px] text-[#3F7535]">Paystack Verified</span>
        </div>

        <div className="p-4 bg-[#FAF9F5] border border-[#E8E3D8] rounded-xs space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-[#7A7469] flex items-center gap-1">
            <ShoppingBag className="w-3 h-3 text-[#C2A676]" /> Orders
          </span>
          <span className="font-serif text-2xl font-medium text-[#1A1A1A] block tabular-nums">
            {metrics?.totalOrders || 0}
          </span>
          <span className="text-[10px] text-[#7A7469]">All Channels</span>
        </div>

        <div className="p-4 bg-[#FAF9F5] border border-[#E8E3D8] rounded-xs space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-[#7A7469] flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-[#B91C1C]" /> Low Stock
          </span>
          <span className="font-serif text-2xl font-medium text-[#B91C1C] block tabular-nums">
            {metrics?.lowStockCount || 0}
          </span>
          <span className="text-[10px] text-[#B91C1C]">Variants &le; 4</span>
        </div>

        <div className="p-4 bg-[#FAF9F5] border border-[#E8E3D8] rounded-xs space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-[#7A7469] flex items-center gap-1">
            <GraduationCap className="w-3 h-3 text-[#C2A676]" /> Students
          </span>
          <span className="font-serif text-2xl font-medium text-[#1A1A1A] block tabular-nums">
            {metrics?.totalStudents || 0}
          </span>
          <span className="text-[10px] text-[#7A7469]">Active Apprentices</span>
        </div>

        <div className="p-4 bg-[#FAF9F5] border border-[#E8E3D8] rounded-xs space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-[#7A7469] flex items-center gap-1">
            <Layers className="w-3 h-3 text-[#C2A676]" /> Enrollments
          </span>
          <span className="font-serif text-2xl font-medium text-[#1A1A1A] block tabular-nums">
            {metrics?.totalEnrollments || 0}
          </span>
          <span className="text-[10px] text-[#7A7469]">Course Registrations</span>
        </div>

        <div className="p-4 bg-[#FAF9F5] border border-[#E8E3D8] rounded-xs space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-[#7A7469] flex items-center gap-1">
            <Calendar className="w-3 h-3 text-[#C2A676]" /> Mentoring
          </span>
          <span className="font-serif text-2xl font-medium text-[#1A1A1A] block tabular-nums">
            {metrics?.activeBookingsCount || 0}
          </span>
          <span className="text-[10px] text-[#7A7469]">Confirmed Sessions</span>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-[#E8E3D8] gap-4 text-xs uppercase tracking-wider font-semibold">
        {[
          { key: 'metrics', label: 'Overview & Orders' },
          { key: 'products', label: `Inventory & Garments (${products.length})` },
          { key: 'academy', label: `Academy & Workshops (${courses.length})` },
          { key: 'audit', label: `Immutable Audit Trail (${auditLogs.length})` }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`pb-2.5 transition-colors relative ${
              activeTab === tab.key ? 'text-[#1A1A1A]' : 'text-[#8C8476] hover:text-[#1A1A1A]'
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#1A1A1A]" />
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: METRICS & RECENT ORDERS */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-2xl text-[#1A1A1A]">Customer Orders Ledger</h3>
            <span className="text-xs text-[#7A7469]">{orders.length} Total Registered</span>
          </div>

          <div className="bg-[#FAF9F5] border border-[#E8E3D8] rounded overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F2EB] text-[#7A7469] uppercase tracking-wider font-medium border-b border-[#E8E3D8]">
                <tr>
                  <th className="p-3.5">Order Number</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Items</th>
                  <th className="p-3.5">Total</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBE6DC]">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#F9F7F2]">
                    <td className="p-3.5 font-mono font-medium text-[#1A1A1A]">{order.orderNumber}</td>
                    <td className="p-3.5">
                      <span className="font-medium text-[#1A1A1A] block">{order.customerName}</span>
                      <span className="text-[11px] text-[#7A7469]">{order.customerEmail}</span>
                    </td>
                    <td className="p-3.5 text-[#7A7469]">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3.5">{order.items.length} pcs</td>
                    <td className="p-3.5 font-serif text-sm font-semibold tabular-nums text-[#1A1A1A]">
                      ${order.total.toLocaleString()}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded uppercase tracking-wider bg-[#EDE8DE] text-[#1A1A1A]">
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className="bg-white border border-[#D8D2C5] px-2 py-1 text-[11px] rounded"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PAID">PAID</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: INVENTORY & PRODUCTS */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif text-2xl text-[#1A1A1A]">Garment Catalog & Variant Stock</h3>
              <p className="text-xs text-[#7A7469]">Update variant stock numbers directly in the live atelier ledger</p>
            </div>
            <button
              onClick={() => setIsAddProductOpen(true)}
              className="px-4 py-2 bg-[#1A1A1A] text-white text-xs uppercase tracking-wider font-semibold rounded flex items-center gap-1.5 hover:bg-[#333]"
            >
              <Plus className="w-3.5 h-3.5" /> Add New Garment
            </button>
          </div>

          <div className="space-y-6">
            {products.map((prod) => (
              <div key={prod.id} className="p-5 bg-[#FAF9F5] border border-[#E8E3D8] rounded-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E3D8] pb-3">
                  <div className="flex items-center gap-4">
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-12 h-16 object-cover bg-[#DDD] border border-[#D8D2C5]"
                    />
                    <div>
                      <h4 className="font-serif text-lg text-[#1A1A1A] leading-snug">{prod.name}</h4>
                      <p className="text-xs text-[#7A7469]">{prod.tagline}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <span className="font-serif text-lg text-[#1A1A1A] font-semibold">${prod.price}</span>
                    <button
                      onClick={() => onNavigate(`/shop/${prod.slug}`)}
                      className="text-[#8C7A54] hover:underline"
                    >
                      View Live Page →
                    </button>
                  </div>
                </div>

                {/* Variants Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  {prod.variants.map((v) => {
                    const available = v.stock - v.reservedStock;
                    const isEditing =
                      editingVariantStock?.productId === prod.id &&
                      editingVariantStock?.variantId === v.id;

                    return (
                      <div
                        key={v.id}
                        className={`p-3 border rounded-xs flex flex-col justify-between space-y-2 ${
                          available <= 3 ? 'bg-[#FFF9F9] border-[#FCA5A5]' : 'bg-white border-[#E0D9CE]'
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-start">
                            <span className="font-semibold text-[#1A1A1A]">{v.title}</span>
                            <span className="font-mono text-[10px] text-[#7A7469]">{v.sku}</span>
                          </div>
                          <p className="text-[11px] text-[#7A7469] mt-0.5">
                            Stock: {v.stock} (Reserved: {v.reservedStock})
                          </p>
                        </div>

                        {isEditing ? (
                          <div className="flex gap-1.5 pt-1">
                            <input
                              type="number"
                              value={editingVariantStock.stock}
                              onChange={(e) =>
                                setEditingVariantStock({
                                  ...editingVariantStock,
                                  stock: Number(e.target.value)
                                })
                              }
                              className="w-16 border border-[#1A1A1A] px-2 py-0.5 text-xs text-center"
                              min={0}
                            />
                            <button
                              onClick={() =>
                                handleUpdateStock(prod.id, v.id, editingVariantStock.stock)
                              }
                              className="px-2 py-0.5 bg-[#1A1A1A] text-white text-[10px] uppercase font-semibold rounded"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingVariantStock(null)}
                              className="text-[10px] text-[#888] hover:text-[#111]"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center pt-1 border-t border-[#EFECE4]">
                            <span
                              className={`text-[11px] font-semibold ${
                                available <= 3 ? 'text-[#B91C1C]' : 'text-[#3F7535]'
                              }`}
                            >
                              {available} Available
                            </span>
                            <button
                              onClick={() =>
                                setEditingVariantStock({
                                  productId: prod.id,
                                  variantId: v.id,
                                  stock: v.stock
                                })
                              }
                              className="text-[11px] text-[#C2A676] hover:underline font-medium"
                            >
                              Edit Stock
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ACADEMY & WORKSHOPS */}
      {activeTab === 'academy' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-2xl text-[#1A1A1A]">Curriculum & Live Studio Classes</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="p-5 bg-[#FAF9F5] border border-[#E8E3D8] space-y-3">
                <div className="aspect-video w-full overflow-hidden bg-[#DDD]">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-serif text-lg text-[#1A1A1A]">{course.title}</h4>
                <p className="text-xs text-[#7A7469]">Instructor: {course.instructorName}</p>
                <div className="flex justify-between text-xs pt-2 border-t border-[#E8E3D8]">
                  <span>Enrolled: <strong>{course.enrolledCount}</strong></span>
                  <span className="font-serif font-medium">${course.price}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-[#E8E3D8] space-y-4">
            <h4 className="font-serif text-xl text-[#1A1A1A]">Scheduled Masterclass Workshops</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classes.map((cls) => (
                <div key={cls.id} className="p-4 bg-[#FAF9F5] border border-[#E8E3D8] space-y-2 text-xs">
                  <div className="flex justify-between">
                    <strong className="text-[#1A1A1A]">{cls.title}</strong>
                    <span className="text-[#8C7A54] uppercase tracking-wider font-semibold">
                      {cls.enrolledCount}/{cls.capacity} Booked
                    </span>
                  </div>
                  <p className="text-[#7A7469]">{cls.date} · {cls.startTime} to {cls.endTime}</p>
                  <p className="text-[#554F44]">{cls.location}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-2xl text-[#1A1A1A]">Security & Concurrency Audit Logs</h3>
            <span className="text-xs text-[#7A7469]">Append-only ledger of critical actions</span>
          </div>

          <div className="bg-[#FAF9F5] border border-[#E8E3D8] rounded overflow-hidden">
            <div className="divide-y divide-[#EBE6DC] text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#F9F7F2]">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-[#1A1A1A] text-white rounded">
                      {log.action}
                    </span>
                    <div>
                      <span className="font-medium text-[#1A1A1A]">{log.entityType} ({log.entityId})</span>
                      <span className="text-[11px] text-[#7A7469] ml-2">by {log.actorName}</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-[#8C8476] font-mono">
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-[#FAF9F5] border border-[#E5E0D5] w-full max-w-lg rounded p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-[#E8E3D8] pb-3">
              <h3 className="font-serif text-xl text-[#1A1A1A]">Register New Haute Couture Garment</h3>
              <button onClick={() => setIsAddProductOpen(false)} className="text-[#888] hover:text-[#111]">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#666] font-medium mb-1">
                  Garment Name
                </label>
                <input
                  type="text"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="e.g. Sculptural Double-Breasted Wool Blazer"
                  className="w-full bg-white border border-[#D8D2C5] px-3 py-1.5 rounded"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#666] font-medium mb-1">
                    Retail Price ($)
                  </label>
                  <input
                    type="number"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    className="w-full bg-white border border-[#D8D2C5] px-3 py-1.5 rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#666] font-medium mb-1">
                    Category
                  </label>
                  <select
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value)}
                    className="w-full bg-white border border-[#D8D2C5] px-3 py-1.5 rounded"
                  >
                    <option value="cat_outerwear">Outerwear & Coats</option>
                    <option value="cat_eveningwear">Eveningwear</option>
                    <option value="cat_tailoring">Bespoke Tailoring</option>
                    <option value="cat_leather">Leather Goods</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#666] font-medium mb-1">
                  Description & Craftsmanship
                </label>
                <textarea
                  rows={3}
                  value={newProductDesc}
                  onChange={(e) => setNewProductDesc(e.target.value)}
                  placeholder="Details regarding silhouette, fabric composition, and atelier origin..."
                  className="w-full bg-white border border-[#D8D2C5] px-3 py-1.5 rounded"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="flex-1 py-2 border border-[#D8D2C5] text-xs uppercase tracking-wider font-semibold rounded hover:bg-[#F0EDE6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#1A1A1A] text-white text-xs uppercase tracking-wider font-semibold rounded hover:bg-[#333]"
                >
                  Create Garment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
