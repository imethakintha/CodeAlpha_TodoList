import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const TaskForm = ({ fetchTasks }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Others",
    dueDate: "",
  });

  const [categories, setCategories] = useState([]);

  const { title, description, category, dueDate } = formData;

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await axios.post("/api/tasks", {
        title,
        description,
        category,
        dueDate: dueDate ? new Date(dueDate) : null,
      });
      setFormData({
        title: "",
        description: "",
        category: "Others",
        dueDate: "",
      });
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 bg-white rounded shadow">
      <div className="flex flex-col space-y-2">
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          className="p-2 border rounded"
          value={title}
          onChange={onChange}
          required
        />
        <textarea
          name="description"
          placeholder="Task Description"
          className="p-2 border rounded"
          value={description}
          onChange={onChange}
        ></textarea>
       
        <input
          type="date"
          name="dueDate"
          className="p-2 border rounded"
          value={dueDate}
          onChange={onChange}
        />
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
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Task
        </button>
      </div>
    </form>
  );
};

TaskForm.propTypes = {
  fetchTasks: PropTypes.func.isRequired,
};

export default TaskForm;
