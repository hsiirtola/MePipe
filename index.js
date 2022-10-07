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

colRef.onSnapshot(col => {
    col.docs.forEach(doc => {
        const when = dateFns.distanceInWordsToNow(
            doc.data().createdAt.toDate(),
            { addSuffix: true }
            )
        const html = `
        <div class="card" style="color:white;text-decoration: none;">
            <video class="card-img-top" src="${doc.data().url}"></video>
            <div class="card-body">
                <h5 class="card-title">${doc.data().title}</h5>
            </div>
            <div class="card-footer">
                <small class="text-muted">${when}</small>
            </div>
        </div>
        `
        document.getElementById('videocontainer').innerHTML += html
    })
    document.getElementById('videocontainer').addEventListener('click', e => {
        if(e.target.closest('.card')){
            console.log(e.target.closest('.card').querySelector('.card-title').textContent)
            videoTitle = e.target.closest('.card').querySelector('.card-title').textContent
            col.docs.forEach(doc => {
                if(doc.data().title == videoTitle){
                    const videoUploaded = dateFns.distanceInWordsToNow(
                        doc.data().createdAt.toDate(),
                        { addSuffix: true }
                        )
                    videoTitle = doc.data().title
                    videoURL = doc.data().url
                    localStorage.setItem('videoTitle', videoTitle)
                    localStorage.setItem('videoUploaded', videoUploaded)
                    localStorage.setItem('videoURL', videoURL)
                }
            })
            window.location.href = 'video1.html'
        }
    })
})

document.getElementById('file').addEventListener('change', e => {
    const now = new Date()
    const file = e.target.files[0]
    const storageRef = firebase.storage().ref('videos/' + file.name)
    document.getElementById('fileupload').addEventListener('click', event => {
        event.preventDefault()
        storageRef.put(file).on('state_changed', snapshot => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) *100
            const progressBar = document.getElementById('progress_bar')
            progressBar.style.display = 'inline-block'
            progressBar.value = progress
            if(progress === 100){
                setTimeout(() => {
                    const url = storageRef.getDownloadURL().then(url => {
                        console.log(url)
                        colRef.add({
                            title: document.getElementById('title').value,
                            url: url,
                            createdAt: firebase.firestore.Timestamp.fromDate(now)
                        })
                        setTimeout(() => {
                            document.location.reload(true)
                        }, 1000)
                    })
                }, 3000)
                document.getElementById('videocontainer').innerHTML = ''
            }
        })
    })
})