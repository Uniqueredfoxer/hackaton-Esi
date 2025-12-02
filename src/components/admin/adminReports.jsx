
import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, XCircle, Eye, Trash2 } from "lucide-react";
import {
  getReportedContent,
  deleteContent,
  updateUser,
} from "../../services/adminServices";

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const reportsData = await getReportedContent();
      setReports(reportsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resolveReport = async (reportId, action) => {
    try {
      // Here you would update the report status in your database
      // For now, we'll just remove it from the list
      setReports((prev) => prev.filter((report) => report.id !== reportId));

      // You could also take additional actions based on the report
      if (action === "delete") {
        // Delete the reported content
        // await deleteContent(report.type, report.target_id);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const getReportedItemInfo = (report) => {
    if (report.reported_post) {
      return {
        type: "post",
        title: report.reported_post.title,
        id: report.reported_post.id,
        authorId: report.reported_post.author_id,
      };
    } else if (report.reported_comment) {
      return {
        type: "comment",
        content: report.reported_comment.content,
        id: report.reported_comment.id,
        authorId: report.reported_comment.author_id,
      };
    } else if (report.reported_user) {
      return {
        type: "user",
        username: report.reported_user.username,
        id: report.reported_user_id,
      };
    }
    return null;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6953FF]"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#111] border border-[#2b2b2b] rounded-xl">
      <div className="p-6 border-b border-[#2b2b2b]">
        <h2 className="text-xl font-bold text-white">Signalements</h2>
        <p className="text-gray-400 text-sm mt-1">
          Gérer les contenus signalés par la communauté
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-900/50 text-red-400">
          {error}
        </div>
      )}

      <div className="p-6">
        {reports.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <p className="text-gray-400">Aucun signalement en attente</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => {
              const reportedItem = getReportedItemInfo(report);

              return (
                <div
                  key={report.id}
                  className="bg-[#1a1a1a] border border-[#2b2b2b] rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-yellow-400/10 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">
                          {reportedItem?.type === "post" && "Question signalée"}
                          {reportedItem?.type === "comment" &&
                            "Commentaire signalé"}
                          {reportedItem?.type === "user" &&
                            "Utilisateur signalé"}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Signalé par {report.reporter?.username || "Anonyme"}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-yellow-400/20 text-yellow-400 text-xs rounded-full">
                      En attente
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-300 text-sm mb-2">
                      <strong>Raison :</strong> {report.reason}
                    </p>

                    {reportedItem && (
                      <div className="bg-[#252525] rounded p-3 mt-2">
                        {reportedItem.type === "post" && (
                          <p className="text-gray-300 text-sm">
                            <strong>Question :</strong> {reportedItem.title}
                          </p>
                        )}
                        {reportedItem.type === "comment" && (
                          <p className="text-gray-300 text-sm">
                            <strong>Commentaire :</strong>{" "}
                            {reportedItem.content}
                          </p>
                        )}
                        {reportedItem.type === "user" && (
                          <p className="text-gray-300 text-sm">
                            <strong>Utilisateur :</strong>{" "}
                            {reportedItem.username}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>Signalé le {formatDate(report.created_at)}</span>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => resolveReport(report.id, "view")}
                        className="flex items-center space-x-1 px-3 py-1 bg-[#6953FF] hover:bg-[#5a47e0] text-white rounded text-sm transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Voir</span>
                      </button>

                      <button
                        onClick={() => resolveReport(report.id, "delete")}
                        className="flex items-center space-x-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Supprimer</span>
                      </button>

                      <button
                        onClick={() => resolveReport(report.id, "dismiss")}
                        className="flex items-center space-x-1 px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Ignorer</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReports;
