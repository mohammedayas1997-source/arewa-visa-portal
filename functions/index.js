const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// Callable function to set admin claim
exports.setAdminClaim = functions.https.onCall(async (data, context) => {
  // Check if the caller is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Request had no authentication."
    );
  }

  // Check if the caller is already an admin
  const callerUid = context.auth.uid;
  const callerToken = await admin.auth().getUser(callerUid);
  if (!callerToken.customClaims?.admin) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only admins can set admin claims."
    );
  }

  const uid = data.uid;
  if (!uid) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with a UID."
    );
  }

  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    return { message: `User ${uid} is now an admin.` };
  } catch (error) {
    throw new functions.https.HttpsError(
      "internal",
      error.message
    );
  }
});
