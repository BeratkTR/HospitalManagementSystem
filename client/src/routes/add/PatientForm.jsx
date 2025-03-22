import React, { useState } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"

const PatientForm = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const Navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const response = await axios.post("http://localhost:3002/api/patients", {
                name,
                password
            })
            toast.success(response.data.message, {position: "top-right"});
            Navigate("/");
        }
        catch(err){
            console.log(err);
            toast.error("Hasta oluşturma başarısız.", {position: "top-right"})
            Navigate("/");  
        } 
    }

    return(
        <>
            <div className="container container-sm">
                <form onSubmit={handleSubmit}>
                    <div class="mb-3">
                        <label for="name" class="form-label">İsim:</label>
                        <input type="text" class="form-control" id="name" name="name"  value={name} onChange={(e) => setName(e.target.value)}  autoComplete="off"/>
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">Şifre:</label>
                        <input type="text" class="form-control" id="password" name="password"  value={password} onChange={(e) => setPassword(e.target.value)}  autoComplete="off"/>
                    </div>
                    <button type="submit" class="btn btn-primary">Submit</button>
                </form>
            </div>
        </>
    )
}
export default PatientForm