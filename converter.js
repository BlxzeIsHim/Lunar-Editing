document.getElementById('convert').addEventListener('click', function () {
    const fileInput = document.getElementById('upload');
    const formatSelect = document.getElementById('format');

    const file = fileInput.files[0];
    const selectedFormat = formatSelect.value;

    if (!file) {
        alert('Please select an image file to convert.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            let dataUrl;
            switch (selectedFormat) {
                case 'image/jpeg':
                    dataUrl = canvas.toDataURL('image/jpeg', 0.8); // Quality set to 80%
                    break;
                case 'image/png':
                    dataUrl = canvas.toDataURL('image/png');
                    break;
                case 'image/bmp':
                    dataUrl = canvas.toDataURL('image/bmp');
                    break;
                case 'image/webp':
                    dataUrl = canvas.toDataURL('image/webp');
                    break;
                case 'image/gif':
                    dataUrl = canvas.toDataURL('image/gif');
                    break;
                case 'image/tiff':
                    dataUrl = canvas.toDataURL('image/tiff');
                    break;
                case 'image/svg+xml':
                    // SVG support needs additional handling and may require server-side processing
                    alert('SVG conversion is not supported.');
                    return;
                default:
                    alert('Unsupported format selected.');
                    return;
            }

            const downloadLink = document.getElementById('download');
            downloadLink.href = dataUrl;
            downloadLink.download = `converted.${selectedFormat.split('/')[1]}`;
            downloadLink.style.display = 'inline-block';
        };
        img.src = event.target.result;
    };

    reader.readAsDataURL(file);
});
