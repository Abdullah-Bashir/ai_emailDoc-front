"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  FileText, 
  Eye, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Search,
  TrendingUp,
  Clock,
  AlertCircle,
  Building2,
  Hash,
  Calendar,
  DollarSign
} from "lucide-react";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // ✅ Explicitly type as string | null
  const [searchTerm, setSearchTerm] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/invoice`);
      const data = await response.json();
      
      if (data.success) {
        setInvoices(data.data);
        setError(null); // Clear error on success
      } else {
        setError(data.message || "Failed to fetch invoices");
      }
    } catch (err) {
      setError("Failed to fetch invoices");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      completed: { 
        icon: CheckCircle, 
        color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" 
      },
      processing: { 
        icon: RefreshCw, 
        color: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-800" 
      },
      failed: { 
        icon: XCircle, 
        color: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-800" 
      }
    };
    const { icon: Icon, color } = statusMap[status] || statusMap.processing;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${color}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const stats = {
    total: invoices.length,
    completed: invoices.filter(i => i.status === 'completed').length,
    processing: invoices.filter(i => i.status === 'processing').length,
    failed: invoices.filter(i => i.status === 'failed').length,
    totalValue: invoices.reduce((sum, i) => sum + (i.totalAmount || 0), 0)
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.vendorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading invoices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <FileText className="w-3.5 h-3.5 text-white" />
                </div>
                <h1 className="text-sm font-semibold text-slate-900 dark:text-white">Invoices</h1>
                <span className="text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  {stats.total}
                </span>
              </div>
            </div>
            <button
              onClick={fetchInvoices}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Grid - Compact */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl px-4 py-3 border border-slate-200/50 dark:border-slate-800/50">
            <p className="text-xs text-slate-500 dark:text-slate-400">Total</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{stats.total}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl px-4 py-3 border border-slate-200/50 dark:border-slate-800/50">
            <p className="text-xs text-slate-500 dark:text-slate-400">Completed</p>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{stats.completed}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl px-4 py-3 border border-slate-200/50 dark:border-slate-800/50">
            <p className="text-xs text-slate-500 dark:text-slate-400">Processing</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{stats.processing}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl px-4 py-3 border border-slate-200/50 dark:border-slate-800/50">
            <p className="text-xs text-slate-500 dark:text-slate-400">Failed</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{stats.failed}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl px-4 py-3 border border-slate-200/50 dark:border-slate-800/50 col-span-2 sm:col-span-1">
            <p className="text-xs text-slate-500 dark:text-slate-400">Total Value</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {formatCurrency(stats.totalValue)}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Invoice List */}
        {error ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={fetchInvoices}
              className="mt-3 px-4 py-2 text-sm rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">No invoices found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {searchTerm ? 'Try adjusting your search' : 'Invoices will appear here once processed'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredInvoices.map((invoice) => (
              <div
                key={invoice._id}
                className="group bg-white dark:bg-slate-900 rounded-xl px-4 py-3 border border-slate-200/50 dark:border-slate-800/50 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-200"
              >
                <div className="flex flex-wrap items-center gap-3">
                  {/* Vendor & Invoice Info */}
                  <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                          {invoice.vendorName || 'Unknown Vendor'}
                        </p>
                        {getStatusBadge(invoice.status)}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          {invoice.invoiceNumber}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(invoice.invoiceDate)}
                        </span>
                        {invoice.dueDate && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Due: {formatDate(invoice.dueDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Amount & Action */}
                  <div className="flex items-center gap-4 ml-auto">
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {formatCurrency(invoice.totalAmount, invoice.currency)}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{invoice.currency}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}