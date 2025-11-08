const apiKey = 'YOUR_API_KEY'; // جایگزین کنید
const apiEndpoint = 'https://api.openai.com/v1/images/generations'; // آدرس API OpenAI

async function processImages() {
    const clothingImageInput = document.getElementById('clothingImage');
    const personImageInput = document.getElementById('personImage');
    const resultImage = document.getElementById('resultImage');

    const clothingImageFile = clothingImageInput.files[0];
    const personImageFile = personImageInput.files[0];

    if (!clothingImageFile || !personImageFile) {
        alert('لطفا هر دو عکس را انتخاب کنید.');
        return;
    }

    const clothingImageBase64 = await toBase64(clothingImageFile);
    const personImageBase64 = await toBase64(personImageFile);

    const prompt = `Generate an image of a person wearing the clothing in the provided clothing image. The person's face and body should remain the same, but the clothing should be replaced with the clothing from the clothing image. Make sure the clothing fits the person naturally and the lighting and shadows are consistent.`;

    const data = {
        model: "dall-e-2", // یا "dall-e-3"
        prompt: prompt,
        n: 1, // تعداد تصاویر
        size: "512x512", // اندازه تصویر
        image: personImageBase64, // ارسال عکس شخص به عنوان ورودی
        mask: clothingImageBase64 // ارسال عکس لباس به عنوان ماسک
    };

    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        resultImage.src = result.data[0].url; // نمایش عکس تولید شده
    } catch (error) {
        console.error('Error:', error);
        alert('خطا در پردازش عکس.');
    }
}

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
