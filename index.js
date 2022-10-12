const firebaseConfig = {
    apiKey: "AIzaSyDuhbdlQzua-paTEDt8U4JRO3he4Wt3q3I",
    authDomain: "mepipe-82ef4.firebaseapp.com",
    projectId: "mepipe-82ef4",
    storageBucket: "mepipe-82ef4.appspot.com",
    messagingSenderId: "566872295316",
    appId: "1:566872295316:web:cc198b79a636b7ae01f181",
    measurementId: "G-LQE034K1NM"
}
// Initializing FireBase
firebase.initializeApp(firebaseConfig)

const db = firebase.firestore()
const colRef = db.collection('videos')

//Create html block of each video references in database on snapshot
colRef.onSnapshot(col => {
    document.getElementById('videocontainer').innerHTML = ''
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
    // Add click event listener to each video card
    document.getElementById('videocontainer').addEventListener('click', e => {
        if(e.target.closest('.card')){
            console.log(e.target.closest('.card').querySelector('.card-title').textContent)
            videoTitle = e.target.closest('.card').querySelector('.card-title').textContent
            col.docs.forEach(doc => {
                // Check the title of the video and compare it to the database
                if(doc.data().title == videoTitle){
                    const videoUploaded = dateFns.distanceInWordsToNow(
                        doc.data().createdAt.toDate(),
                        { addSuffix: true }
                        )
                    // Set the localstorage variables to display them on the video page
                    videoTitle = doc.data().title
                    videoURL = doc.data().url
                    localStorage.setItem('videoTitle', videoTitle)
                    localStorage.setItem('videoUploaded', videoUploaded)
                    localStorage.setItem('videoURL', videoURL)
                }
            })
            // Link to video1.html
            window.location.href = 'video1.html'
        }
    })
})

// Change event listener on the file upload field
document.getElementById('file').addEventListener('change', e => {
    const now = new Date()
    const file = e.target.files[0]
    // Connect to FireBase storage
    const storageRef = firebase.storage().ref('videos/' + file.name
    // Add a click event listener to continue uploading selected file
    document.getElementById('fileupload').addEventListener('click', event => {
        event.preventDefault()
        storageRef.put(file).on('state_changed', snapshot => {
            // Snapshot and check the progress of the upload
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) *100
            const progressBar = document.getElementById('progress_bar')
            progressBar.style.display = 'inline-block'
            progressBar.value = progress
            // Check for upload done, then wait and add a document reference to the database
            if(progress === 100){
                setTimeout(() => {
                    const url = storageRef.getDownloadURL().then(url => {
                        console.log(url)
                        colRef.add({
                            title: document.getElementById('title').value,
                            url: url,
                            createdAt: firebase.firestore.Timestamp.fromDate(now)
                        })
                        // Reload the page to refresh memory and rearrange the website
                        setTimeout(() => {
                            document.location.reload(true)
                        }, 1000)
                    })
                }, 3000)
            }
        })
    })
})
