from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pytesseract
from pdf2image import convert_from_bytes
from io import BytesIO
import logging

# ตั้งค่าการบันทึก log ข้อผิดพลาด
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Origin ที่อนุญาต
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    return {"message": "Welcome to the Fuel Receipt Upload API"}

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    try:
        if file.content_type != 'application/pdf':
            raise HTTPException(status_code=400, detail="Invalid file type. Please upload a PDF.")

        # อ่านข้อมูลจากไฟล์ที่อัปโหลดเข้ามา
        file_content = await file.read()

        # แปลง PDF เป็นภาพ โดยใช้ convert_from_bytes สำหรับข้อมูลที่เป็น binary
        pdf_images = convert_from_bytes(file_content)

        # ดึงข้อมูลจากแต่ละหน้า (สำหรับการแปลงภาพเป็นข้อความ)
        extracted_data = []
        for page_image in pdf_images:
            text = pytesseract.image_to_string(page_image, lang='tha')
            extracted_data.append(text)

        return {"data": extracted_data}

    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")
