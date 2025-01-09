import { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';


const TaskForm = ({ fetchTasks }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await axios.post('/api/tasks', { title, description });
      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex flex-col space-y-2">
      <input
        type="text"
        placeholder="Task Title"
        className="p-2 border rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Task Description"
        className="p-2 border rounded"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Add Task
      </button>
    </form>
  );
};

TaskForm.propTypes = {
  fetchTasks: PropTypes.func.isRequired,
};

export default TaskForm;
