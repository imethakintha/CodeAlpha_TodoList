
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { AuthContext } from "../context/AuthContext.jsx"; 
import useAxios from "../axiosConfig.js";

const TaskForm = ({ fetchTasks }) => {
  
  const { token } = useContext(AuthContext); 
  const axiosInstance = useAxios();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Others",
    dueDate: "",
  });

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(""); 
  const [success, setSuccess] = useState(""); 

  const { title, description, category, dueDate } = formData;

 
  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/categories", {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError(
        error.response?.data?.message || "Failed to load categories. Please try again."
      );
    }
  };

  useEffect(() => {
    fetchCategories();
    
  }, []);

  /**
   * Handle input changes and update formData state
   * @param {Object} e - Event object
   */
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /**
   * Handle form submission to create a new task
   * @param {Object} e - Event object
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    setSuccess(""); 

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    try {
      
      const payload = {
        title,
        description,
        category,
        dueDate: dueDate ? new Date(dueDate) : null,
      };

      await axiosInstance.post("/api/tasks", payload);

      setFormData({
        title: "",
        description: "",
        category: "Others",
        dueDate: "",
      });

      setSuccess("Task added successfully!");

     
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
      setError(
        error.response?.data?.message || "Failed to add task. Please try again."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 bg-white dark:bg-gray-700 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Add New Task</h2>
      
      {/* Display success message if any */}
      {success && (
        <p className="mb-4 text-green-500">
          {success}
        </p>
      )}

      {/* Display error message if any */}
      {error && (
        <p className="mb-4 text-red-500">
          {error}
        </p>
      )}

      <div className="flex flex-col space-y-4">
        {/* Task Title */}
        <div>
          <label htmlFor="title" className="block text-gray-700 dark:text-gray-300 mb-1">
            Title<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Enter task title"
            className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-600 text-gray-800 dark:text-gray-200"
            value={title}
            onChange={onChange}
            required
          />
        </div>

        {/* Task Description */}
        <div>
          <label htmlFor="description" className="block text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter task description (optional)"
            className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-600 text-gray-800 dark:text-gray-200"
            value={description}
            onChange={onChange}
            rows="3"
          ></textarea>
        </div>

        {/* Task Category */}
        <div>
          <label htmlFor="category" className="block text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-600 text-gray-800 dark:text-gray-200"
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
        </div>

        {/* Due Date */}
        <div>
          <label htmlFor="dueDate" className="block text-gray-700 dark:text-gray-300 mb-1">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-600 text-gray-800 dark:text-gray-200"
            value={dueDate}
            onChange={onChange}
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded transition duration-200"
          >
            Add Task
          </button>
        </div>
      </div>
    </form>
  );

};
TaskForm.propTypes = {
  fetchTasks: PropTypes.func.isRequired,
};

export default TaskForm;
