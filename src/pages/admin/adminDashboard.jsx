// src/pages/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  FileText,
  MessageCircle,
  AlertTriangle,
  BarChart3,
  Settings,
  Shield,
  TrendingUp,
  Clock,
  Ban,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  isUserAdmin,
  getDashboardStats,
  getRecentActivity,
} from "../../services/adminServices";
import AdminStats from "../../components/admin/adminStats";
import AdminUsers from "../../components/admin/adminUsers";
import AdminReports from "../../components/admin/adminReports";
import AdminActivity from "../../components/admin/adminActivity";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    checkAdminAccess();
    loadDashboardData();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const admin = await isUserAdmin();
      setIsAdmin(admin);
      if (!admin) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error checking admin access:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      const [statsData, activityData] = await Promise.all([
        getDashboardStats(),
        getRecentActivity(10),
      ]);
      setStats(statsData);
      setRecentActivity(activityData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  const tabs = [
    { id: "overview", name: "Aperçu", icon: BarChart3 },
    { id: "users", name: "Utilisateurs", icon: Users },
    { id: "reports", name: "Signalements", icon: AlertTriangle },
    { id: "activity", name: "Activité", icon: Clock },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6953FF]"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Header */}
      <div className="bg-[#111] border-b border-[#2b2b2b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4">
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <div className="text-center sm:text-left w-full">
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  Tableau de bord Admin
                </h1>
                <p className="text-gray-400 text-sm">
                  Gestion de la plateforme
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/")}
              className="hidden sm:flex px-4 py-2 bg-[#1a1a1a] hover:bg-[#252525] text-gray-300 rounded-lg border border-[#2b2b2b] transition-colors w-full sm:w-auto text-sm sm:text-base"
            >
              Retour au site
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-[#6953FF] text-[#6953FF]"
                      : "border-transparent text-gray-400 hover:text-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Grid */}
            {stats && <AdminStats stats={stats} />}

            {/* Recent Activity & Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AdminActivity activities={recentActivity} />
              </div>
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-[#111] border border-[#2b2b2b] rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">
                    Actions rapides
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-3 bg-[#1a1a1a] hover:bg-[#252525] rounded-lg border border-[#2b2b2b] transition-colors">
                      <button
                        className="text-gray-300"
                        onClick={() => setActiveTab("users")}
                      >
                        Voir tous les utilisateurs
                      </button>
                      <Users className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="w-full flex items-center justify-between p-3 bg-[#1a1a1a] hover:bg-[#252525] rounded-lg border border-[#2b2b2b] transition-colors">
                      <button
                        className="text-gray-300"
                        onClick={() => setActiveTab("reports")}
                      >
                        Signalements en attente
                      </button>
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    </button>
                    <button className="w-full flex items-center justify-between p-3 bg-[#1a1a1a] hover:bg-[#252525] rounded-lg border border-[#2b2b2b] transition-colors">
                      <button className="text-gray-300">
                        Analytics détaillées
                      </button>
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && <AdminUsers />}
        {activeTab === "reports" && <AdminReports />}
        {activeTab === "activity" && (
          <AdminActivity activities={recentActivity} showAll />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
