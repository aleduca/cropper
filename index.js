function Crop() {
    return {
        previewImage: null,
        saveImage: false,
        showRemoveCrop: true,
        crop: null,
        extensions: {
            'image/png': 'png',
            'image/jpeg': 'jpeg',
        },
        cropper() {
            this.crop = new Cropper(this.previewImage, {
                aspectRatio: 1 / 1,
            });
        },
        preview() {
            const image = this.$refs.image;

            const reader = new FileReader();
            reader.readAsDataURL(image.files[0]);

            setTimeout(() => {
                this.previewImage = this.$refs.image_preview;
                this.previewImage.src = reader.result;
                this.previewImage.setAttribute('width', '350px');
                this.previewImage.setAttribute('height', '250px');
                this.saveImage = true;
                this.cropper();
            }, 500);
        },

        removeCrop() {
            this.showRemoveCrop = false;
            this.crop.destroy();
        },

        addCrop() {
            this.showRemoveCrop = true;
            this.cropper();
        },

        getFile() {
            return new Promise((resolve, reject) => {
                if (!this.crop?.cropped) {
                    const formData = new FormData(this.$refs.form);

                    if (!this.extensions[formData.get('file')['type']]) {
                        reject('Extension not accept');
                    }

                    resolve(formData);
                }

                this.crop.getCroppedCanvas().toBlob(async (blob) => {
                    const formData = new FormData();

                    const extension =
                        this.extensions[blob['type']] ??
                        reject('Extension not accept');

                    formData.append('file', blob, 'image.' + extension);
                    resolve(formData);
                });
            });
        },

        async save() {
            const formData = await this.getFile();
            const { data } = await axios.post(
                'http://localhost:5000/upload.php',
                formData
            );

            console.log(data);
        },
    };
}
