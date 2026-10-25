import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

interface DiscussionReply {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  isTeacher?: boolean;
  isAi?: boolean;
}

interface DiscussionPost {
  id: string;
  author: string;
  avatar: string;
  title: string;
  content: string;
  timestamp: string;
  likes: number;
  tags: string[];
  replies: DiscussionReply[];
}

// In-memory mock database for discussions & leaderboard with persistence fallback
let discussions: DiscussionPost[] = [
  {
    id: 'disc-1',
    author: 'Nguyễn Văn Minh (Lớp 11A1)',
    avatar: '👨‍🎓',
    title: 'Cách tìm thiết diện nhanh nhất khi mặt phẳng cắt qua 3 điểm?',
    content: 'Khi mặt phẳng (MNP) cắt tứ diện ABCD mà M trên AB, N trên AC, P trên BD thì bước đầu tiên nên kéo dài MN cắt BC hay xét giao tuyến nào trước ạ?',
    timestamp: '2 giờ trước',
    likes: 14,
    tags: ['Thiết diện', 'Tứ diện', 'Giao tuyến'],
    replies: [
      {
        id: 'rep-1',
        author: 'Thầy Trần Quang Vinh (Giáo viên)',
        avatar: '👨‍🏫',
        content: 'Chào em! Quy tắc chuẩn là: Tìm giao tuyến có sẵn trước (MN trong (ABC)). Vì MN và BC cùng nằm trong mp(ABC) và không song song, ta kéo dài MN cắt BC tại điểm I. Khi đó I thuộc mp(BCD), nối IP sẽ cắt CD tại Q. Thiết diện là tứ giác MNPQ!',
        timestamp: '1 giờ trước',
        isTeacher: true
      }
    ]
  },
  {
    id: 'disc-2',
    author: 'Lê Thuỳ Trang (Lớp 11B2)',
    avatar: '👩‍🎓',
    title: 'Phân biệt tiên đề 3 và tính chất xác định mặt phẳng',
    content: 'Tại sao từ tiên đề 3 (nếu đường thẳng có 2 điểm phân biệt thuộc mp thì mọi điểm thuộc mp) lại suy ra được một đường thẳng và 1 điểm ngoài nó xác định 1 mặt phẳng?',
    timestamp: '5 giờ trước',
    likes: 9,
    tags: ['Tiên đề', 'Mặt phẳng xác định'],
    replies: [
      {
        id: 'rep-2',
        author: 'AI Trợ Giảng GeoSpace',
        avatar: '🤖',
        content: 'Vì lấy 2 điểm phân biệt A, B trên đường thẳng d và điểm M ngoài d, ta có 3 điểm A, B, M không thẳng hàng. Theo Tiên đề 2, có duy nhất 1 mp(P) qua 3 điểm này. Theo Tiên đề 3, đường thẳng d có A, B thuộc (P) nên d nằm hoàn toàn trong (P). Vậy (P) chính là mặt phẳng xác định duy nhất bởi d và M!',
        timestamp: '4 giờ trước',
        isAi: true
      }
    ]
  }
];

let leaderboard = [
  { rank: 1, name: 'Hoàng Minh Tuấn', school: 'THPT Chuyên KHTN', score: 2850, streak: 14, badges: ['Bậc thầy Tiên đề', 'Thợ săn Thiết diện'] },
  { rank: 2, name: 'Nguyễn Diệu Linh', school: 'THPT Chuyên Hà Nội - Amsterdam', score: 2720, streak: 12, badges: ['Thần đồng 3D', 'Giải nhanh'] },
  { rank: 3, name: 'Trần Gia Huy', school: 'THPT Lê Hồng Phong', score: 2640, streak: 9, badges: ['Chuyên gia Giao tuyến'] },
  { rank: 4, name: 'Phạm Phương Anh', school: 'THPT Quốc Học Huế', score: 2490, streak: 8, badges: ['Học viên tích cực'] },
  { rank: 5, name: 'Đặng Tuấn Kiệt', school: 'THPT Chuyên Lam Sơn', score: 2310, streak: 7, badges: ['Tứ diện vương'] }
];

// Helper: Init Google Gen AI
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API: AI Solver & Tutor
app.post('/api/ai/solve', async (req: Request, res: Response) => {
  try {
    const { problemTitle, problemDescription, userQuestion, language = 'vi', stepContext } = req.body;
    const ai = getAiClient();

    if (!ai) {
      // Intelligent fallback when API key is not yet set in environment
      return res.json({
        success: true,
        isFallback: true,
        explanation: language === 'vi' 
          ? `### Hướng dẫn giải chi tiết theo Tiên đề Hình học Không gian:\n\n` +
            `**1. Phân tích giả thiết:**\n` +
            `- Dựa vào **Tiên đề 4 (Giao tuyến hai mặt phẳng)**: Nếu hai mặt phẳng phân biệt có một điểm chung thì chúng có một đường thẳng chung duy nhất chứa tất cả các điểm chung.\n` +
            `- Dựa vào **Tiên đề 3 (Đường thẳng trong mặt phẳng)**: Để tìm giao điểm của đường thẳng d và mặt phẳng (P), ta chọn mặt phẳng phụ (Q) chứa d, sau đó tìm giao tuyến a = (P) ∩ (Q). Giao điểm của d và a chính là giao điểm cần tìm.\n\n` +
            `**2. Phương pháp giải theo từng bước:**\n` +
            `- **Bước 1:** Xác định điểm chung thứ nhất (thường là đỉnh chung như S).\n` +
            `- **Bước 2:** Trong mặt phẳng đáy hoặc mặt phẳng phụ, kéo dài hai đường thẳng không song song để tìm điểm chung thứ hai.\n` +
            `- **Bước 3:** Nối hai điểm chung ta được giao tuyến cần tìm.\n` +
            `- **Bước 4:** Giới hạn đoạn thẳng để tìm đa giác thiết diện khép kín.`
          : `### Step-by-Step Spatial Geometry Guidance:\n\n` +
            `**1. Foundational Axiom Analysis:**\n` +
            `- Using **Axiom 4 (Intersection of Two Planes)**: If two distinct planes share a point, they share a unique line containing all common points.\n` +
            `- Using **Axiom 3**: To find line-plane intersections, choose an auxiliary plane containing the line, find the intersection line, and compute their planar intersection.\n\n` +
            `**2. Step-by-Step Algorithm:**\n` +
            `- **Step 1:** Identify the first common vertex.\n` +
            `- **Step 2:** In the base plane, extend coplanar non-parallel lines to find the second intersection point.\n` +
            `- **Step 3:** Connect points to form the line of intersection.\n` +
            `- **Step 4:** Trace polygon boundary edges to obtain the complete cross-section.`
      });
    }

    const systemPrompt = `Bạn là một Chuyên gia Sư phạm Toán học Hình học Không gian lớp 11 cao cấp (GeoSpace 3D Master Tutor).
Chuyên môn sâu:
1. 5 Tiên đề hình học không gian (Hilbert / Chương trình GDPT Việt Nam).
2. Cách xác định mặt phẳng (3 điểm không thẳng hàng, 1 điểm và 1 đường thẳng, 2 đường thẳng cắt nhau, 2 đường thẳng song song).
3. Phương pháp tìm giao tuyến của 2 mặt phẳng (tìm 2 điểm chung).
4. Phương pháp tìm giao điểm của đường thẳng và mặt phẳng.
5. Phương pháp tìm thiết diện (cross-section) của hình chóp, hình tứ diện.
6. Chứng minh 3 điểm thẳng hàng, 3 đường thẳng đồng quy.

Hãy trình bày lời giải rõ ràng, mạch lạc, định dạng Markdown đẹp, nêu rõ từng bước suy luận hình học, tiên đề hoặc định lý áp dụng, và chỉ dẫn học sinh cách xoay quan sát mô hình 3D. Trả lời bằng ngôn ngữ: ${language === 'vi' ? 'Tiếng Việt' : 'English'}.`;

    const userPrompt = `Bài toán: ${problemTitle || 'Hình học không gian'}
Đề bài: ${problemDescription || ''}
Bối cảnh bước hiện tại: ${stepContext || 'Toàn bộ bài toán'}
Câu hỏi của học viên: ${userQuestion || 'Hãy giải thích chi tiết phương pháp giải bài này từng bước.'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.3,
      }
    });

    res.json({
      success: true,
      explanation: response.text,
      isFallback: false
    });
  } catch (error: any) {
    console.error('Error generating AI explanation:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate explanation'
    });
  }
});

// API: AI Personalized Roadmap
app.post('/api/ai/roadmap', async (req: Request, res: Response) => {
  try {
    const { userStats, language = 'vi' } = req.body;
    const ai = getAiClient();

    if (!ai) {
      return res.json({
        success: true,
        recommendations: [
          {
            level: 'Cơ bản',
            topic: 'Nắm vững 5 Tiên đề Không Gian & 3 Cách Xác Định Mặt Phẳng',
            action: 'Ôn tập tương tác 3D Tiên đề 2 & Tiên đề 4 (Giao tuyến 2 mặt phẳng)',
            status: 'Khuyên dùng'
          },
          {
            level: 'Trung bình',
            topic: 'Kỹ năng tìm điểm chung thứ hai bằng cách kéo dài cạnh đáy',
            action: 'Thực hành bài toán Giao tuyến Hình chóp đáy hình thang',
            status: 'Cần cải thiện'
          },
          {
            level: 'Nâng cao',
            topic: 'Kỹ thuật tìm thiết diện mở rộng mặt phẳng (MNP)',
            action: 'Thử thách bài tập Thiết diện Tứ diện và Mini-game Thợ săn Giao Tuyến',
            status: 'Mục tiêu tuần'
          }
        ]
      });
    }

    const prompt = `Phân tích dữ liệu học tập của học viên:
${JSON.stringify(userStats || {})}
Hãy đưa ra 3 gợi ý lộ trình học tập cá nhân hóa ngắn gọn, thiết thực, giúp học viên khắc phục lỗ hổng tư duy không gian và thành thạo kỹ năng tìm giao tuyến, giao điểm, thiết diện. Ngôn ngữ: ${language === 'vi' ? 'Tiếng Việt' : 'English'}.
Trả về định dạng JSON array với các trường: level, topic, action, status.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    let data = [];
    try {
      data = JSON.parse(response.text || '[]');
    } catch {
      data = [];
    }

    res.json({
      success: true,
      recommendations: data
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// API: Discussions
app.get('/api/discussions', (_req: Request, res: Response) => {
  res.json({ success: true, discussions });
});

app.post('/api/discussions', (req: Request, res: Response) => {
  const { title, content, author, tags } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content required' });
  }
  const newPost = {
    id: `disc-${Date.now()}`,
    author: author || 'Học viên ẩn danh',
    avatar: '🧑‍💻',
    title,
    content,
    timestamp: 'Vừa xong',
    likes: 1,
    tags: tags || ['Hình học không gian'],
    replies: []
  };
  discussions.unshift(newPost);
  res.json({ success: true, post: newPost });
});

app.post('/api/discussions/:id/reply', (req: Request, res: Response) => {
  const { id } = req.params;
  const { content, author, isTeacher } = req.body;
  const post = discussions.find(d => d.id === id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  const newReply = {
    id: `rep-${Date.now()}`,
    author: author || 'Học viên',
    avatar: isTeacher ? '👨‍🏫' : '🧑‍🎓',
    content,
    timestamp: 'Vừa xong',
    isTeacher: Boolean(isTeacher)
  };
  post.replies.push(newReply);
  res.json({ success: true, reply: newReply });
});

// API: Leaderboard
app.get('/api/leaderboard', (_req: Request, res: Response) => {
  res.json({ success: true, leaderboard });
});

// Setup Vite or static serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GeoSpace 3D Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
