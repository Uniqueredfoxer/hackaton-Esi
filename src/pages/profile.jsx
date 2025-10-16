
import {useState, useEffect} from "react";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
        // Fetch user data from an API or service
        const fetchUserData = async () => {
            const data = await getUserData();
            setUser(data);
            setLoading(false);
        };

        fetchUserData();
    }, []);

    if (loading) {
        return <div className="text-gray-400">Loading...</div>;
    }

    return (
        <h1 className="text-gray-300 text-2xl">Welcome to the Profile Page</h1>
    );
};
export default Profile;