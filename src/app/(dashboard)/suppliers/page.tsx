"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2, Phone, Mail, MapPin } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  isActive: boolean;
}

const mockSuppliers: Supplier[] = [
  { id: "1", name: "Fresh Farm Co", contact: "John Smith", phone: "+852 1234 5678", email: "john@freshfarm.com", address: "123 Farm Road, NT", isActive: true },
  { id: "2", name: "Ocean Seafood", contact: "Mary Chan", phone: "+852 2345 6789", email: "mary@ocean.com", address: "456 Aberdeen Market", isActive: true },
  { id: "3", name: "Kitchen Supplies Ltd", contact: "David Wong", phone: "+852 3456 7890", email: "david@kitchen.com", address: "789 Kwai Chung", isActive: true },
  { id: "4", name: "Spice World", contact: "Lisa Lau", phone: "+852 4567 8901", email: "lisa@spice.com", address: "321 Mong Kok", isActive: false },
];

export default function SuppliersPage() {
  const { lang, t } = useLanguage();
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.contact.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm(lang === 'zh' ? "確定刪除此供應商？" : "Delete this supplier?")) {
      setSuppliers(suppliers.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.suppliers.title}</h1>
          <p className="text-gray-500">{t.suppliers.subtitle}</p>
        </div>
        <button
          onClick={() => {
            setEditingSupplier(null);
            setShowModal(true);
          }}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
        >
          <Plus size={20} />
          {t.suppliers.addSupplier}
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder={t.common.search + "..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-3xl font-bold text-gray-900">{suppliers.length}</h3>
          <p className="text-gray-500">{lang === 'zh' ? '供應商總數' : 'Total Suppliers'}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-3xl font-bold text-emerald-600">
            {suppliers.filter((s) => s.isActive).length}
          </h3>
          <p className="text-gray-500">{t.suppliers.active}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-3xl font-bold text-gray-400">
            {suppliers.filter((s) => !s.isActive).length}
          </h3>
          <p className="text-gray-500">{t.suppliers.inactive}</p>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => (
          <div key={supplier.id} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">
                  {supplier.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{supplier.name}</h3>
                  <p className="text-sm text-gray-500">{supplier.contact}</p>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  supplier.isActive
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {supplier.isActive ? t.suppliers.active : t.suppliers.inactive}
              </span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={16} />
                {supplier.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail size={16} />
                {supplier.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={16} />
                {supplier.address}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t flex justify-end gap-2">
              <button
                onClick={() => {
                  setEditingSupplier(supplier);
                  setShowModal(true);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDelete(supplier.id)}
                className="p-2 hover:bg-gray-100 rounded-lg text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingSupplier ? t.common.edit : t.suppliers.addSupplier}
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.suppliers.name}
                </label>
                <input
                  type="text"
                  defaultValue={editingSupplier?.name}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.suppliers.contact}
                </label>
                <input
                  type="text"
                  defaultValue={editingSupplier?.contact}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.suppliers.phone}
                </label>
                <input
                  type="text"
                  defaultValue={editingSupplier?.phone}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.suppliers.email}
                </label>
                <input
                  type="email"
                  defaultValue={editingSupplier?.email}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  {t.common.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
