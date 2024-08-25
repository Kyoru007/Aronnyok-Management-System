import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Category = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/auth/category')
            .then(result => {
                console.log("API Response:", result.data); // Inspect the full response
                if (result.data.Status && result.data.Result) {
                    setCategories(result.data.Result);
                } else {
                    alert(result.data.Error || "No categories found.");
                }
            }).catch(err => {
                console.error("Error fetching categories:", err);
                alert("Failed to fetch categories.");
            });
    }, []);

    const handleDeleteCategory = (categoryId) => {
        if (!categoryId) {
            console.error("Invalid category ID:", categoryId);
            return;
        }
        if (window.confirm("Are you sure you want to delete this category?")) {
            axios.delete(`http://localhost:3000/auth/delete_category/${categoryId}`)
                .then(result => {
                    if (result.data.Status) {
                        setCategories(prevCategories => prevCategories.filter(c => c.id !== categoryId));
                    } else {
                        alert(result.data.Error);
                    }
                }).catch(err => {
                    console.error("Error deleting category:", err);
                    alert("Failed to delete category.");
                });
        }
    };

    return (
        <div className='px-5 mt-5'>
            <div className='d-flex justify-content-center'>
                <h3>Category List</h3>
            </div>
            <Link to='/lobby/add_category' className='btn btn-danger'>Add Category</Link>
            <div className="mt-3">
                <table className="table mt-3">
                    <thead>
                        <tr>
                            <th>Category Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(categories) && categories.length > 0 ? (
                            categories.map((c) => (
                                <tr key={c.id}>
                                    <td>{c.name}</td>
                                    <td>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleDeleteCategory(c.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2">No categories found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Category;
