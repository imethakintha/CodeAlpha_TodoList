import { useState } from 'react';
import axios from 'axios';
import { FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';

const TaskItem = ({ task, fetchTasks }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [categories] = useState([]);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    category: task.category,
    dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
  });

  const { title, description, category, dueDate } = editData;

  const onChange = (e) =>
    setEditData({ ...editData, [e.target.name]: e.target.value });

  const toggleCompletion = async () => {
    try {
      await axios.patch(`/api/tasks/${task._id}`, { completed: !task.completed });
      fetchTasks();
    } catch (error) {
      console.error('Error toggling completion:', error);
    }
  };

  const deleteTask = async () => {
    try {
      await axios.delete(`/api/tasks/${task._id}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const updateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`/api/tasks/${task._id}`, {
        title,
        description,
        category,
        dueDate: dueDate ? new Date(dueDate) : null,
      });
      setIsEditing(false);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow flex flex-col">
      {isEditing ? (
        <form onSubmit={updateTask} className="flex flex-col space-y-2">
          <input
            type="text"
            name="title"
            className="p-2 border rounded"
            value={title}
            onChange={onChange}
            required
          />
          <textarea
            name="description"
            className="p-2 border rounded"
            value={description}
            onChange={onChange}
          ></textarea>
          <select
          name="category"
          className="p-2 border rounded"
          value={category}
          onChange={onChange}
        >
          <option value="Others">Others</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
          <input
            type="date"
            name="dueDate"
            className="p-2 border rounded"
            value={dueDate}
            onChange={onChange}
          />
          <div className="flex space-x-2">
            <button
              type="submit"
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600 flex-1 flex items-center justify-center"
            >
              <FaCheck className="mr-1" /> Save
            </button>
            <button
              type="button"
              className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 flex-1 flex items-center justify-center"
              onClick={() => setIsEditing(false)}
            >
              <FaTimes className="mr-1" /> Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h3
                className={`text-lg font-semibold ${
                  task.completed ? 'line-through text-green-600' : ''
                }`}
              >
                {task.title}
              </h3>
              {task.category && (
                <span className="text-sm text-gray-500">{task.category}</span>
              )}
              {task.dueDate && (
                <span className="text-sm text-gray-500">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={toggleCompletion}
                className={`p-2 rounded ${
                  task.completed
                    ? 'bg-yellow-500 hover:bg-yellow-600'
                    : 'bg-green-500 hover:bg-green-600'
                }`}
                title={task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
              >
                {task.completed ? <FaTimes /> : <FaCheck />}
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                title="Edit Task"
              >
                <FaEdit />
              </button>
              <button
                onClick={deleteTask}
                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded"
                title="Delete Task"
              >
                <FaTrash />
              </button>
            </div>
          </div>
          {task.description && (
            <p className="mt-2 text-gray-700">{task.description}</p>
          )}
        </>
      )}
    </div>
  );
};


TaskItem.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    category: PropTypes.string,
    dueDate: PropTypes.string,
    completed: PropTypes.bool.isRequired,
  }).isRequired,
  fetchTasks: PropTypes.func.isRequired,
};

export default TaskItem;
