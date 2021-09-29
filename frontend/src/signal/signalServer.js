import axios from "axios"
import util from "./helpers";

const signalServerBaseURL="http://localhost:4000"

const axiosInstance = axios.create({
  baseURL: signalServerBaseURL,
  headers: { "X-Requested-With": "XMLHttpRequest" },
});

/**
 * Signal server connector.
 * This component would connect to your signal server
 * for storing and fetching user public keys over HTTP.
 */

export class SignalServerStore {
  /**
   * When a user logs on they should generate their keys and then register them with the server.
   *
   * @param userId The user ID.
   * @param preKeyBundle The user's generated pre-key bundle.
   */
  registerNewPreKeyBundle(userId, preKeyBundle) {
    let storageBundle = { ...preKeyBundle };
    storageBundle.identityKey = util.arrayBufferToBase64(
      storageBundle.identityKey
    );
    storageBundle.preKeys = storageBundle.preKeys.map((preKey) => {
      return {
        ...preKey,
        publicKey: util.arrayBufferToBase64(preKey.publicKey),
      };
    });
    storageBundle.signedPreKey.publicKey = util.arrayBufferToBase64(
      storageBundle.signedPreKey.publicKey
    );
    storageBundle.signedPreKey.signature = util.arrayBufferToBase64(
      storageBundle.signedPreKey.signature
    );
    axiosInstance.post("/registerPreKeyBundle",{userId,preKeyBundle:storageBundle})
  }


  /**
   * Gets the pre-key bundle for the given user ID.
   * If you want to start a conversation with a user, you need to fetch their pre-key bundle first.
   *
   * @param userId The ID of the user.
   */
 async getPreKeyBundle(userId) {
    let res = await axiosInstance.get(`/getPrekeyBundle/${userId}`);
    let preKeyBundle=res.data;
    return {
      identityKey: util.base64ToArrayBuffer(preKeyBundle.identityKey),
      registrationId: preKeyBundle.registrationId,
      signedPreKey: {
        keyId: preKeyBundle.signedPreKey.keyId,
        publicKey: util.base64ToArrayBuffer(
          preKeyBundle.signedPreKey.publicKey
        ),
        signature: util.base64ToArrayBuffer(
          preKeyBundle.signedPreKey.signature
        ),
      },
      preKey:util.base64ToArrayBuffer(preKeyBundle.preKey.publicKey),
    };
  }
}

export default SignalServerStore;