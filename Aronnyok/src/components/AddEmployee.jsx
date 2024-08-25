import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const AddEmployee = () => {
    const [employee, setEmployee] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        address: '',
        university: '',
        discipline: '',
        password: '',
        confirmPassword: '',
        telephone: '',
        email: '',
        socialMedia: [''],
        image: null,
        idCardImage: null,
        emergencyContact: '',
        department: '',
        salary: ''
    });

    const [universities, setUniversities] = useState([]);
    const [disciplines, setDisciplines] = useState([]);
    const [departments, setDepartments] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        axios.get('http://localhost:3000/auth/university')
            .then(result => {
                if (result.data.Status) {
                    setUniversities(result.data.Result);
                } else {
                    alert(result.data.Error);
                }
            }).catch(err => console.error("Error fetching universities:", err));
    }, []);

    useEffect(() => {
        axios.get('http://localhost:3000/auth/disciplines')
            .then(result => {
                if (result.data.Status) {
                    console.log(result.data.Result)
                    setDisciplines(result.data.Result);
                } else {
                    alert(result.data.Error);
                    alert("painai")
                }
            }).catch(err => console.error("Error fetching disciplines:", err));
    }, []);

    useEffect(() => {
        axios.get('http://localhost:3000/auth/category')
            .then(result => {
                if (result.data.Status) {
                    setDepartments(result.data.Result);
                } else {
                    alert(result.data.Error);
                }
            }).catch(err => console.error("Error fetching disciplines:", err));
    }, []);

    // useEffect(() => {
    //     if (employee.university) {
    //         const filtered = disciplines.filter(d => d.universityId === employee.university);
    //         setFilteredDisciplines(filtered);
    //     } else {
    //         setFilteredDisciplines([]);
    //     }
    // }, [employee.university, disciplines]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee({
            ...employee,
            [name]: value
        });
    };

    const handleSocialMediaChange = (index, value) => {
        const newSocialMedia = [...employee.socialMedia];
        newSocialMedia[index] = value;
        setEmployee({
            ...employee,
            socialMedia: newSocialMedia
        });
    };

    const handleAddSocialMedia = () => {
        setEmployee(prevState => ({
            ...prevState,
            socialMedia: [...prevState.socialMedia, ""] // Add a new empty string to the array
        }));
    };


    const handleImageChange = (e) => {
        setEmployee({
            ...employee,
            [e.target.name]: e.target.files[0]
        });
    };

    const handleSubmit = (e) => {
        // Log the event object to see what's being passed
        console.log("Event:", e);

        // Prevent default form submission behavior
        e.preventDefault();

        // Debugging: Check the current state of the employee object
        console.log("Employee State:", employee);

        // Validate passwords match
        if (employee.password !== employee.confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        // Debugging: Log the data being sent to the server
        console.log("Data to send:", { employee });

        // Make the API call to add the employee
        axios.post('http://localhost:3000/auth/add_employee', { employee })
            .then(result => {
                console.log("Server Response:", result.data); // Log server response for debugging
                if (result.data.Status) {
                    navigate('/lobby/add_employee');
                } else {
                    alert(result.data.Error);
                }
            })
            .catch(error => {
                // Log detailed error information
                console.error("API Call Error:", error);
                console.error("Response Data:", error.response?.data);
            });


        // Log the employee object after attempting submission
        console.log("Employee after submission:", employee);
    };


    return (
        <div className='d-flex justify-content-center align-items-center vh-75'>
            <div className='p-3 rounded w-200 border'>
                <h2>Add Employee</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="firstName"><strong>First Name</strong></label>
                        <input
                            type="text"
                            name="firstName"
                            placeholder="Enter first name"
                            value={employee.firstName}
                            onChange={handleChange}
                            className='form-control round-0'
                        />
                    </div>

                    <div className='mb-3'>
                        <label htmlFor="middleName"><strong>Middle Name</strong></label>
                        <input
                            type="text"
                            name="middleName"
                            placeholder="Enter middle name"
                            value={employee.middleName}
                            onChange={handleChange}
                            className='form-control round-0'
                        />
                    </div>

                    <div className='mb-3'>
                        <label htmlFor="lastName"><strong>Last Name</strong></label>
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Enter last name"
                            value={employee.lastName}
                            onChange={handleChange}
                            className='form-control round-0'
                        />
                    </div>

                    <div className='mb-3'>
                        <label htmlFor="address"><strong>Address</strong></label>
                        <input
                            type="text"
                            name="address"
                            placeholder="Enter address"
                            value={employee.address}
                            onChange={handleChange}
                            className='form-control round-0'
                        />
                    </div>

                    <div className='mb-3'>
                        <label htmlFor="university"><strong>University</strong></label>
                        <select
                            name="university"
                            value={employee.university}
                            onChange={handleChange}
                            className='form-control round-0'
                        >
                            <option value="">Select University</option>
                            {universities.map((uni) => (
                                <option key={uni.Id} value={uni.Id}>
                                    {uni.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className='mb-3'>
                        <label htmlFor="discipline"><strong>University Discipline</strong></label>
                        <select
                            name="discipline"
                            value={employee.discipline}
                            onChange={handleChange}
                            className='form-control round-0'

                        >
                            <option value="">Select Discipline</option>
                            {disciplines.map((disc) => (
                                <option key={disc.id} value={disc.id}>
                                    {disc.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className='mb-3'>
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            value={employee.password}
                            onChange={handleChange}
                            className='form-control round-0'
                        />
                    </div>

                    <div className='mb-3'>
                        <label htmlFor="confirmPassword"><strong>Confirm Password</strong></label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm password"
                            value={employee.confirmPassword}
                            onChange={handleChange}
                            className='form-control round-0'
                        />
                    </div>

                    <div className='mb-3'>
                        <label htmlFor="telephone"><strong>Telephone</strong></label>
                        <input
                            type="text"
                            name="telephone"
                            placeholder="Enter telephone"
                            value={employee.telephone}
                            onChange={handleChange}
                            className='form-control round-0'
                        />
                    </div>

                    <div className='mb-3'>
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            value={employee.email}
                            onChange={handleChange}
                            className='form-control round-0'
                        />
                    </div>

                    <div className='mb-3'>
                        <label htmlFor="socialMedia"><strong>Social Media</strong></label>
                        {employee.socialMedia.map((sm, index) => (
                            <div key={index} className="mb-2">
                                <input
                                    type="text"
                                    value={sm}
                                    onChange={(e) => handleSocialMediaChange(index, e.target.value)}
                                    className='form-control round-0'
                                    placeholder="Enter social media link"
                                />
                                {index === employee.socialMedia.length - 1 && (
                                    <button
                                        type="button"
                                        className="btn btn-secondary mt-2"
                                        onClick={handleAddSocialMedia}
                                    >
                                        Add More
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className='mb-3'>
                        <label htmlFor="image"><strong>Image</strong></label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleImageChange}
                            className='form-control round-0'
                        />
                    </div>




                    <div className='mb-3'>
                        <label htmlFor="idCardImage"><strong>University ID Card Image</strong></label>
                        <input
                            type="file"
                            name="idCardImage"
                            onChange={handleImageChange}
                            className='form-control round-0'
                        />
                    </div>

                    <div className='mb-3'>
                        <label htmlFor="emergencyContact"><strong>Emergency Contact</strong></label>
                        <input
                            type="text"
                            name="emergencyContact"
                            placeholder="Enter emergency contact"
                            value={employee.emergencyContact}
                            onChange={handleChange}
                            className='form-control round-0'
                        />
                    </div>

                    <div className='mb-3'>
                        <label htmlFor="department"><strong>Department</strong></label>
                        <select
                            name="department"
                            value={employee.department}
                            onChange={handleChange}
                            className='form-control round-0'
                        >
                            <option value="">Select Department</option>
                            {departments.map((department) => (
                                <option key={department.id} value={department.id}>
                                    {department.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className='mb-3'>
                        <label htmlFor="salary"><strong>Univesity Id</strong></label>
                        <input
                            type="text"
                            name="salary"
                            placeholder="Enter salary"
                            value={employee.salary}
                            onChange={handleChange}
                            className='form-control round-0'
                        />
                    </div>

                    <button className='btn btn-success w-100 rounded-0'>Add Employee</button>
                </form>
            </div>
        </div>
    );
};


export default AddEmployee;