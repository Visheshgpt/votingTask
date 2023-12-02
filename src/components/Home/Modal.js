import { useVotingCalls } from "@/hooks/useCalls";
import React, { useState } from "react";

const Modal = ({ isOpen, onClose, onSubmit }) => {
  const { addCandidate } = useVotingCalls();
  const [totalcandidates, setTotalCandidates] = useState("");
  const [candidatesList, setCandidatesList] = useState(
    Array.from({ length: totalcandidates }, (_, index) => ({
      id: index + 1,
      value: "",
    }))
  );

  const handleInputChange = (e) => {
    if (e.target.value > 5) {
      alert("Max 5 Candidates allowed");
      return;
    }
    setTotalCandidates(e.target.value);
    setCandidatesList(
      Array.from({ length: e.target.value }, (_, index) => ({
        id: index + 1,
        value: "",
      }))
    );
  };

  const handleCandidateChange = (id, e) => {
    const updatedCandidatesList = candidatesList.map((candidate) => {
      if (candidate.id === id) {
        return { ...candidate, value: e.target.value };
      }
      return candidate;
    });
    setCandidatesList(updatedCandidatesList);
  };

  const handleSubmit = async () => {
    const list = [];
    candidatesList.forEach((candidate) => {
      if (!candidate.value) {
        alert("value missing");
        return;
      }
      list.push(candidate.value);
    });
    await addCandidate(list);
    onClose();
  };

  return (
    <div className={`modal ${isOpen ? "open" : ""} p-6 bg-gray-800 text-white`}>
      <div className="modal-content">
        <span className="close text-white" onClick={onClose}>
          &times;
        </span>

        <div className="flex">
          <div className="text-black">Total Number of Candidates:</div>
          <input
            value={totalcandidates}
            onChange={(e) => {
              handleInputChange(e);
            }}
            className="totalcandidates"
          />
        </div>

        {/* Render input fields dynamically based on totalcandidates */}
        {candidatesList.map((candidate) => (
          <input
            key={candidate.id}
            className="candidates"
            placeholder={`Candidate ${candidate.id}`}
            value={candidate.value}
            onChange={(e) => handleCandidateChange(candidate.id, e)}
          />
        ))}

        <br />

        <button onClick={handleSubmit} className="btn card-btn">
          Submit
        </button>
      </div>
    </div>
  );
};

export default Modal;
