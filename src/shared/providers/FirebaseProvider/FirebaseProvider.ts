import { InternalServerErrorException } from '@nestjs/common';
import { FirebaseApp, initializeApp } from 'firebase/app';
import {
  Auth,
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';

class FirebaseProvider {
  private firebaseApp: FirebaseApp;
  private firebaseAuth: Auth;
  // private firebaseProvider: GoogleAuthProvider;
  private firebaseConfig: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
  };

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

    this.firebaseApp = initializeApp(this.firebaseConfig);
    this.firebaseAuth = getAuth(this.firebaseApp);
    this.firebaseAuth.languageCode = 'pt-br';
    // this.firebaseProvider = new GoogleAuthProvider();
  }

  async validateGoogleToken(token: string) {
    const credential = GoogleAuthProvider.credential(token);
    signInWithCredential(this.firebaseAuth, credential)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        const errorMessage = error.message;

        throw new InternalServerErrorException(errorMessage);
      });
  }
}

export { FirebaseProvider };
