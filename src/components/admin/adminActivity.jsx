
import { MessageCircle, FileText, User, Clock } from "lucide-react";

const AdminActivity = ({ activities, showAll = false }) => {
  const displayActivities = showAll ? activities : activities.slice(0, 5);

  const getActivityIcon = (type) => {
    switch (type) {
      case "post":
        return <FileText className="w-4 h-4 text-blue-400" />;
      case "comment":
        return <MessageCircle className="w-4 h-4 text-green-400" />;
      default:
        return <User className="w-4 h-4 text-gray-400" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "post":
        return "bg-blue-400/10";
      case "comment":
        return "bg-green-400/10";
      default:
        return "bg-gray-400/10";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return "À l'instant";
    } else if (diffInHours < 24) {
      return `Il y a ${diffInHours}h`;
    } else {
      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const truncateContent = (content, maxLength = 80) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <div className="bg-[#111] border border-[#2b2b2b] rounded-xl">
      <div className="p-6 border-b border-[#2b2b2b]">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {showAll ? "Activité récente" : "Activité récente"}
          </h2>
          {!showAll && activities.length > 5 && (
            <span className="text-sm text-gray-400">
              {activities.length} activités totales
            </span>
          )}
        </div>
        <p className="text-gray-400 text-sm mt-1">
          Dernières activités sur la plateforme
        </p>
      </div>

      <div className="p-6">
        {displayActivities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Aucune activité récente</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-3 hover:bg-[#1a1a1a] rounded-lg transition-colors"
              >
                <div
                  className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}
                >
                  {getActivityIcon(activity.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-white text-sm">
                      {activity.author || "Utilisateur"}
                    </span>
                    <span className="text-gray-400 text-sm">•</span>
                    <span className="text-gray-400 text-sm">
                      {activity.description}
                    </span>
                  </div>

                  <p className="text-gray-300 text-sm mb-2">
                    {truncateContent(activity.content)}
                  </p>

                  {activity.postTitle && (
                    <p className="text-gray-400 text-xs">
                      Dans: {activity.postTitle}
                    </p>
                  )}

                  <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                    <span>{formatDate(activity.date)}</span>
                    <span className="capitalize px-2 py-1 bg-[#252525] rounded">
                      {activity.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!showAll && activities.length > 5 && (
          <div className="mt-6 pt-4 border-t border-[#2b2b2b]">
            <button className="w-full text-center text-[#6953FF] hover:text-[#5a47e0] text-sm font-medium py-2">
              Voir toute l'activité
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminActivity;
