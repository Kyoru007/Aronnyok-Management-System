import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './components/login'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Lobby from './components/lobby'
import Profile from './components/Profile'
import Category from './components/category'
import Employee from './components/Employee'
import Home from './components/Home'
import AddCategory from './components/AddCategory'
import AddEmployee from './components/AddEmployee'
import University from './components/University'
import AddUniversity from './components/AddUniversity'
import Disciplines from './components/Discipline'
import EditEmployee from './components/EditEmployee'
import EmployeeLogin from './components/EmployeeLogin'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/employeelogin" element={<EmployeeLogin />} />
        <Route path="/bosslogin" element={<Login />} />
        <Route path="/lobby" element={<Lobby />}>

          <Route path="" element={<Home />} />
          <Route path="/lobby/employee" element={<Employee />} />
          <Route path="/lobby/category" element={<Category />} />
          <Route path="/lobby/profile" element={<Profile />} />
          <Route path="/lobby/add_category" element={<AddCategory />} />
          <Route path="/lobby/add_employee" element={<AddEmployee />} />
          <Route path="/lobby/university" element={<University />} />
          <Route path="/lobby/add_university" element={<AddUniversity />} />
          <Route path="/lobby/disciplines" element={<Disciplines />} />
          <Route path="/lobby/edit_employee/:id" element={<EditEmployee />} />

        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
