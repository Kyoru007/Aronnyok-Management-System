import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddCategory = () => {
    const [category, setCategory] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        alert(e)
        e.preventDefault();

        axios.post('http://localhost:3000/auth/add_category', { category })
            .then(result => {
                if (result.data.Status) {
                    navigate('/lobby/category');
                } else {
                    alert(result.data.Error);
                }
            })
            .catch(error => console.log(error));
    };

    return (
        <div className='d-flex justify-content-center align-items-center vh-75'>
            <div className='p-3 rounded w-200 border'>
                <h2>Add Category</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="category"><strong>Category</strong></label>
                        <input
                            type="text"
                            name="category"
                            placeholder="Enter category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className='form-control round-0'
                        />
                    </div>
                    <button className='btn btn-success w-100 rounded-0'>Add Category</button>
                </form>
            </div>
        </div>
    );
}

export default AddCategory;
