import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddUniversity = () => {
    const [universityName, setUniversityName] = useState('');
    const [disciplines, setDisciplines] = useState(['']);
    const [universities, setUniversities] = useState([]);
    const [selectedUniversity, setSelectedUniversity] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3000/auth/university')
            .then(result => {
                if (result.data.Status) {
                    setUniversities(result.data.Result);
                } else {
                    alert(result.data.Error);
                }
            }).catch(err => console.log(err));
    }, []);

    const handleDisciplineChange = (index, event) => {
        const values = [...disciplines];
        values[index] = event.target.value;
        setDisciplines(values);
    };

    const handleAddDiscipline = () => {
        setDisciplines([...disciplines, '']);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = {
            name: universityName,
            disciplines: disciplines.filter(d => d) // Filter out empty values
        };
        axios.post('http://localhost:3000/auth/add_university', data)
            .then(result => {
                if (result.data.Status) {
                    alert('University and disciplines added successfully');
                } else {
                    alert(result.data.Error);
                }
            }).catch(err => console.log(err));
    };

    return (
        <div className='d-flex justify-content-center align-items-center vh-75'>
            <div className='p-3 rounded w-200 border'>
                <h2>Add University</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="university"><strong>University</strong></label>
                        <input
                            type="text"
                            name="university"
                            placeholder="Enter university name"
                            value={universityName}
                            onChange={(e) => setUniversityName(e.target.value)}
                            className='form-control round-0'
                        />
                    </div>

                    <button type="submit" className='btn btn-success w-100 rounded-0'>Add University </button>
                </form>
            </div>
        </div>
    );
};

export default AddUniversity;
