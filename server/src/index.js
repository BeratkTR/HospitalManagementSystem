const express = require('express');
const cors = require('cors');
const db = require('../db/db.js');

const app = express();


app.use(express.json());
app.use(cors());

const middleWare = (request, response, next) => {
    console.log(`${request.method} -> ${request.url}`);
    next();
}
app.use(middleWare);




// Get Requests    --------------------------------------------------------------------------------------------------------------

// Get users, appointments --------------
app.get("/api/doctors", async(request, response) => {
    try{
        const result = await db.query(`SELECT doctors.id,
                                            doctors.name, 
                                            doctors.phone_number, 
                                            gender, 
                                            departments.name as departman_adi, 
                                            hastaneler.name as hastane_adi, 
                                            cities.name as city_name 
                                            FROM doctors 
                                                JOIN hastane_departmanlari ON doctors.department_id = hastane_departmanlari.id 
                                                JOIN departments ON departments.id = hastane_departmanlari.department_id 
                                                JOIN hastaneler ON hastaneler.id = hastane_departmanlari.hastane_id  
                                                JOIN cities ON cities.id = hastaneler.sehir_id 
                                            ORDER BY cities.name
                                                `);
        response.json(result.rows);
    }
    catch(err){
        console.log(err);
        response.sendStatus(500);
    }
})
app.get("/api/patients", async(request, response) => {
    try{
        const result = await db.query("SELECT * FROM patients;");
        response.json(result.rows);
    }
    catch(err){
        console.log(err);
        response.sendStatus(500);
    }
})
app.get("/api/appointments", async(request, response) => {
    try{
        const result = await db.query(`SELECT appointments.id AS appointment_id,
                                                patients.name AS patient_name, 
                                                doctors.name AS doctor_name,
                                                appointments.tarih as tarih, 
                                                appointments.saat as saat,
                                                doctors.name as doctor_name,
                                                patients.name as patient_name,
                                                hastaneler.name as hastane_adi,
                                                departments.name as bolum_adi
                                                FROM appointments 
                                                    JOIN doctors ON appointments.doctor_id = doctors.id 
                                                    JOIN patients ON appointments.patient_id = patients.id
                                                    JOIN hastane_departmanlari ON hastane_departmanlari.id = doctors.department_id
                                                    JOIN departments ON departments.id = hastane_departmanlari.department_id
                                                    JOIN hastaneler ON hastaneler.id = hastane_departmanlari.hastane_id
                                                    `);
        response.json(result.rows);
    }
    catch(err){
        console.log(err);
        response.sendStatus(500);
    }
}) 


// user bilgileri  --------
app.get("/api/doctor/:id", async(request, response) => {
    try{
        const id = request.params.id;

        const result = await db.query(`SELECT doctors.name,
                                                doctors.phone_number, 
                                                gender, 
                                                departments.id as departman_id, 
                                                departments.name as departman_adi, 
                                                hastaneler.id as hastane_id, 
                                                hastaneler.name as hastane_adi, 
                                                cities.name as city_name 
                                                FROM doctors 
                                                    JOIN hastane_departmanlari ON doctors.department_id = hastane_departmanlari.id 
                                                    JOIN departments ON departments.id = hastane_departmanlari.department_id 
                                                    JOIN hastaneler ON hastaneler.id = hastane_departmanlari.hastane_id 
                                                    JOIN cities ON cities.id = hastaneler.sehir_id     
                                                WHERE doctors.id = $1`, [id]);
        response.json(result.rows[0]);
    }
    catch(err){
        console.log(err);
        response.sendStatus(500);
    }
})

// Doktor Randevuları  ---------------
app.get("/api/doctorAppointments/:name", async(request, response) => {
    try{
        const {name} = request.params;

        const result = await db.query(`SELECT appointments.id AS appointment_id,
                                            appointments.tarih AS tarih,
                                            appointments.saat AS saat,
                                            patients.name AS patient_name,       
                                            patients.gender AS cinsiyet,
                                            patients.birth_date AS dogum_tarihi
                                            FROM appointments 
                                                JOIN patients ON appointments.patient_id = patients.id     
                                                JOIN doctors ON appointments.doctor_id = doctors.id
                                            WHERE doctors.name = $1;`, [name]);
        response.json(result.rows);
    }   
    catch(err){
        console.log(err);
        response.sendStatus(500);
    }
})

// Doktor id'si    ---------------
app.get("/api/doctorID/:name", async(request, response) => {
    try{
        const {name} = request.params;

        const result = await db.query(`SELECT id FROM doctors WHERE name = $1;`, [name]);
        response.json(result.rows);
    }   
    catch(err){
        console.log(err);
        response.sendStatus(500);
    }
})

// Hasta Randevuları   ---------------
app.get("/api/patientAppointments/:name", async(request, response) => {
    try{
        const {name} = request.params;

        const result = await db.query(`SELECT appointments.id, 
                                                appointments.tarih, 
                                                appointments.saat, 
                                                doctors.name, 
                                                departments.name AS bolum , 
                                                hastaneler.name as hastane_adı   
                                                FROM appointments 
                                                    JOIN patients ON appointments.patient_id = patients.id 
                                                    JOIN doctors ON appointments.doctor_id = doctors.id 
                                                    JOIN hastane_departmanlari on doctors.department_id = hastane_departmanlari.id   
                                                    JOIN hastaneler ON hastaneler.id = hastane_departmanlari.hastane_id  
                                                    JOIN departments ON departments.id = hastane_departmanlari.department_id    
                                                WHERE patients.name = $1;`, [name]);
        response.json(result.rows);
    }
    catch(err){
        console.log(err);
        response.sendStatus(500);
    }
})

// Finding appointment
app.get("/api/cities", async(request, response) => {
    try{
        const result = await db.query(`SELECT * FROM cities;`);
        response.json(result.rows);
    }
    catch(err){
        console.log(err);
        response.sendStatus(500);
    }
})
app.get("/api/departments/:city", async(request, response) => {
    try{
        const {city} = request.params;
        const result = await db.query(`SELECT DISTINCT departments.name  
                                                        FROM hastaneler 
                                                            JOIN cities ON hastaneler.sehir_id = cities.id 
                                                            JOIN hastane_departmanlari ON hastaneler.id = hastane_departmanlari.hastane_id 
                                                            JOIN departments ON departments.id = hastane_departmanlari.department_id   
                                                        WHERE cities.name = $1  
                                                        ORDER BY departments.name`, [city])
        response.json(result.rows);
    }
    catch(err){
        console.log(err);
        response.sendStatus(500);
    }
})
app.get("/api/hospitals/:city/:department", async(request, response) => {
    try{
        const {city, department} = request.params;
        const result = await db.query(`SELECT hastaneler.name  
                                            FROM hastaneler 
                                            JOIN cities ON hastaneler.sehir_id = cities.id 
                                            JOIN hastane_departmanlari ON hastaneler.id = hastane_departmanlari.hastane_id 
                                            JOIN departments ON departments.id = hastane_departmanlari.department_id  
                                        WHERE cities.name = $1 AND departments.name = $2`, [city, department])
        response.json(result.rows);
    }
    catch(err){
        console.log(err);
        response.sendStatus(500);
    }
})
app.get("/api/doctors/:city/:department/:hospital", async(request, response) => {
    try{
        const {city, department, hospital} = request.params;
        const result = await db.query(`SELECT doctors.name 
                                            FROM hastaneler 
                                            JOIN cities ON hastaneler.sehir_id = cities.id 
                                            JOIN hastane_departmanlari ON hastaneler.id = hastane_departmanlari.hastane_id  
                                            JOIN doctors ON doctors.department_id = hastane_departmanlari.id 
                                            JOIN departments ON departments.id = hastane_departmanlari.department_id  
                                        WHERE cities.name = $1 AND departments.name = $2 AND hastaneler.name = $3`, [city, department, hospital])
        response.json(result.rows);
    }
    catch(err){
        console.log(err);
        response.sendStatus(500);
    }
})
app.get("/api/appointments/:doctor/:date", async(request, response) => { //doktor ismi unique olduğu için
    try{
        const {doctor, date} = request.params;
        const result = await db.query(`SELECT * 
                                            FROM appointments 
                                            JOIN doctors ON appointments.doctor_id = doctors.id 
                                        WHERE doctors.name = $1 and appointments.tarih = $2`,[doctor, date])
        response.json(result.rows);
    }
    catch(err){
        console.log(err);
        response.sendStatus(500);
    }
})

// setting doctor deparment
app.get("/api/hospitals", async(request, response) => {
    try{
        const result = await db.query("SELECT id, name FROM hastaneler;");
        response.json(result.rows);
    }
    catch(err){
        console.log(err);
        response.sendStatus(500);
    }
})
app.get("/api/departmanlar/:hospitalID", async(request, response) => {
    try{
        const {hospitalID} = request.params;
        const result = await db.query(`SELECT departments.id, 
                                                departments.name 
                                                FROM hastaneler 
                                                JOIN hastane_departmanlari ON hastaneler.id = hastane_departmanlari.hastane_id 
                                                JOIN departments ON departments.id = hastane_departmanlari.department_id  
                                            WHERE hastaneler.id = $1`, [hospitalID]);
        response.json(result.rows);
    }
    catch(err){
        console.log(err);
        response.sendStatus(500);
    }
})
app.get("/api/hastanedeki_departman/:hospitalID/:departmentID", async(request, response) => {
    try{
        const {hospitalID, departmentID} = request.params;
        const result = await db.query(`SELECT id FROM hastane_departmanlari WHERE hastane_id = $1 AND department_id = $2`, [hospitalID, departmentID]);
        response.json(result.rows[0].id);
    }
    catch(err){
        console.log(err);
        response.sendStatus(500);
    }
})








// Post Requests    ----------------------------------------------------------------------------------------------------------------

// Login ---------------
app.post("/api/admin/login", async(request, response) => {
    try{
        const {body} = request;
        
        const result = await db.query("SELECT id, password FROM admin WHERE name = $1", [body.name])
        if(result.rowCount == 0)  return response.send({exists: false});
        if(result.rows[0].password !== body.password) return  response.send({exists: true, login:false})
        else
            response.send({exists: true, login: true, userID: result.rows[0].id});


    }catch(err){
        console.log(err);
        response.sendStatus(500);
    }
})
app.post("/api/doctor/login", async(request, response) => {
    try{
        const {body} = request;
        
        const result = await db.query("SELECT id, password FROM doctors WHERE name = $1", [body.name])
        if(result.rowCount == 0)  return response.send({exists: false});
        if(result.rows[0].password !== body.password) return  response.send({exists: true, login:false})
        else
            response.send({exists: true, login: true, userID: result.rows[0].id});


    }catch(err){
        console.log(err);
        response.sendStatus(500);
    }
})
app.post("/api/patient/login", async(request, response) => {
    try{
        const {body} = request;
        
        
        const result = await db.query("SELECT id, password FROM patients WHERE name = $1", [body.name])
        if(result.rowCount == 0)  return response.send({exists: false});
        if(result.rows[0].password !== body.password) return  response.send({exists: true, login:false})
        else  response.send({exists: true, login: true, userID: result.rows[0].id});


    }catch(err){
        console.log(err);
        response.sendStatus(500);
    }
})

// Yeni kullanıcı -----------
app.post("/api/patients", async(request, response) => {
    try{
        const {name, phoneNumber, password, gender, birthDate} = request.body;

        await db.query(`INSERT INTO patients(name, password) VALUES ($1, $2)`, [name, phoneNumber, password, gender, birthDate]);
        response.json({message: "Yeni hasta başarıyla oluşturuldu."});
    }
    catch(err){
        console.log(err);
        response.sendStatus(500);
    }
})
app.post("/api/doctors", async(request, response) => {
    try{
        const {name, phone_number, password, gender, department_id} = request.body;

        await db.query(`INSERT INTO doctors(name, password, phone_number, gender, department_id) VALUES ($1, $2, $3, $4, $5)`, [name, password, phone_number, gender, department_id]);
        response.json({message: "Yeni doktor başarıyla oluşturuldu."});
    }
    catch(err){
        console.log(err);
        response.sendStatus(500);
    }
})

// Yeni Randevu -----------------
app.post("/api/appointment", async(request, response) => {
    try{
        const {patient_id, doctor_id, tarih, saat} = request.body;

        await db.query(`INSERT INTO appointments(patient_id, doctor_id, tarih, saat) VALUES ($1,$2,$3,$4)`,[patient_id, doctor_id, tarih, saat]);
        response.json({message: "Randevu başarıyla oluşturuldu."});
    }
    catch(err){
        console.log(err);
        response.sendStatus(500);
    }
})


// Put Requests    --------------------------------------------------------------------------------------------------------------
app.put("/api/doctor/:id", async(request, response) => {
    try{    
        const {name, phone_number, gender, department_id} = request.body;
        const {id} = request.params;

        await db.query(`UPDATE doctors SET name = $1, phone_number = $2,  gender = $3, department_id = $4   WHERE id = $5`, [name, phone_number, gender, department_id, id]);
        response.send({message: "Doktor başarıyla güncellendi"});
    }
    catch(err){
        console.log(err);
        response.sendStatus(500);
    }
})


// Delete Requests    ----------------------------------------------------------------------------------------------------------------
app.delete("/api/doctors/:id", async(request, response) => {
    try{
        const id = parseInt(request.params.id);

        db.query("DELETE FROM doctors WHERE id = $1", [id]);
        response.send( {message: "Doktor başarıyla silindi."});
    }
    catch(err){
        console.log(err);
        response.sendStatus(500);
    }
})
app.delete("/api/patients/:id", async(request, response) => {
    try{
        const id = parseInt(request.params.id);

        db.query("DELETE FROM patients WHERE id = $1", [id]);
        response.send( {message: "Hasta başarıyla silindi."});
    }
    catch(err){
        console.log(err);
        response.sendStatus(500);
    }
})
app.delete("/api/appointments/:id", async(request, response) => {
    try{
        const id = parseInt(request.params.id);

        db.query("DELETE FROM appointments WHERE id = $1", [id]);
        response.send( {message: "Randevu başarıyla silindi."});
    }
    catch(err){
        console.log(err);
        response.sendStatus(500);
    }
})







const PORT = 3002;
app.listen(PORT, ()=> {
    console.log(`Server is running at ${PORT}`);
});

