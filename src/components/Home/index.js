"use client";

import { useVotingCalls } from "@/hooks/useCalls";
import { useWeb3React } from "@web3-react/core";
import React, { useState } from "react";
import useSWR from "swr";
import Modal from "./Modal";

const Home = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { account } = useWeb3React();
  const {
    getCurrentVotingId,
    getCurrentVotingDetails,
    isUserVoted,
    getOwner,
    getCurrentVoteInfo,
    finalizeVoting,
    vote,
  } = useVotingCalls();

  const { data: currentVotingId } = useSWR(
    "getCurrentVotingId",
    getCurrentVotingId
  );
  const { data: currentVotingDetails } = useSWR(
    [`getCurrentVotingDetails-${currentVotingId}`, currentVotingId],
    getCurrentVotingDetails
  );
  const { data: userVoted } = useSWR(
    [`isUserVoted-${currentVotingId}`, currentVotingId],
    isUserVoted
  );
  const { data: owner } = useSWR("getOwner", getOwner);
  const { data: currentVoteInfo } = useSWR(
    "getCurrentVoteInfo",
    getCurrentVoteInfo
  );

  const handleCreateNewVotingClick = () => {
    setModalOpen(true); // Open the modal when the button is clicked
  };

  const handleVote = async (candidateIndex) => {
    try {
      await vote(candidateIndex);
    } catch (error) {
      throw error;
    }
  };

  console.log(
    "currentVotingDetails",
    // currentVotingId,
    // currentVotingDetails,
    // currentVoteInfo,
    userVoted
  );

  return (
    <main>
      {account?.toLowerCase() === owner?.toLowerCase() && (
        <div className="flex" style={{ justifyContent: "space-between" }}>
          {(currentVotingId === 0 ||
            currentVotingDetails?.isVotingFinalize) && (
            <button
              className="btn card-btn"
              onClick={handleCreateNewVotingClick}
            >
              Create New Voting
            </button>
          )}

          {currentVotingId !== 0 && !currentVotingDetails?.isVotingFinalize && (
            <button className="btn card-btn" onClick={finalizeVoting}>
              Finalize Voting
            </button>
          )}
        </div>
      )}
      <div className="card p-4 md:p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="py-2">Candidate Name</th>
              {currentVotingDetails?.isVotingFinalize ? (
                <>
                  <th className="py-2">Vote Count</th>
                  <th className="py-2">Voters</th>
                </>
              ) : (
                <th className="py-2">Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentVoteInfo?.map((candidate, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">{candidate.candidateName}</td>
                {currentVotingDetails?.isVotingFinalize ? (
                  <>
                    <td className="py-2">{Number(candidate.count) || 0}</td>
                    <td className="py-2">
                      {candidate?.voters.join(", ") || ""}
                    </td>
                  </>
                ) : (
                  <td className="py-2">
                    <button
                      className="btn"
                      disabled={userVoted}
                      onClick={() => handleVote(index + 1)}
                    >
                      Vote
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
      </div>
    </main>
  );
};

export default Home;
