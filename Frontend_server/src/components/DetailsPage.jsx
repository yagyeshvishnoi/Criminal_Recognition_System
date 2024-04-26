import { useLocation } from 'react-router-dom';
import '../style.css'; // Import the CSS file for styling

const Details = () => {
  const location = useLocation();
  const data = location.state.data;
    console.log(data);
  return (
    <div class = "detail">
      {data && (
        <div>
        <div class ="header"><h1 class = "head">Recognized Faces</h1></div>
          <ul>
            {data.recognized_faces && data.recognized_faces.map((face) => (
              <li key={face.id} class = "box">
                <p >Name: {face.name}</p>
                <p>Id: {face.id}</p>
                <p>Date of Birth: {face.date_of_birth}</p>
                <p>Weight: {face.weight} pounds</p>
                <p>Hair: {face.hair}</p>
                <p>Sex: {face.sex}</p>
                <p>Height: {face.height} inches</p>
                <p>Race: {face.race}</p>
                <p>Eyes: {face.eyes}</p>
                <p>Admission Date: {face.admission_date}</p>
                <p>Projected Parole Date: {face.projected_parole_date}</p>
                <p>Last Paroled Date: {face.last_paroled_date}</p>
                <p>Projected Discharge Date: {face.projected_discharge_date}</p>
                <p>Parent Institution: {face.parent_institution}</p>
                <p>Offender Status: {face.offender_status}</p>
                <p>Location: {face.location}</p>
                <p>Sex Offender Registry Required: {face.sex_offender_registry_required ? 'Yes' : 'No'}</p>
              </li>
            ))}
          </ul>
          <p>Processing Time (seconds): {data.processing_time_seconds}</p>
        </div>
      )}
    </div>
  );
};

export default Details;
