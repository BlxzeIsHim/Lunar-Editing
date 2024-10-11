document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("file-input");
    const compressionLevel = document.getElementById("compression-level");
    const compressButton = document.getElementById("compress-button");
    const resultContainer = document.getElementById("result-container");

    compressButton.addEventListener("click", async () => {
        const files = fileInput.files;

        if (files.length === 0) {
            alert("Please select at least one file to compress.");
            return;
        }

        // Clear previous results
        resultContainer.innerHTML = "";

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const originalSize = (file.size / 1024).toFixed(2); // Size in KB
            let compressedFile;

            // Determine the type of file and compress accordingly
            if (file.type.startsWith('image/')) {
                const compressionRatio = compressionLevel.value / 100; // Compression level
                compressedFile = await compressImage(file, compressionRatio);
            } else if (file.type.startsWith('video/')) {
                const compressionRatio = Math.max(0, Math.min(compressionLevel.value, 100)); // Ensure valid range
                compressedFile = await compressVideo(file, compressionRatio);
            } else if (file.type === 'image/gif') {
                const compressionRatio = Math.max(0, Math.min(compressionLevel.value, 100)); // Ensure valid range
                compressedFile = await compressGIF(file, compressionRatio);
            } else {
                alert(`Unsupported file type: ${file.type}`);
                continue;
            }

            const compressedSize = (compressedFile.size / 1024).toFixed(2); // Size in KB

            // Create result elements
            const resultDiv = document.createElement("div");
            resultDiv.className = "result-item";
            resultDiv.innerHTML = `
                <h3>File: ${file.name}</h3>
                <p>Original Size: ${originalSize} KB</p>
                <p>Compressed Size: ${compressedSize} KB</p>
                <a href="${URL.createObjectURL(compressedFile)}" download="${file.name}">Download Compressed File</a>
            `;
            resultContainer.appendChild(resultDiv);
        }
    });

    // Function to compress the image
    async function compressImage(file, compressionRatio) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;

                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    canvas.width = img.width * compressionRatio; // Adjust width based on compression ratio
                    canvas.height = img.height * compressionRatio; // Adjust height based on compression ratio
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    canvas.toBlob((blob) => {
                        if (blob) {
                            resolve(new File([blob], file.name, { type: file.type }));
                        } else {
                            reject(new Error("Compression failed."));
                        }
                    }, file.type, compressionRatio); // Use the same type as original
                };

                img.onerror = (error) => {
                    reject(new Error("Image loading failed."));
                };
            };

            reader.onerror = (error) => {
                reject(new Error("File reading failed."));
            };

            reader.readAsDataURL(file);
        });
    }

    // Function to compress video
    async function compressVideo(file, compressionRatio) {
        const ffmpeg = createFFmpeg({ log: true });
        await ffmpeg.load();
        ffmpeg.FS('writeFile', file.name, await fetchFile(file));
        const outputFileName = `compressed_${file.name}`;
        await ffmpeg.run('-i', file.name, '-b:v', `${compressionRatio * 1000}k`, outputFileName);
        const data = ffmpeg.FS('readFile', outputFileName);
        return new File([data.buffer], outputFileName, { type: file.type });
    }

    // Function to compress GIF
    async function compressGIF(file, compressionRatio) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const gif = new GIF({
                    workers: 2,
                    quality: compressionRatio,
                });
                gif.addFrame(event.target.result, { delay: 200 });
                gif.on('finished', (blob) => {
                    const compressedFile = new File([blob], `compressed_${file.name}`, { type: 'image/gif' });
                    resolve(compressedFile);
                });
                gif.render();
            };

            reader.onerror = (error) => {
                reject(new Error("GIF loading failed."));
            };

            reader.readAsArrayBuffer(file);
        });
    }
});
