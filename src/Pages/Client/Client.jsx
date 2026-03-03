// src/pages/clients.jsx
import React, { useState } from "react";
import DataTable from "@/components/DataTable";
import Loader from "@/components/Loader";
import useGet from "@/hooks/useGet";
import api from "@/api/api";
import { toast } from "react-toastify";
// استيراد الأيقونات المطلوبة
import { RefreshCw, Server, Cpu, ShieldCheck, Play, ExternalLink } from "lucide-react";

const Clients = () => {
  const { data, loading, error } = useGet("/api/admin/clients");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  // ✅ أوبجكت لتخزين الخطوة الحالية لكل عميل (0: لم يبدأ، 1: rebuild، وهكذا)
  const [clientSteps, setClientSteps] = useState({});

  const clients = data?.data || [];

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleDeployment = async (client) => {
    const clientId = client._id;

    const sessionClientName = sessionStorage.getItem("client_name") || client.company_name;
    const sessionClientId = sessionStorage.getItem("client_id") || clientId;

    // تحديث الحالة للبدء (الخطوة 1)
    setClientSteps(prev => ({ ...prev, [clientId]: 1 }));
    const toastId = toast.loading("Step 1: Rebuilding Frontend...");

    try {
      // 1. Rebuild Frontend
      await api.post(`/api/admin/clients/${sessionClientId}/rebuild-frontend`);

      // الانتقال للخطوة 2
      setClientSteps(prev => ({ ...prev, [clientId]: 2 }));
      toast.update(toastId, { render: "Step 2: Deploying Backend..." });
      await api.post(`/api/admin/clients/${sessionClientId}/deploy-backend`);

      // الانتقال للخطوة 3
      setClientSteps(prev => ({ ...prev, [clientId]: 3 }));
      toast.update(toastId, { render: "Step 3: Installing Dependencies..." });
      await api.post(`/api/admin/clients/install-dependencies`, {
        clientName: sessionClientName,
      });

      // انتظار 15 ثانية
      toast.update(toastId, { render: "Waiting 15 seconds for system sync..." });
      await delay(15000);

      // الانتقال للخطوة 4 (الأخيرة)
      setClientSteps(prev => ({ ...prev, [clientId]: 4 }));
      toast.update(toastId, { render: "Step 4: Installing SSL Certificate..." });
      const res = await api.post(`/api/admin/clients/${sessionClientId}/install-ssl`);

      toast.update(toastId, { render: "Deployment finished!", type: "success", isLoading: false, autoClose: 3000 });

      // فتح المودال لعرض النتيجة (الدومين)
      setModalData(res.data);
      setIsModalOpen(true);

    } catch (err) {
      setClientSteps(prev => ({ ...prev, [clientId]: 0 })); // إعادة التعيين في حال الخطأ
      toast.update(toastId, { render: "Process failed!", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  const columns = [
    { key: "company_name", header: "Company Name" },
    { key: "email", header: "Email" },
    { key: "package_id", header: "Package", render: (v) => v?.name || "-" },
    {
      key: "sub_domain",
      header: "Sub Domain Actions",
      render: (_, row) => {
        const currentStep = clientSteps[row._id] || 0;

        // helper function لتحديد لون الأيقونة بناءً على الخطوة
        const getIconClass = (stepNumber) => {
          if (currentStep === stepNumber) return "text-purple-600 animate-pulse"; // جاري التنفيذ
          if (currentStep > stepNumber) return "text-purple-600"; // اكتملت
          return "text-gray-300"; // لم تبدأ بعد
        };

        return (
          <div className="flex items-center gap-4">
            {/* زر البدء - يظهر إذا لم تكن هناك عملية جارية */}
            {currentStep === 0 ? (
              <button onClick={() => handleDeployment(row)} title="Start Deployment Process">
                <Play size={18} className="text-green-600 hover:scale-125 transition-transform" />
              </button>
            ) : null}

            {/* الأيقونات بالترتيب من اليسار */}
            <RefreshCw
              size={18}
              className={getIconClass(1)}
              title="Step 1: Rebuild Frontend" // الـ Hover Title
            />
            <Server
              size={18}
              className={getIconClass(2)}
              title="Step 2: Deploy Backend"
            />
            <Cpu
              size={18}
              className={getIconClass(3)}
              title="Step 3: Install Dependencies"
            />
            <ShieldCheck
              size={20}
              className={getIconClass(4)}
              title="Step 4: SSL Certificate"
            />
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (v) => (
        <span className={`px-2 py-1 rounded-full text-xs ${v === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {v === "active" ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <DataTable data={clients} columns={columns} title="Clients Management" addPath="add" onAdd={() => alert("Add new client clicked!")} />

      {/* المودال لعرض رد الباك إند */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Success!</h2>
              <p className="text-gray-500 mb-6">Your client's subdomain is now secure and ready.</p>

              <div className="w-full bg-purple-50 p-4 rounded-xl border border-purple-100 mb-6">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Access Link</span>
                <a
                  href={modalData?.domain || "#"}
                  target="_blank"
                  className="block text-purple-700 font-semibold mt-1 break-all hover:underline"
                >
                  {modalData?.domain || "Processing link..."}
                  <ExternalLink size={14} className="inline ml-1" />
                </a>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-black transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;