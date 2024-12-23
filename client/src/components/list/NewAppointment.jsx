import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NewAppointment = () => {
    const Navigate = useNavigate();

    const [city, setCity] = useState('');
    const [department, setDepartment] = useState('');
    const [hospital, setHospital] = useState('');
    const [doctor, setDoctor] = useState('');
    const [date, setDate] = useState('');

    const [cities, setCities] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [doctors, setDoctors] = useState([]);

    const [doctorID, setDoctorID] = useState();

    useEffect(() => {
        const fetchData = async() => {
            const response = await axios.get("http://localhost:3002/api/cities");
            setCities(response.data);
        }
        fetchData();
    }, [])

    useEffect( () => {
        const fetchData = async() => {
            const response = await axios.get(`http://localhost:3002/api/departments/${city}`);
            setDepartments(response.data);
        }
        fetchData();
    }, [city])

    useEffect( () => {
        const fetchData = async() => {
            const response = await axios.get(`http://localhost:3002/api/hospitals/${city}/${department}`);
            setHospitals(response.data);
        }
        fetchData();
    }, [city, department])

    useEffect( () => {
        const fetchData = async() => {
            const response = await axios.get(`http://localhost:3002/api/doctors/${city}/${department}/${hospital}`);
            setDoctors(response.data);
        }
        fetchData();
    }, [city , department, hospital])

    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 15);
    // Dates to 'YYYY-MM-DD' format
    const todayFormatted = today.toISOString().split('T')[0];
    const maxDateFormatted = maxDate.toISOString().split('T')[0];

    const handleSubmit = () => {
        Navigate(`/appointments/${city}/${department}/${hospital}/${doctor}/${date}`);
    }


    return(
        <>
            <form onSubmit={handleSubmit}>
                <div class="mb-3">
                    <label for="city" class="form-label">Şehir:</label>
                    <select class="form-select mb-3" id="city" value={city} onChange={(e) => {setCity(e.target.value)}} required>
                        <option value={''} disabled hidden>Şehir seçiniz...</option>
                        {
                            cities.map((city, i) => {
                                return(
                                    <option key={i} value={city.name}>
                                        {city.name}
                                    </option>
                                )
                            })
                        }
                    </select>   
                </div>
                <div class="mb-3">
                    <label for="department" class="form-label">Departman:</label>
                    <select class="form-select mb-3" id="department" value={department} onChange={(e) => {setDepartment(e.target.value)}} required>
                        <option value={''} disabled hidden>Departman seçiniz...</option>
                        {
                            departments.map((department, i) => {
                                return(
                                    <option key={i} value={department.name}>
                                        {department.name}
                                    </option>
                                )
                            })
                        }
                    </select>           
                </div>
                <div class="mb-3">
                    <label for="hospital" class="form-label">Hastane:</label>
                    <select class="form-select mb-3" id="hospital" value={hospital} onChange={(e) => {setHospital(e.target.value)}} required>
                        <option value={''} disabled hidden>Hastane seçiniz...</option>
                        {
                            hospitals.map((hospital, i) => {
                                return(
                                    <option key={i} value={hospital.name}>
                                        {hospital.name}
                                    </option>
                                )
                            })
                        }
                    </select>           
                </div>
                <div class="mb-3">
                    <label for="doctor" class="form-label">Doktor:</label>
                    <select class="form-select mb-3" id="doctor" value={doctor} onChange={(e) => {setDoctor(e.target.value)}} required>
                        <option value={''} disabled hidden>Doktor seçiniz...</option>
                        {
                            doctors.map((doctor, i) => {
                                return(
                                    <option key={i} value={doctor.name}>
                                        {doctor.name}
                                    </option>
                                )
                            })
                        }
                    </select>           
                </div>
                <div class="mb-3">
                    <label for="date" class="form-label">Tarih:</label> <br/>
                    <input type="date" id="date-picker" value={date} onChange={(e) => {setDate(e.target.value);}} min={todayFormatted} max={maxDateFormatted} required/>          
                </div>
                <button type="submit" class="btn btn-primary">Randevu Ara</button>
            </form>
        </>
    )
}

export default NewAppointment