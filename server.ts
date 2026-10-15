import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import Redis from 'ioredis';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY || '';

// =========================================================================
// CẤU HÌNH REDIS ĐỒNG BỘ VỚI REDIS_URL CỦA VERCEL (CHO APP PĀḶI)
// =========================================================================
const redisUrl = process.env.REDIS_URL || '';
const isRedisEnabled = Boolean(redisUrl);

let redis: Redis | null = null;
if (isRedisEnabled) {
  try {
    redis = new Redis(redisUrl);
    redis.on('error', (err) => console.error('Redis Client Error:', err));
    console.log('Đã kết nối kho Redis thành công!');
  } catch (err) {
    console.error('Lỗi khởi tạo Redis:', err);
    redis = null;
  }
} else {
  console.log('Chưa cấu hình REDIS_URL, tạm thời tắt chức năng lưu trữ 0 đồng.');
}

const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const candidateModels = ['gemini-flash-latest', 'gemini-3.1-flash-lite', 'gemini-3.8-flash'];

async function generateWithFallback(prompt: string, systemInstruction: string, responseSchema?: any) {
  const config: any = {
    systemInstruction,
    temperature: 0.1,
  };

  if (responseSchema) {
    config.responseMimeType = 'application/json';
    config.responseSchema = responseSchema;
  }

  let lastError: any = null;
  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config,
      });
      if (response?.text) {
        return response.text;
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`Mô hình ${model} gặp lỗi:`, err?.message || err);
      await new Promise((r) => setTimeout(r, 250));
    }
  }

  throw lastError || new Error('Không thể kết nối đến hệ thống AI.');
}

// Word Analysis Table Schema (Used in Mode 1 & 2)
const wordTableSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: 'Tiêu đề bảng chia từ' },
    paradigmType: { type: Type.STRING, description: 'Loại biến cách (Danh từ / Động từ)' },
    rows: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          caseOrPerson: {
            type: Type.STRING,
            description: 'Tên cách hoặc ngôi BẰNG TIẾNG VIỆT có số thứ tự: 1. Chủ cách, 2. Đối cách... hoặc 1. Ngôi 3, 2. Ngôi 2, 3. Ngôi 1',
          },
          singularForm: { type: Type.STRING, description: 'Dạng số ít' },
          singularMeaning: { type: Type.STRING, description: 'Nghĩa tiếng Việt số ít' },
          pluralForm: { type: Type.STRING, description: 'Dạng số nhiều' },
          pluralMeaning: { type: Type.STRING, description: 'Nghĩa tiếng Việt số nhiều' },
          isCurrentSingular: { type: Type.BOOLEAN, description: 'True nếu trùng khớp dạng số ít hiện tại' },
          isCurrentPlural: { type: Type.BOOLEAN, description: 'True nếu trùng khớp dạng số nhiều hiện tại' },
        },
        required: ['caseOrPerson', 'singularForm', 'singularMeaning', 'pluralForm', 'pluralMeaning'],
      },
    },
  },
  required: ['title', 'rows'],
};

// Unified Router for all Tabs
app.post('/api/pali-hub', async (req: Request, res: Response) => {
  try {
    const { mode, input } = req.body;
    if (!input || typeof input !== 'string' || !input.trim()) {
      res.status(400).json({ error: 'Vui lòng cung cấp nội dung cần xử lý.' });
      return;
    }

    const cleanInput = input.trim();
    
    // TIỀN TỐ KHO LƯU TRỮ CHO DỰ ÁN PALI
    const cacheKey = \`pali_\${mode}_\${cleanInput.toLowerCase()}\`;

    // LƯỚI LỌC 0 ĐỒNG: ĐỌC DỮ LIỆU TỪ KHO
    if (isRedisEnabled && redis) {
      try {
        const cachedDataStr = await redis.get(cacheKey);
        if (cachedDataStr) {
          console.log('⚡ Đã lấy từ kho lưu trữ 0 đồng:', cacheKey);
          res.json({ mode, data: JSON.parse(cachedDataStr) });
          return; // Dừng lại, bốc dữ liệu ra ngay không tốn tiền gọi AI
        }
      } catch (e) {
        console.warn('Lỗi đọc kho (vẫn tiếp tục gọi AI):', e);
      }
    }

    let resultText = '';

    // TAB 1: Tra từ Pāḷi - Việt
    if (mode === 'pali-to-vi') {
      const systemInstruction = \`Bạn là chuyên gia ngôn ngữ cổ Pāḷi. Khi tôi nhập một từ Pāḷi bất kỳ, hãy phân tích cực kỳ gãy gọn và chính xác theo 4 ý sau: 1. Từ gốc & Từ loại (ngữ căn, từ gốc, loại từ). 2. Hình thái hiện tại (Cách mấy, Ngôi mấy, Thì gì, Số ít/nhiều). 3. Nghĩa trực tiếp (Dịch chuẩn xác nhất). 4. Bảng chia từ (Kẻ bảng Markdown liệt kê toàn bộ biến cách/ngôi). Không giải thích lan man.
QUY TẮC CỘT CÁCH/NGÔI:
Cột 'Cách / Ngôi' (trong Markdown và trong tableData.rows) BẮT BUỘC ghi bằng TIẾNG VIỆT có số thứ tự:
1. Chủ cách, 2. Đối cách, 3. Sử dụng cách, 4. Chỉ định cách, 5. Xuất xứ cách, 6. Sở thuộc cách, 7. Định vị cách, 8. Hô cách (hoặc 1. Ngôi 3, 2. Ngôi 2, 3. Ngôi 1 đối với động từ).\`;

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          analyzedWord: { type: Type.STRING },
          rootAndType: {
            type: Type.OBJECT,
            properties: {
              root: { type: Type.STRING },
              base: { type: Type.STRING },
              wordType: { type: Type.STRING },
              genderOrClass: { type: Type.STRING },
              etymologyNote: { type: Type.STRING },
            },
            required: ['root', 'base', 'wordType'],
          },
          currentMorphology: {
            type: Type.OBJECT,
            properties: {
              classification: { type: Type.STRING },
              paliTerm: { type: Type.STRING },
              number: { type: Type.STRING },
              summary: { type: Type.STRING },
              alternativeForms: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['classification', 'number', 'summary'],
          },
          directMeaning: { type: Type.STRING },
          markdownTable: { type: Type.STRING },
          tableData: wordTableSchema,
          formattedMarkdown: { type: Type.STRING },
        },
        required: ['analyzedWord', 'rootAndType', 'currentMorphology', 'directMeaning', 'markdownTable', 'tableData', 'formattedMarkdown'],
      };

      resultText = await generateWithFallback(\`Từ Pāḷi: "\${cleanInput}"\`, systemInstruction, responseSchema);
    }

    // TAB 2: Tra từ Việt - Pāḷi
    else if (mode === 'vi-to-pali') {
      const systemInstruction = \`Bạn là chuyên gia ngôn ngữ cổ Pāḷi. Tìm từ Pāḷi sát nghĩa tiếng Việt nhất và phân tích gãy gọn theo 3 ý: 1. Từ gốc & Từ loại. 2. Hình thái hiện tại (Cách, Ngôi, Thì, Số). 3. Bảng chia từ (Kẻ bảng Markdown toàn bộ biến cách/ngôi). Không giải thích lan man.
QUY TẮC CỘT CÁCH/NGÔI:
Cột 'Cách / Ngôi' (trong Markdown và trong tableData.rows) BẮT BUỘC ghi bằng TIẾNG VIỆT có số thứ tự:
1. Chủ cách, 2. Đối cách, 3. Sử dụng cách, 4. Chỉ định cách, 5. Xuất xứ cách, 6. Sở thuộc cách, 7. Định vị cách, 8. Hô cách (hoặc 1. Ngôi 3, 2. Ngôi 2, 3. Ngôi 1 đối với động từ).\`;

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          vietnameseWord: { type: Type.STRING },
          analyzedWord: { type: Type.STRING, description: 'Từ Pāḷi tương ứng chuẩn xác nhất' },
          rootAndType: {
            type: Type.OBJECT,
            properties: {
              root: { type: Type.STRING },
              base: { type: Type.STRING },
              wordType: { type: Type.STRING },
              genderOrClass: { type: Type.STRING },
              etymologyNote: { type: Type.STRING },
            },
            required: ['root', 'base', 'wordType'],
          },
          currentMorphology: {
            type: Type.OBJECT,
            properties: {
              classification: { type: Type.STRING },
              paliTerm: { type: Type.STRING },
              number: { type: Type.STRING },
              summary: { type: Type.STRING },
            },
            required: ['classification', 'number', 'summary'],
          },
          markdownTable: { type: Type.STRING },
          tableData: wordTableSchema,
          formattedMarkdown: { type: Type.STRING },
        },
        required: ['vietnameseWord', 'analyzedWord', 'rootAndType', 'currentMorphology', 'markdownTable', 'tableData', 'formattedMarkdown'],
      };

      resultText = await generateWithFallback(\`Từ tiếng Việt: "\${cleanInput}"\`, systemInstruction, responseSchema);
    }

    // TAB 3: Dịch câu Pāḷi - Việt
    else if (mode === 'sentence-pali-to-vi') {
      const systemInstruction = \`Bạn là trợ lý phân tích cú pháp Pāḷi kinh điển. BẮT BUỘC kết quả phân tích từng từ trong câu phải có đầy đủ 3 lớp dữ liệu:
1. [Từ Pāḷi]: Từ Pāḷi trong câu (nguyên dạng đang phân tích).
2. [Nghĩa tiếng Việt trực tiếp]: Dịch nghĩa tiếng Việt chuẩn xác và trực tiếp nhất của từ tại đúng hình thái ngữ pháp đó trong câu (ví dụ: "Đức Phật", "giáo pháp", "thuyết giảng", "đi đến", "các vị Tỳ-khưu"...).
3. [Giải phẫu ngữ pháp chi tiết]:
   - Ký hiệu viết tắt cú pháp: ví dụ (m/a, c1, si), (m/a, c2, si), (v, pres, p3, si)...
   - Giải nghĩa chi tiết về giống, vĩ ngữ, cách, số, thì, ngôi.
Cuối cùng xuất ra: "=> [Bản dịch tiếng Việt mượt mà]".\`;

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          originalSentence: { type: Type.STRING },
          words: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING, description: 'Từ Pāḷi trong câu' },
                vietnameseMeaning: { type: Type.STRING, description: 'Nghĩa tiếng Việt trực tiếp của từ tại hình thái ngữ pháp trong câu' },
                abbreviation: { type: Type.STRING, description: 'Ký hiệu viết tắt cú pháp, ví dụ: (m/a, c1, si) hoặc (v, pres, p3, si)' },
                detailedAnalysis: { type: Type.STRING, description: 'Giải phẫu ngữ pháp chi tiết: giống, vĩ ngữ, cách, số, thì, ngôi' },
              },
              required: ['word', 'vietnameseMeaning', 'abbreviation', 'detailedAnalysis'],
            },
          },
          smoothTranslation: { type: Type.STRING, description: 'Bản dịch tiếng Việt mượt mà hoàn chỉnh của toàn câu' },
          rawOutput: { type: Type.STRING, description: 'Toàn văn định dạng đúng yêu cầu 3 lớp dữ liệu và => [Bản dịch tiếng Việt mượt mà]' },
        },
        required: ['originalSentence', 'words', 'smoothTranslation', 'rawOutput'],
      };

      resultText = await generateWithFallback(\`Câu Pāḷi: "\${cleanInput}"\`, systemInstruction, responseSchema);
    }

    // TAB 4: Dịch câu Việt - Pāḷi
    else if (mode === 'sentence-vi-to-pali') {
      const systemInstruction = \`Bạn là học giả Pāḷi. Dịch câu sang tiếng Pāḷi (tuân thủ SOV). Trình bày 3 phần: 1. BẢN DỊCH PĀḶI. 2. GIẢI TRÌNH NGỮ PHÁP (Phân tích ngược câu vừa dịch bằng ký hiệu viết tắt). 3. LƯU Ý DỊCH THUẬT (Chỉ 1-2 câu nếu phức tạp).\`;

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          originalSentence: { type: Type.STRING },
          paliTranslation: { type: Type.STRING, description: '1. Bản dịch tiếng Pāḷi chuẩn cú pháp SOV (Chủ ngữ - Bổ ngữ - Vị ngữ)' },
          grammarBreakdown: { type: Type.STRING, description: '2. Giải trình ngữ pháp (phân tích ngược câu vừa dịch bằng ký hiệu viết tắt)' },
          translationNotes: { type: Type.STRING, description: '3. Lưu ý dịch thuật (1-2 câu ngắn gọn nếu phức tạp)' },
          rawOutput: { type: Type.STRING, description: 'Toàn bộ 3 phần định dạng văn bản chuẩn' },
        },
        required: ['originalSentence', 'paliTranslation', 'grammarBreakdown', 'rawOutput'],
      };

      resultText = await generateWithFallback(\`Câu tiếng Việt: "\${cleanInput}"\`, systemInstruction, responseSchema);
    }
    
    else {
      res.status(400).json({ error: \`Chế độ không hợp lệ: \${mode}\` });
      return;
    }

    const finalData = JSON.parse(resultText);

    // LƯU KẾT QUẢ VÀO KHO
    if (isRedisEnabled && redis) {
      try {
        await redis.set(cacheKey, JSON.stringify(finalData));
      } catch (e) {
        console.warn('Lỗi lưu kho:', e);
      }
    }
    
    res.json({ mode, data: finalData });

  } catch (err: any) {
    console.error('Lỗi API pali-hub:', err);
    res.status(500).json({ error: 'Lỗi khi xử lý: ' + (err?.message || 'Lỗi nội bộ.') });
  }
});

// Legacy backward-compatible endpoint for existing calls
app.post('/api/analyze-pali', async (req: Request, res: Response) => {
  try {
    const { word } = req.body;
    if (!word) {
      res.status(400).json({ error: 'Thiếu từ cần tra.' });
      return;
    }
    const response = await fetch(\`http://localhost:\${port}/api/pali-hub\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'pali-to-vi', input: word }),
    });
    const result = await response.json();
    if (result.data) {
      // Map formattedMarkdown to fourPointsFormattedMarkdown for backward-compat
      res.json({
        ...result.data,
        fourPointsFormattedMarkdown: result.data.formattedMarkdown,
      });
    } else {
      res.status(500).json(result);
    }
  } catch (e: any) {
    res.status(500).json({ error: e?.message });
  }
});

// Mounting Vite in development or static in production
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(\`Server Pāḷi Nirutti Multi-Module running on port \${port}\`);
});
