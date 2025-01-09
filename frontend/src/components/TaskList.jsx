import { useEffect, useState } from 'react';
import axios from 'axios';
import TaskItem from './TaskItem.jsx';
import TaskForm from './TaskForm.jsx';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/api/tasks');
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">To-Do List</h1>
      <TaskForm fetchTasks={fetchTasks} />
      {tasks.length === 0 ? (
        <p className="text-center text-gray-500">No tasks available. Add a new task!</p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskItem key={task._id} task={task} fetchTasks={fetchTasks} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
