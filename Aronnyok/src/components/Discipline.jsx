import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Disciplines = () => {
    const [disciplines, setDisciplines] = useState([]);

    useEffect(() => {
        // Fetch all disciplines along with their associated universities
        axios.get('http://localhost:3000/auth/disciplines')
            .then(result => {
                if (result.data.Status) {
                    setDisciplines(result.data.Result);
                } else {
                    alert(result.data.Error);
                }
            }).catch(err => console.log(err));
    }, []);

    return (
        <div className='px-5 mt-5'>
            <h3>Manage Disciplines</h3>

            <h4>Disciplines List</h4>
            <ul>
                {disciplines.map(d => (
                    <li key={d.id}>
                        {d.name} || {d.universityName}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Disciplines;
