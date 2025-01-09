import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const CategoryList = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories');
      setCategories(res.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      await axios.post('/api/categories', { name: newCategory });
      setNewCategory('');
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`/api/categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div className="mb-4">
      <h3 className="text-xl font-semibold mb-2">Categories</h3>
      <form onSubmit={addCategory} className="flex space-x-2 mb-2">
        <input
          type="text"
          placeholder="New Category"
          className="p-2 border rounded flex-1"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
        >
          Add
        </button>
      </form>
      <ul>
        {categories.map((cat) => (
          <li key={cat._id} className="flex justify-between items-center mb-1">
            <span>{cat.name}</span>
            <button
              onClick={() => deleteCategory(cat._id)}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={() => onSelectCategory('')}
        className="mt-2 text-blue-500 hover:underline"
      >
        Clear Category Filter
      </button>
    </div>
  );
};



CategoryList.propTypes = {
  onSelectCategory: PropTypes.func.isRequired,
};

export default CategoryList;
