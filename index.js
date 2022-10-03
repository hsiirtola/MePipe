const firebaseConfig = {
    apiKey: "AIzaSyDuhbdlQzua-paTEDt8U4JRO3he4Wt3q3I",
    authDomain: "mepipe-82ef4.firebaseapp.com",
    projectId: "mepipe-82ef4",
    storageBucket: "mepipe-82ef4.appspot.com",
    messagingSenderId: "566872295316",
    appId: "1:566872295316:web:cc198b79a636b7ae01f181",
    measurementId: "G-LQE034K1NM"
}
firebase.initializeApp(firebaseConfig)

const db = firebase.firestore()

const colRef = db.collection('videos')

document.getElementById('file').addEventListener('change', e => {
    const now = new Date()
    const file = e.target.files[0]
    const storageRef = firebase.storage().ref('videos/' + file.name)
    const task = storageRef.put(file)
    task.on('state_changed', snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) *100
        const progressBar = document.getElementById('progress_bar')
        progressBar.value = progress
    })
    const url = storageRef.getDownloadURL().then(url => {
        console.log(url)
        colRef.add({
            title: document.getElementById('title').value,
            url: url,
            createdAt: firebase.firestore.Timestamp.fromDate(now)
        })
    })
})