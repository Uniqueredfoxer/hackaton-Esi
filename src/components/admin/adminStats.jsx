import { Users, FileText, MessageCircle, TrendingUp } from "lucide-react";

const AdminStats = ({ stats }) => {
  const statCards = [
    {
      title: "Utilisateurs",
      value: stats.totalUsers,
      change: `${stats.newUsersThisWeek} cette semaine`,
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    },
    {
      title: "Questions",
      value: stats.totalPosts,
      change: "Total des discussions",
      icon: MessageCircle,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
    },
    {
      title: "Commentaires",
      value: stats.totalComments,
      change: "Total des réponses",
      icon: MessageCircle,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
    },
    {
      title: "Documents",
      value: stats.totalDocuments,
      change: "Ressources partagées",
      icon: FileText,
      color: "text-orange-400",
      bgColor: "bg-orange-400/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-[#111] border border-[#2b2b2b] rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <TrendingUp className="w-4 h-4 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-gray-300 font-medium mb-2">{stat.title}</p>
            <p className="text-gray-400 text-sm">{stat.change}</p>
          </div>
        );
      })}
    </div>
  );
};

export default AdminStats;
