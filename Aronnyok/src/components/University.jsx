import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const University = () => {
    const [universities, setUniversities] = useState([]);
    const [selectedUniversity, setSelectedUniversity] = useState(null);
    const [disciplines, setDisciplines] = useState([]);
    const [newDisciplineName, setNewDisciplineName] = useState(""); // State for new discipline name

    useEffect(() => {
        axios.get('http://localhost:3000/auth/university')
            .then(result => {
                console.log("API Response:", result.data);
                if (result.data.Status) {
                    setUniversities(result.data.Result);
                } else {
                    alert(result.data.Error);
                }
            }).catch(err => {
                console.error("Error fetching universities:", err);
                alert("Failed to fetch universities.");
            });
    }, []);

    const handleUniversityClick = (universityId) => {
        console.log("Clicked University ID:", universityId); // Debugging line
        if (!universityId) {
            console.error("Invalid university ID:", universityId);
            alert("Invalid university ID.");
            return;
        }
        if (selectedUniversity === universityId) {
            // Collapse disciplines if the same university is clicked
            setSelectedUniversity(null);
            setDisciplines([]);
        } else {
            setSelectedUniversity(universityId);
            axios.get(`http://localhost:3000/auth/disciplines/${universityId}`)
                .then(result => {
                    console.log("Disciplines Response:", result.data);
                    if (result.data.Status) {
                        setDisciplines(result.data.Result);
                    } else {
                        alert(result.data.Error);
                    }
                }).catch(err => {
                    console.error("Error fetching disciplines:", err);
                    alert("Failed to fetch disciplines.");
                });
        }
    };

    const handleDeleteUniversity = (universityId) => {
        if (!universityId) {
            console.error("Invalid university ID:", universityId);
            return;
        }
        if (window.confirm("Are you sure you want to delete this university? All disciplines will also be deleted.")) {
            axios.delete(`http://localhost:3000/auth/delete_university/${universityId}`)
                .then(result => {
                    if (result.data.Status) {
                        setUniversities(prevUniversities => prevUniversities.filter(u => u.Id !== universityId));
                        setDisciplines([]); // Clear disciplines if a university is deleted
                        setSelectedUniversity(null); // Deselect university
                    } else {
                        alert(result.data.Error);
                    }
                }).catch(err => {
                    console.error("Error deleting university:", err);
                    alert("Failed to delete university.");
                });
        }
    };

    const handleDeleteDiscipline = (disciplineId) => {
        if (!disciplineId) {
            console.error("Invalid discipline ID:", disciplineId);
            return;
        }
        axios.delete(`http://localhost:3000/auth/delete_discipline/${disciplineId}`)
            .then(result => {
                if (result.data.Status) {
                    setDisciplines(prevDisciplines => prevDisciplines.filter(d => d.id !== disciplineId));
                } else {
                    alert(result.data.Error);
                }
            }).catch(err => {
                console.error("Error deleting discipline:", err);
                alert("Failed to delete discipline.");
            });
    };

    const handleAddDiscipline = (e) => {
        e.preventDefault(); // Prevent default form submission
        if (!newDisciplineName) {
            alert("Discipline name cannot be empty.");
            return;
        }
        if (!selectedUniversity) {
            alert("No university selected.");
            return;
        }
        axios.post('http://localhost:3000/auth/add_discipline', {
            university_id: selectedUniversity,
            name: newDisciplineName
        }).then(result => {
            if (result.data.Status) {
                setDisciplines(prevDisciplines => [...prevDisciplines, { name: newDisciplineName, id: result.data.NewDisciplineId }]);
                setNewDisciplineName(""); // Clear the input field
            } else {
                alert(result.data.Error);
            }
        }).catch(err => {
            console.error("Error adding discipline:", err);
            alert("Failed to add discipline.");
        });
    };

    return (
        <div className='px-5 mt-5'>
            <div className='d-flex justify-content-center'>
                <h3>University List</h3>
            </div>
            <Link to='/lobby/add_university' className='btn btn-danger'>Add University</Link>
            <div className="mt-3">
                <table className="table mt-3">
                    <thead>
                        <tr>
                            <th>University Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(universities) && universities.length > 0 ? (
                            universities.map((u) => (
                                <tr key={u.Id}>
                                    <td onClick={() => handleUniversityClick(u.Id)} style={{ cursor: 'pointer' }}>
                                        {u.name}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleDeleteUniversity(u.Id)}
                                        >
                                            Delete University
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2">No universities found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {selectedUniversity && (
                <div className='mt-5'>
                    <h4>Disciplines for Selected University</h4>
                    <form onSubmit={handleAddDiscipline} className="mb-3">
                        <input
                            type="text"
                            value={newDisciplineName}
                            onChange={(e) => setNewDisciplineName(e.target.value)}
                            placeholder="Enter discipline name"
                            className="form-control"
                        />
                        <button
                            type="submit"
                            className="btn btn-success mt-2"
                        >
                            Add Discipline
                        </button>
                    </form>
                    <table className="table mt-3">
                        <thead>
                            <tr>
                                <th>Discipline Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(disciplines) && disciplines.length > 0 ? (
                                disciplines.map((d) => (
                                    <tr key={d.id}>
                                        <td>{d.name}</td>
                                        <td>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleDeleteDiscipline(d.id)}
                                            >
                                                Delete Discipline
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2">No disciplines found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default University;
