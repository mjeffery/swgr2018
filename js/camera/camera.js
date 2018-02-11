class Camera {

    constructor(canvas) {
        this.framerate = 10/1000;
        this.canvas = canvas;
    }

    start() {
        this.stop();
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
        return this.imageToDataUri(this.canvas.width * .5, this.canvas.height * .5);
    }

    imageToDataUri(width, height) {
        return new Promise((resolve, reject)=>{
            // create an off-screen canvas
            var canvas = document.createElement('canvas');

            var img = document.createElement('img');
            document.body.append(canvas);
            document.body.append(img);
            canvas.style.display = "none";
            img.style.display = "none";
            img.src = this.canvas.toDataURL();
            img.onload = ()=> {
                // set its dimension to target size
                canvas.width = width;
                canvas.height = height;

                var ctx = canvas.getContext('2d');

                ctx.drawImage(img, 0, 0, width, height);
                setTimeout(()=>resolve(canvas.toDataURL()), 200);
            }
        })
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