import { useState } from 'react';
import axios from 'axios';
import { FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';

const TaskItem = ({ task, fetchTasks }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);

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
        title: editTitle,
        description: editDescription,
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
            className="p-2 border rounded"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            required
          />
          <textarea
            className="p-2 border rounded"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          ></textarea>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600 flex-1"
            >
              <FaCheck /> Save
            </button>
            <button
              type="button"
              className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 flex-1"
              onClick={() => setIsEditing(false)}
            >
              <FaTimes /> Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-green-600' : ''}`}>
              {task.title}
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={toggleCompletion}
                className={`p-2 rounded ${task.completed ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'}`}
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
          {task.description && <p className="mt-2 text-gray-700">{task.description}</p>}
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
    completed: PropTypes.bool.isRequired,
  }).isRequired,
  fetchTasks: PropTypes.func.isRequired,
};

export default TaskItem;
