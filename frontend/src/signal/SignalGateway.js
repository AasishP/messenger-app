import util from "./helpers";
import SignalProtocolStore from "./InMemorySignalProtocolStore";

const libsignal = window.libsignal;


/**
 * A signal protocol manager.
 */
class SignalProtocolManager {
  constructor(userId, signalServerStore) {
    this.userId = userId;
    this.store = new SignalProtocolStore();
    this.signalServerStore = signalServerStore;
  }

  /**
   * Initialize the manager when the user logs on.
   */
  async initializeAsync() {
    await this._generateIdentityAsync();

    var preKeyBundle = await this._generatePreKeyBundleAsync();

    await this.signalServerStore.registerNewPreKeyBundle(this.userId, preKeyBundle);
  }

  /**
   * Encrypt a message for a given user.
   *
   * @param remoteUserId The recipient user ID.
   * @param message The message to send.
   */
  async encryptMessageAsync(remoteUserId, message) {
    var sessionCipher = this.store.loadSessionCipher(remoteUserId);

    if (sessionCipher == null) {
      var address = new libsignal.SignalProtocolAddress(remoteUserId, 123);
      // Instantiate a SessionBuilder for a remote recipientId + deviceId tuple.
      var sessionBuilder = new libsignal.SessionBuilder(this.store, address);

      var remoteUserPreKey =
        await this.signalServerStore.getPreKeyBundle(remoteUserId);
      // Process a prekey fetched from the server. Returns a promise that resolves
      // once a session is created and saved in the store, or rejects if the
      // identityKey differs from a previously seen identity for this address.
      await sessionBuilder.processPreKey(remoteUserPreKey);

      sessionCipher = new libsignal.SessionCipher(this.store, address);
      this.store.storeSessionCipher(remoteUserId, sessionCipher);
    }

    let cipherText = await sessionCipher.encrypt(util.toArrayBuffer(message));
    return cipherText;
  }

  /**
   * Decrypts a message from a given user.
   *
   * @param remoteUserId The user ID of the message sender.
   * @param cipherText The encrypted message bundle. (This includes the encrypted message itself and accompanying metadata)
   * @returns The decrypted message string.
   */
  async decryptMessageAsync(remoteUserId, cipherText) {
    let sessionCipher = this.store.loadSessionCipher(remoteUserId);

    if (sessionCipher == null) {
      let address = new libsignal.SignalProtocolAddress(remoteUserId, 123);
      let sessionCipher = new libsignal.SessionCipher(this.store, address);
      this.store.storeSessionCipher(remoteUserId, sessionCipher);
    }

    let messageHasEmbeddedPreKeyBundle = cipherText.type == 3;
    // Decrypt a PreKeyWhisperMessage by first establishing a new session.
    // Returns a promise that resolves when the message is decrypted or
    // rejects if the identityKey differs from a previously seen identity for this address.
    if (messageHasEmbeddedPreKeyBundle) {
      let decryptedMessage = await sessionCipher.decryptPreKeyWhisperMessage(
        cipherText.body,
        "binary"
      );
      return util.toString(decryptedMessage);
    } else {

      // Decrypt a normal message using an existing session
      let decryptedMessage = await sessionCipher.decryptWhisperMessage(
        cipherText.body,
        "binary"
      );
      return util.toString(decryptedMessage);
    }
  }

  /**
   * Generates a new identity for the local user.
   */
  async _generateIdentityAsync() {
    var results = await Promise.all([
      libsignal.KeyHelper.generateIdentityKeyPair(),
      libsignal.KeyHelper.generateRegistrationId(),
    ]);

    this.store.put("identityKey", results[0]);
    this.store.put("registrationId", results[1]);
  }

  /**
   * Generates a new pre-key bundle for the local user.
   *
   * @returns A pre-key bundle.
   */
  async _generatePreKeyBundleAsync() {
    var result = await Promise.all([
      this.store.getIdentityKeyPair(),
      this.store.getLocalRegistrationId(),
    ]);

    let identity = result[0];
    let registrationId = result[1];

    // PLEASE NOTE: I am creating set of 4 pre-keys for demo purpose only.
    // The libsignal-javascript does not provide a counter to generate multiple keys, contrary to the case of JAVA (KeyHelper.java)
    // Therefore you need to set it manually (as per my research)
    var keys = await Promise.all(
            libsignal.KeyHelper.generatePreKey(registrationId + 1),
            libsignal.KeyHelper.generatePreKey(registrationId + 2),
            libsignal.KeyHelper.generatePreKey(registrationId + 3),
            libsignal.KeyHelper.generatePreKey(registrationId + 4),
            libsignal.KeyHelper.generatePreKey(registrationId + 5),
            libsignal.KeyHelper.generatePreKey(registrationId + 6),
            libsignal.KeyHelper.generatePreKey(registrationId + 7),
            libsignal.KeyHelper.generatePreKey(registrationId + 8),
            libsignal.KeyHelper.generatePreKey(registrationId + 9),
            libsignal.KeyHelper.generatePreKey(registrationId + 10),    
    );

    let preKeys = keys
    let signedPreKey = await libsignal.KeyHelper.generateSignedPreKey(
      identity,
      registrationId + 1
    );

    preKeys.forEach((preKey) => {
      this.store.storePreKey(preKey.keyId, preKey.keyPair);
    });
    this.store.storeSignedPreKey(signedPreKey.keyId, signedPreKey.keyPair);

    let publicPreKeys = preKeys.map((preKey) => {
      return {
        keyId: preKey.keyId,
        publicKey: preKey.keyPair.pubKey,
      };
    });
    return {
      identityKey: identity.pubKey,
      registrationId: registrationId,
      preKeys: publicPreKeys,
      signedPreKey: {
        keyId: signedPreKey.keyId,
        publicKey: signedPreKey.keyPair.pubKey,
        signature: signedPreKey.signature,
      },
    };
  }
}

export async function createSignalProtocolManager(
  userid,
  signalServer
) {
  let signalProtocolManagerUser = new SignalProtocolManager(
    userid,
    signalServer
  );
  await Promise.all([signalProtocolManagerUser.initializeAsync()]);
  return signalProtocolManagerUser;
}
