declare class FirebaseProvider {
    private firebaseApp;
    private firebaseAuth;
    private firebaseConfig;
    constructor();
    validateGoogleToken(token: string): Promise<import("@firebase/auth").UserCredential>;
}
export { FirebaseProvider };
