import React, {useEffect, useState} from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const DoctorUpdate = () => {
    const {id} = useParams();
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [gender, setGender] = useState('');
    const [hospitalID, setHospitalID] = useState('');
    const [departmentID, setDepartmentID] = useState('');
    const [hospitalDepartmentID, setHospitalDepartmentID] = useState();

    const[hospitals, setHospitals] = useState([]);
    const [departments, setDepartments] = useState([]);

    useEffect(()=> {
        const fetchData = async() => {
            const response = await axios.get("http://localhost:3002/api/hospitals");
            setHospitals(response.data);
            
            const response2 = await axios.get(`http://localhost:3002/api/doctor/${id}`);
            setName(response2.data.name);
            setPhoneNumber(response2.data.phone_number);
            setGender(response2.data.gender);
            setHospitalID(response2.data.hastane_id);
            setDepartmentID(response2.data.departman_id);
        };
        fetchData();
    }, [])
    useEffect(() => {
        const fetchData = async() => {
            const response = await axios.get(`http://localhost:3002/api/departmanlar/${hospitalID}`);
            setDepartments(response.data);
        }
        fetchData();
    }, [hospitalID])
    useEffect(() => {
        const fetchData = async() => {
            const response = await axios.get(`http://localhost:3002/api/hastanedeki_departman/${hospitalID}/${departmentID}`);
            setHospitalDepartmentID(response.data);
        }
        fetchData();
    }, [hospitalID, departmentID])

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const response = await axios.put(`http://localhost:3002/api/doctor/${id}`, {
                name,
                phone_number: phoneNumber,
                gender,
                department_id: hospitalDepartmentID
            })
            toast.success(response.data.message, {position: "top-right"});
            history.back();
        }
        catch(err){
            console.log(err);
            toast.error("Doktor güncelleme başarısız.", {position: "top-right"})
            history.back();
        }
    }
    
    return(
        <>
            <div className="container-sm" style={styles.container}>
                <form onSubmit={handleSubmit}>
                    <div class="mb-3">
                        <label for="name" class="form-label">İsim:</label>
                        <input type="text" class="form-control" id="name" name="name"  value={name} onChange={(e) => setName(e.target.value)}  autoComplete="off" required/>
                        <label for="phoneNumber" class="form-label">Telefon numarası:</label>
                        <input type="text" class="form-control" id="phoneNumber" name="phoneNumber"  value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}  autoComplete="off" required/>
                        <label for="gender" class="form-label">Cinsiyet:</label>
                        <select class="form-select mb-3" id="gender" value={gender} onChange={(e) => {setGender(e.target.value)}} required>
                            <option value={''} disabled hidden>Cinsiyet seçiniz...</option>
                            <option value={'Kadın'}>Kadın</option>
                            <option value={'Erkek'}>Erkek</option>
                        </select>   
                        <label for="hospital" class="form-label">Hastane:</label>
                        <select class="form-select mb-3" id="hospital" value={hospitalID} onChange={(e) => {setHospitalID(e.target.value)}} required>
                            <option value={''} disabled hidden>Hastane seçiniz...</option>
                            {
                                hospitals.map((hospital, i) => {
                                    return(
                                        <option key={i} value={hospital.id}>
                                            {hospital.name}
                                        </option>
                                    )
                                })
                            }
                        </select>   
                        <label for="department" class="form-label">Bölüm:</label>
                        <select class="form-select mb-3" id="department" value={departmentID} onChange={(e) => {setDepartmentID(e.target.value)}}>
                            <option value={''} disabled hidden>Bölüm seçiniz...</option>
                            {
                                departments.map((department, i) => {
                                    return(
                                        <option key={i} value={department.id}>
                                            {department.name}
                                        </option>
                                    )
                                })
                            }
                        </select>   
                    </div>
                    <button type="submit" class="btn btn-primary">Submit</button>
                </form>
            </div>
        </>
    )
}

const styles = {
    container: {
        marginTop: "70px"
    }
}



export default DoctorUpdate