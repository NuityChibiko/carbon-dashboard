import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const apiUrl = "https://apis.aigen.online/aiscript/utility-electricitybill/v1";

export async function POST(req: NextRequest) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json(
        { error: "Missing imageBase64 in request body" },
        { status: 400 }
      );
    }

    const response = await axios.post(
      apiUrl,
      { image: imageBase64 },
      {
        headers: {
          "x-aigen-key": process.env.NEXT_PUBLIC_AIGEN_API_KEY,
        },
      }
    );

    return NextResponse.json(response.data); // ส่งผลลัพธ์กลับไปยัง client
  } catch (error) {
    console.error("Error calling aiScript API:", error);
    return NextResponse.json(
      { error: "Failed to call aiScript API", details: error },
      { status: 500 }
    );
  }
}
