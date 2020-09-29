import React, { useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Diagnosis, Patient } from '../types';
import { apiBaseUrl } from '../constants';
import {
  setDiagnoses,
  setOnePatientForMoreInfo,
  useStateValue,
} from '../state';
import EntryDetails from './EntryDetails';

const PatientPage: React.FC = () => {
  const [{ onePatient, diagnoses }, dispatch] = useStateValue();

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchOnePatient = async () => {
      try {
        const { data: patientFromApi } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(setOnePatientForMoreInfo(patientFromApi));
      } catch (error) {
        console.log(error);
      }
    };

    if (!onePatient) {
      fetchOnePatient();
    }
    if (onePatient && id !== onePatient.id) {
      fetchOnePatient();
    }
  }, [dispatch, id, onePatient]);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        const { data: diagnosesFromApi } = await axios.get<Diagnosis[]>(
          `${apiBaseUrl}/diagnoses`
        );
        dispatch(setDiagnoses(diagnosesFromApi));
      } catch (error) {
        console.log(error);
      }
    };

    if (diagnoses.length < 1) {
      fetchDiagnoses();
    }
  }, [diagnoses.length, dispatch]);

  const getDiagnosisDescription = (code: string) => {
    if (diagnoses.length > 0) {
      return diagnoses.find((e) => e.code === code)!.name;
    }
  };

  return (
    <>
      {onePatient && diagnoses ? (
        <div>
          <h2>{onePatient.name}</h2>
          <p>{onePatient.ssn}</p>
          <p>{onePatient.occupation}</p>
          {onePatient.entries.length > 0 ? <h3>Entries: </h3> : null}
          {onePatient.entries.map((entry) => {
            return (
              <div key={entry.id}>
                <p>
                  {entry.date} {entry.description}
                </p>
                <EntryDetails entry={entry} />
                <br />
                <p>Specialist: {entry.specialist}</p>
                <p>Diagnoses: </p>
                {entry.diagnosisCodes ? (
                  <ul>
                    {entry.diagnosisCodes.map((code) => (
                      <li key={code}>
                        {code} {getDiagnosisDescription(code)}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : (
        <h2>Something went wrong</h2>
      )}
    </>
  );
};

export default PatientPage;
