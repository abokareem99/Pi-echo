require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

// تفعيل مشاركة الموارد لكي يتمكن الـ Frontend الخاص بك من الاتصال بالخادم الخلفي
app.use(cors({
    origin: '*' // في الإنتاج، يفضل استبداله برابط تطبيقك الفعلي على Vercel أو Netlify لزيادة الأمان
}));

const PI_API_URL = 'https://api.minepi.com/v2';
const PI_API_KEY = process.env.PI_API_KEY; // يتم تعيينه في ملف .env

// التحقق من وجود مفتاح API الخاص بباي
if (!PI_API_KEY) {
    console.error("❌ تحذير: لم يتم العثور على مفتاح PI_API_KEY في متغيرات البيئة!");
}

// 1. نقطة الموافقة على الدفعة (Approve Payment)
app.post('/api/payments/approve', async (req, res) => {
    const { paymentId } = req.body;

    if (!paymentId) {
        return res.status(400).json({ error: 'حقل paymentId مطلوب.' });
    }

    try {
        const response = await fetch(`${PI_API_URL}/payments/${paymentId}/approve`, {
            method: 'POST',
            headers: {
                'Authorization': `Key ${PI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("فشل الموافقة في خوادم باي:", data);
            return res.status(response.status).json(data);
        }

        console.log(`✅ تمت الموافقة بنجاح على الدفعة: ${paymentId}`);
        return res.status(200).json(data);

    } catch (error) {
        console.error("خطأ داخلي أثناء الموافقة:", error);
        return res.status(500).json({ error: 'حدث خطأ في الخادم الخلفي.' });
    }
});

// 2. نقطة إكمال الدفعة نهائياً (Complete Payment)
app.post('/api/payments/complete', async (req, res) => {
    const { paymentId, txid } = req.body;

    if (!paymentId || !txid) {
        return res.status(400).json({ error: 'الحقول paymentId و txid مطلوبة.' });
    }

    try {
        const response = await fetch(`${PI_API_URL}/payments/${paymentId}/complete`, {
            method: 'POST',
            headers: {
                'Authorization': `Key ${PI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ txid })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("فشل إكمال الدفعة في خوادم باي:", data);
            return res.status(response.status).json(data);
        }

        console.log(`🎉 تم إكمال واستلام الدفعة بنجاح! رقم المعاملة: ${txid}`);
        // 💡 هنا يمكنك كتابة كود إضافي لإضافة الرصيد للمستلم في قاعدة بياناتك (مثل Supabase)
        
        return res.status(200).json(data);

    } catch (error) {
        console.error("خطأ داخلي أثناء إكمال العملية:", error);
        return res.status(500).json({ error: 'حدث خطأ في الخادم الخلفي.' });
    }
});

// تشغيل الخادم
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 خادم دفع باي إيكو يعمل بنجاح على المنفذ: ${PORT}`);
});
