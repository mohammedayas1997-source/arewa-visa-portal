import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();

export const makeUserAdmin = async (uid) => {
  try {
    const setAdminClaim = httpsCallable(functions, "setAdminClaim");
    const result = await setAdminClaim({ uid });
    return result.data.message;
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};
