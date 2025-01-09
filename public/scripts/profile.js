//post file avatar
async function uploadImage() {
    console.log('Uploading image...');
    const fileInput = document.getElementById('imageUpload');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select an image to upload.');
        return;
    }

    const formData = new FormData();
    formData.append('avatar', file);
    formData.append('id', '1');

    try {
        const response = await fetch('/users/upload-avatar', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        if(response.ok) {
            document.getElementById('profileImage').src = result.data.avatar;
        }
        else {
            alert(result.message);
        }
    }
    catch (error) {
        console.error('Error uploading image:', error);
        alert('Error uploading image. Please try again.');
    }
}

document.getElementById('imageUpload').addEventListener('change', uploadImage);