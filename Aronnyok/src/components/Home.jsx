import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [employeeCountByCategory, setEmployeeCountByCategory] = useState([]);
    const [employeeCountByUniversity, setEmployeeCountByUniversity] = useState([]);

    useEffect(() => {
        // Fetch total employees count
        axios.get('http://localhost:3000/auth/employee-count')
            .then(result => {
                if (result.data.Status) {
                    setTotalEmployees(result.data.TotalEmployees);
                } else {
                    console.error('Error:', result.data.Error);
                }
            }).catch(err => console.error('Error fetching total employees count:', err));

        // Fetch employees count by category
        axios.get('http://localhost:3000/auth/employee-count-by-category')
            .then(result => {
                if (result.data.Status) {
                    setEmployeeCountByCategory(result.data.EmployeeCountByCategory);
                } else {
                    console.error('Error:', result.data.Error);
                }
            }).catch(err => console.error('Error fetching employee count by category:', err));

        // Fetch employees count by university
        axios.get('http://localhost:3000/auth/employee-count-by-university')
            .then(result => {
                if (result.data.Status) {
                    setEmployeeCountByUniversity(result.data.EmployeeCountByUniversity);
                } else {
                    console.error('Error:', result.data.Error);
                }
            }).catch(err => console.error('Error fetching employee count by university:', err));
    }, []);

    return (
        <div className="container mt-5">
            <h1>Employee Dashboard</h1>

            <div className="mt-4">
                <h2>Total Employees: {totalEmployees}</h2>
            </div>

            <div className="mt-4">
                <h3>Employees by Department</h3>
                <ul>
                    {employeeCountByCategory.map((category, index) => (
                        <li key={index}>
                            {category.department}: {category.totalEmployees}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-4">
                <h3>Employees by University</h3>
                <ul>
                    {employeeCountByUniversity.map((university, index) => (
                        <li key={index}>
                            {university.university}: {university.totalEmployees}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Home;
