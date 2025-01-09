import { useContext } from 'react';
import TaskList from '../components/TaskList';
import CategoryList from '../components/CategoryList';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Hello, {user.username}</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </header>
      <CategoryList />
      <TaskList />
    </div>
  );
};

export default Dashboard;
