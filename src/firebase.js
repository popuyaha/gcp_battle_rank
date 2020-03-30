import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const config = {
  apiKey: 'AIzaSyBfwBPJzFoekAD4o_wpiYHISCskGTb6HkY',
  authDomain: 'mlog-gcp.firebaseapp.com',
  databaseURL: 'https://mlog-gcp.firebaseio.com',
  projectId: 'mlog-gcp',
  storageBucket: 'mlog-gcp.appspot.com',
  messagingSenderId: '64190399018',
  appId: '1:64190399018:web:40e3b29d09ee057fa23953',
  measurementId: 'G-KWKGPRV0KK'
}
firebase.initializeApp(config)
export default firebase
