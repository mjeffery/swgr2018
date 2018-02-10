class Camera {

    constructor(canvas) {
        this.framerate = 10/1000;
        this.canvas = canvas;
    }

    start() {
        this.canvas.style.display = "block";
        this.isProcessing = false;
        this.interval = setInterval(() => {
            if(!this.isProcessing) {
                this.isProcessing = true;
                navigator.mediaDevices.getUserMedia({video: true})
                    .then((mediaStream)=> this.gotMedia(mediaStream))
                    .catch(() => {
                        console.log('Shits broke.')
                    });
            }
        }, this.framerate);
    }

    stop() {
        //this.canvas.style.display = "none";
        clearInterval(this.interval);
        if (this.videoDevice) this.videoDevice.stop();
    }

    getSnapshot() {
        return this.canvas.toDataURL();
    }

    processFrame(imageBitmap) {
        this.canvas.width = imageBitmap.width;
        this.canvas.height = imageBitmap.height;
        this.canvas.getContext('2d').drawImage(imageBitmap, 0, 0);
        this.isProcessing = false;
    }

    gotMedia(mediaStream) {
        // Extract video track.
        this.videoDevice = mediaStream.getVideoTracks()[0];
        // Check if this device supports a picture mode...
        let captureDevice = new ImageCapture(this.videoDevice);
        if (captureDevice) {
            //captureDevice.takePhoto().then(processPhoto).catch(stopCamera);
            captureDevice.grabFrame()
                .then((imageBitmap)=> this.processFrame(imageBitmap))
                .catch(() => {
                    console.log('Shits broke.')
                });
        }
    }
}