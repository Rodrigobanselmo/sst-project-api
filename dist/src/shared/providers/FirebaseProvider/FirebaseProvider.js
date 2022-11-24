"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseProvider = void 0;
const common_1 = require("@nestjs/common");
const app_1 = require("firebase/app");
const auth_1 = require("firebase/auth");
class FirebaseProvider {
    constructor() {
        this.firebaseConfig = {
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            projectId: process.env.FIREBASE_PROJECT_ID,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.FIREBASE_MESSAGING,
            appId: process.env.FIREBASE_APP_ID,
            measurementId: process.env.FIREBASE_MEASUREMENT_ID,
        };
        this.firebaseApp = (0, app_1.initializeApp)(this.firebaseConfig);
        this.firebaseAuth = (0, auth_1.getAuth)(this.firebaseApp);
        this.firebaseAuth.languageCode = 'pt-br';
    }
    async validateGoogleToken(token) {
        const credential = auth_1.GoogleAuthProvider.credential(token);
        const result = await (0, auth_1.signInWithCredential)(this.firebaseAuth, credential).catch((error) => {
            const errorMessage = error.message;
            throw new common_1.InternalServerErrorException(errorMessage);
        });
        return result;
    }
}
exports.FirebaseProvider = FirebaseProvider;
//# sourceMappingURL=FirebaseProvider.js.map