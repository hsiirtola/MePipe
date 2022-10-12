// Get variables from localstorage and pass them to the video player
document.getElementById('videoplayer').src = localStorage.getItem('videoURL')
document.getElementById('videotitle').textContent = localStorage.getItem('videoTitle')
document.getElementById('videouploadtime').textContent = localStorage.getItem('videoUploaded')
