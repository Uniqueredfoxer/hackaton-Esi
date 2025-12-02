import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Ban,
  Shield,
  User,
  Mail,
  Calendar,
} from "lucide-react";
import { getUsers, updateUser } from "../../services/adminServices";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadUsers();
  }, [currentPage]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { users: usersData, totalPages: pages } = await getUsers(
        currentPage,
        20,
      );
      setUsers(usersData);
      setTotalPages(pages);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUser(userId, { role: newRole });
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user,
        ),
      );
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const handleBanToggle = async (userId, isCurrentlyBanned) => {
    try {
      await updateUser(userId, { is_banned: !isCurrentlyBanned });
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, is_banned: !isCurrentlyBanned }
            : user,
        ),
      );
    } catch (error) {
      console.error("Error updating user ban status:", error);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
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
        <h2 className="text-xl font-bold text-white">
          Gestion des utilisateurs
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Gérer les rôles et statuts des utilisateurs
        </p>
      </div>

      {/* Search and Filters */}
      <div className="p-6 border-b border-[#2b2b2b]">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#1a1a1a] border border-[#2b2b2b] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#6953FF]"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-[#1a1a1a] border border-[#2b2b2b] rounded-lg text-gray-300 hover:bg-[#252525] transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filtrer</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="p-4 sm:p-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            {" "}
            {/* Force minimum width */}
            <thead>
              <tr className="border-b border-[#2b2b2b]">
                <th className="text-left py-3 text-gray-400 font-medium text-sm px-2 sm:px-4">
                  Utilisateur
                </th>
                <th className="text-left py-3 text-gray-400 font-medium text-sm px-2 sm:px-4 hidden sm:table-cell">
                  Inscrit le
                </th>
                <th className="text-left py-3 text-gray-400 font-medium text-sm px-2 sm:px-4 hidden md:table-cell">
                  Score
                </th>
                <th className="text-left py-3 text-gray-400 font-medium text-sm px-2 sm:px-4">
                  Rôle
                </th>
                <th className="text-left py-3 text-gray-400 font-medium text-sm px-2 sm:px-4 hidden lg:table-cell">
                  Statut
                </th>
                <th className="text-left py-3 text-gray-400 font-medium text-sm px-2 sm:px-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-[#2b2b2b] hover:bg-[#1a1a1a]"
                >
                  <td className="py-4 px-2 sm:px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#6953FF] rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-white text-sm truncate">
                          {user.username || "Sans nom"}
                        </p>
                        <p className="text-gray-400 text-xs truncate">
                          ID: {user.id.substring(0, 8)}...
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-2 sm:px-4 hidden sm:table-cell">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-300 text-sm">
                        {formatDate(user.created_at)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-2 sm:px-4 hidden md:table-cell">
                    <span className="text-gray-300 text-sm">
                      {user.scores || 0}
                    </span>
                  </td>
                  <td className="py-4 px-2 sm:px-4">
                    <select
                      value={user.role || "user"}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value)
                      }
                      className="bg-[#1a1a1a] border border-[#2b2b2b] rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-[#6953FF] w-full max-w-[120px]"
                    >
                      <option value="user">Utilisateur</option>
                      <option value="moderator">Modérateur</option>
                      <option value="admin">Administrateur</option>
                    </select>
                  </td>
                  <td className="py-4 px-2 sm:px-4 hidden lg:table-cell">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.is_banned
                          ? "bg-red-400/20 text-red-400"
                          : "bg-green-400/20 text-green-400"
                      }`}
                    >
                      {user.is_banned ? "Banni" : "Actif"}
                    </span>
                  </td>
                  <td className="py-4 px-2 sm:px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleBanToggle(user.id, user.is_banned)}
                        className={`p-2 rounded transition-colors flex-shrink-0 ${
                          user.is_banned
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-red-600 hover:bg-red-700 text-white"
                        }`}
                        title={user.is_banned ? "Débannir" : "Bannir"}
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#2b2b2b] px-2 sm:px-0">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 sm:px-4 sm:py-2 bg-[#1a1a1a] border border-[#2b2b2b] rounded text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#252525] transition-colors text-sm"
            >
              Précédent
            </button>

            <span className="text-gray-400 text-sm mx-2">
              Page {currentPage} sur {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-2 sm:px-4 sm:py-2 bg-[#1a1a1a] border border-[#2b2b2b] rounded text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#252525] transition-colors text-sm"
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
