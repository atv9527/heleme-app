import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { image } = await req.json();
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = "分析这张饮料照片。请只返回 JSON 格式，不要有其他文字。格式如下：{ \"type\": \"种类\", \"amount\": 数字毫升, \"sugar\": \"高/中/低\", \"factor\": 0.0-1.0 }。如果是纯水，factor为1.0；含糖饮料为0.7；咖啡/茶为0.9。";

        const result = await model.generateContent([
            prompt,
            { inlineData: { data: image.split(',')[1], mimeType: "image/jpeg" } }
        ]);

        const responseText = result.response.text().replace(/```json|```/g, "");
        return NextResponse.json(JSON.parse(responseText));
    } catch (error) {
        return NextResponse.json({ error: "识别失败" }, { status: 500 });
    }
}