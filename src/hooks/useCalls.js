import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import useVoting from "./useVoting";
import { calculateGasMargin } from "@/utils/helpers";

export const useVotingCalls = () => {
  const { account } = useWeb3React();
  const votingContract = useVoting();

  const getCurrentVotingId = useCallback(async () => {
    try {
      const votingId = await votingContract.methods.votingIdCounter().call();
      return Number(votingId);
    } catch (error) {
      throw error;
    }
  }, [votingContract]);

  const getCurrentVotingDetails = useCallback(
    async (param) => {
      try {
        const votingId = param[1];
        const votingDetails = await votingContract.methods
          .votingDetails(votingId)
          .call();
        return votingDetails;
      } catch (error) {
        throw error;
      }
    },
    [votingContract]
  );

  const isUserVoted = useCallback(async (params) => {
    try {
      const votingId = params[1];
      return await votingContract.methods.isUserVoted(account, votingId).call();
    } catch (error) {
      throw error;
    }
  }, [account, votingContract]);


  const getOwner = useCallback(async () => {
    try {
      const owner = await votingContract.methods.owner().call();
      return owner;
    } catch (error) {
      throw error;
    }
  }, [votingContract]);

  const getCurrentVoteInfo = useCallback(async () => {
    try {
      const voteInfo = await votingContract.methods.getCurrentVoteInfo().call();
      return voteInfo;
    } catch (error) {
      throw error;
    }
  }, [votingContract]);

  const addCandidate = useCallback(
    async (candidateList) => {
      try {
        const currentGasPrice = await window.web3.eth.getGasPrice();
        const data = await votingContract.methods.addCandidate(candidateList);
        const estimateGas = await data.estimateGas({
          from: account,
        });
        const gasLimit = calculateGasMargin(estimateGas, 10);

        const transaction = await window.web3.eth.sendTransaction({
          from: account,
          to: votingContract._address,
          data: data.encodeABI(),
          gasLimit,
        });
        console.log("transaction", transaction);
      } catch (error) {
        throw error;
      }
    },
    [account, votingContract]
  );

  const finalizeVoting = useCallback(async () => {
    try {
      const data = await votingContract.methods.finalizeVoting();
      const estimateGas = await data.estimateGas({
        from: account,
      });
      const gasLimit = calculateGasMargin(estimateGas, 10);

      const transaction = await window.web3.eth.sendTransaction({
        from: account,
        to: votingContract._address,
        data: data.encodeABI(),
        gasLimit,
      });
      console.log("transaction", transaction);
    } catch (error) {
      throw error;
    }
  }, [account, votingContract]);

  const vote = useCallback(
    async (candidateIndex) => {
      try {
        const data = await votingContract.methods.vote(candidateIndex);
        const estimateGas = await data.estimateGas({
          from: account,
        });
        const gasLimit = calculateGasMargin(estimateGas, 10);

        const transaction = await window.web3.eth.sendTransaction({
          from: account,
          to: votingContract._address,
          data: data.encodeABI(),
          gasLimit,
        });
        console.log("transaction", transaction);
      } catch (error) {
        throw error;
      }
    },
    [account, votingContract]
  );

  return {
    getCurrentVotingId,
    getCurrentVotingDetails,
    isUserVoted,
    getOwner,
    getCurrentVoteInfo,
    addCandidate,
    finalizeVoting,
    vote,
  };
};
