import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


const EmployeeDetail = () => {
    const { id } = useParams(); // Getting employee ID from URL params
    const [employee, setEmployee] = useState(null); // State to hold employee details
    const [tasks, setTasks] = useState([]); // State to hold tasks and deadlines
    const navigate = useNavigate(); // For navigation (edit & logout)

    useEffect(() => {
        // Fetch employee details including tasks
        axios.get(`http://localhost:3000/employee/detail/${id}`)
            .then(result => {
                setEmployee(result.data.employee); // Assuming result.data.employee holds employee info
                setTasks(result.data.tasks); // Assuming result.data.tasks holds tasks
            })
            .catch(error => console.error(error));
    }, [id]);

    // Logout handler
    const handleLogout = () => {
        axios.post('http://localhost:3000/employee/logout') // Assuming backend handles logout with a POST request
            .then(() => {
                navigate('/employeelogin'); // Redirect to login page after logout
            })
            .catch(error => console.error("Logout failed:", error));
    };

    // Edit handler
    const handleEdit = () => {
        navigate(`/edit_employee/${id}`); // Redirect to the edit form with employee id
    };

    return (
        <div className="employee-detail">
            {employee ? (
                <>
                    <h1>Employee Details</h1>
                    <p><strong>Name:</strong> {employee.firstName} {employee.lastName}</p>
                    <p><strong>Email:</strong> {employee.email}</p>
                    <p><strong>Phone:</strong> {employee.telephone}</p>
                    <p><strong>Address:</strong> {employee.address}</p>
                    <p><strong>Discipline:</strong> {employee.disciplineName}</p>
                    <p><strong>University:</strong> {employee.universityName}</p>

                    <h2>Tasks & Deadlines</h2>
                    {tasks.length > 0 ? (
                        <ul>
                            {tasks.map(task => (
                                <li key={task.id}>
                                    <p><strong>Task:</strong> {task.title}</p>
                                    <p><strong>Description:</strong> {task.description}</p>
                                    <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
                                    <hr />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No tasks assigned.</p>
                    )}

                    {/* Logout and Edit buttons */}
                    <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                    <button className="btn btn-primary" onClick={handleEdit}>Edit Employee</button>
                </>
            ) : (
                <p>Loading employee details...</p>
            )}
        </div>
    );
};

export default EmployeeDetail;
