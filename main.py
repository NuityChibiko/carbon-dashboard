from fastapi import FastAPI, UploadFile, File, HTTPException
import pytesseract
from pdf2image import convert_from_bytes
from io import BytesIO

app = FastAPI()

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    try:
        # อ่านข้อมูลจากไฟล์ที่อัปโหลดเข้ามา
        file_content = await file.read()

        # แปลง PDF เป็นภาพ โดยใช้ convert_from_bytes สำหรับข้อมูลที่เป็น binary
        pdf_images = convert_from_bytes(file_content)

        # ดึงข้อมูลจากแต่ละหน้า (สำหรับการแปลงภาพเป็นข้อความ)
        extracted_data = []
        for page_image in pdf_images:
            text = pytesseract.image_to_string(page_image, lang='tha')
            # สามารถเพิ่มการประมวลผลเพื่อดึงข้อมูลที่ต้องการจาก text ตรงนี้ได้

            # เพิ่มข้อมูลที่ดึงมาในรายการ
            extracted_data.append(text)

        return {"data": extracted_data}

    except Exception as e:
        # จับข้อผิดพลาดแล้วส่งกลับเป็น HTTP 500
        raise HTTPException(status_code=500, detail=str(e))
