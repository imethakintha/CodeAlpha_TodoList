import { useEffect, useState } from "react";
import axios from "axios";
import TaskItem from "./TaskItem.jsx";
import TaskForm from "./TaskForm.jsx";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [categories] = useState([]);
  const [filter, setFilter] = useState({
    search: "",
    category: "All",
    status: "All",
    sort: "Newest",
  });

  const fetchTasks = async () => {
    try {
      const res = await axios.get("/api/tasks");
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks
    .filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(filter.search.toLowerCase());
      const matchesCategory =
        filter.category === "All" || task.category === filter.category;
      const matchesStatus =
        filter.status === "All" ||
        (filter.status === "Completed" && task.completed) ||
        (filter.status === "Pending" && !task.completed);
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      if (filter.sort === "Newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (filter.sort === "Oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (filter.sort === "Due Soon") {
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (filter.sort === "Due Later") {
        return new Date(b.dueDate) - new Date(a.dueDate);
      } else {
        return 0;
      }
    });

  return (
    <div className="max-w-2xl mx-auto p-4">
      <TaskForm fetchTasks={fetchTasks} />
      <div className="mb-4 flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
        <input
          type="text"
          placeholder="Search tasks..."
          className="p-2 border rounded flex-1"
          value={filter.search}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
        />
        <select
          className="p-2 border rounded"
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
        >
          <option value="Others">Others</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <select
          className="p-2 border rounded"
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
        >
          <option value="All">All Statuses</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
        </select>
        <select
          className="p-2 border rounded"
          value={filter.sort}
          onChange={(e) => setFilter({ ...filter, sort: e.target.value })}
        >
          <option value="Newest">Newest</option>
          <option value="Oldest">Oldest</option>
          <option value="Due Soon">Due Soon</option>
          <option value="Due Later">Due Later</option>
        </select>
      </div>
      {filteredTasks.length === 0 ? (
        <p className="text-center text-gray-500">
          No tasks match your criteria.
        </p>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <TaskItem key={task._id} task={task} fetchTasks={fetchTasks} />
          ))}
        </div>
      )}
    </div>
  );
};
export default TaskList;
