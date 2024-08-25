import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Employee = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskDeadline, setNewTaskDeadline] = useState('');
    const [showTaskInput, setShowTaskInput] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editingTaskDescription, setEditingTaskDescription] = useState('');
    const [editingTaskDeadline, setEditingTaskDeadline] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3000/auth/employee')
            .then((response) => {
                setEmployees(response.data);
            })
            .catch((error) => {
                console.error("There was an error fetching the employees!", error);
            });
    }, []);

    const handleEmployeeClick = (employeeId) => {
        if (selectedEmployee === employeeId) {
            setSelectedEmployee(null);
            setTasks([]);
        } else {
            setSelectedEmployee(employeeId);
            axios.get(`http://localhost:3000/auth/tasks/${employeeId}`)
                .then((response) => {
                    setTasks(response.data);
                })
                .catch((error) => {
                    console.error("There was an error fetching the tasks!", error);
                });
        }
    };

    const handleDeleteEmployee = (employeeId) => {
        axios.delete(`http://localhost:3000/auth/employee/${employeeId}`)
            .then(() => {
                setEmployees(employees.filter(employee => employee.id !== employeeId));
            })
            .catch((error) => {
                console.error("There was an error deleting the employee!", error);
            });
    };

    const handleDeleteTask = (taskId) => {
        axios.delete(`http://localhost:3000/auth/tasks/${taskId}`)
            .then(() => {
                setTasks(tasks.filter(task => task.id !== taskId));
            })
            .catch((error) => {
                console.error("There was an error deleting the task!", error);
            });
    };

    const handleAddTask = () => {
        const newTask = {
            description: newTaskDescription,
            deadline: newTaskDeadline,
            employeeId: selectedEmployee
        };

        axios.post(`http://localhost:3000/auth/tasks`, newTask)
            .then((response) => {
                setTasks([...tasks, response.data]);
                setNewTaskDescription('');
                setNewTaskDeadline('');
                setShowTaskInput(false);
            })
            .catch((error) => {
                console.error("There was an error adding the task!", error);
            });
    };

    const handleEditTask = (taskId) => {
        const updatedTask = {
            description: editingTaskDescription,
            deadline: editingTaskDeadline,
        };

        axios.put(`http://localhost:3000/auth/tasks/${taskId}`, updatedTask)
            .then((response) => {
                setTasks(tasks.map(task => task.id === taskId ? response.data : task));
                setEditingTaskId(null);
                setEditingTaskDescription('');
                setEditingTaskDeadline('');
            })
            .catch((error) => {
                console.error("There was an error updating the task!", error);
            });
    };

    const startEditingTask = (task) => {
        setEditingTaskId(task.id);
        setEditingTaskDescription(task.description);
        setEditingTaskDeadline(task.deadline);
    };

    return (
        <div className="employee-list">
            <Link to='/lobby/add_employee' className='btn btn-success'>Add Employee</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Phone No</th>
                        <th>Discipline</th>
                        <th>University</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(employee => (
                        <tr key={employee.id}>
                            <td onClick={() => handleEmployeeClick(employee.id)}>
                                {employee.firstName} {employee.lastName}
                            </td>
                            <td>{employee.telephone}</td>
                            <td>{employee.disciplineName}</td>
                            <td>{employee.universityName}</td>
                            <td>{employee.email}</td>
                            <td>{employee.address}</td>
                            <td>
                                <button onClick={() => handleDeleteEmployee(employee.id)} className="btn btn-danger">Delete</button>
                                <Link to={`/lobby/edit_employee/` + employee.id} className="btn btn-primary">Edit</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedEmployee && (
                <div className="tasks">
                    <h4>Tasks for {employees.find(emp => emp.id === selectedEmployee)?.firstName}</h4>
                    <ul>
                        {tasks.map(task => (
                            <li key={task.id}>
                                {editingTaskId === task.id ? (
                                    <div>
                                        <input
                                            type="text"
                                            value={editingTaskDescription}
                                            onChange={(e) => setEditingTaskDescription(e.target.value)}
                                            className="form-control"
                                        />
                                        <input
                                            type="date"
                                            value={editingTaskDeadline}
                                            onChange={(e) => setEditingTaskDeadline(e.target.value)}
                                            className="form-control"
                                        />
                                        <button onClick={() => handleEditTask(task.id)} className="btn btn-success">Save</button>
                                        <button onClick={() => setEditingTaskId(null)} className="btn btn-secondary">Cancel</button>
                                    </div>
                                ) : (
                                    <div>
                                        <p>{task.description}</p>
                                        <p>Deadline: {task.deadline}</p>
                                        <button onClick={() => handleDeleteTask(task.id)} className="btn btn-danger">Delete Task</button>
                                        <button onClick={() => startEditingTask(task)} className="btn btn-primary">Edit Deadline</button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                    <button className="btn btn-secondary" onClick={() => setShowTaskInput(!showTaskInput)}>
                        {showTaskInput ? "Cancel" : "Add Task"}
                    </button>

                    {showTaskInput && (
                        <div className="task-input">
                            <input
                                type="text"
                                placeholder="Task Description"
                                value={newTaskDescription}
                                onChange={(e) => setNewTaskDescription(e.target.value)}
                                className="form-control"
                            />
                            <input
                                type="date"
                                placeholder="Deadline"
                                value={newTaskDeadline}
                                onChange={(e) => setNewTaskDeadline(e.target.value)}
                                className="form-control"
                            />
                            <button onClick={handleAddTask} className="btn btn-success">Save Task</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Employee;
