const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../database.db');
const db = new sqlite3.Database(dbPath);

// 初始单词数据
const seedWords = [
  // 日常生活词汇 - 初级
  { english: 'Hello', chinese: '你好', category: '日常用语', difficulty: 'beginner' },
  { english: 'Goodbye', chinese: '再见', category: '日常用语', difficulty: 'beginner' },
  { english: 'Thank you', chinese: '谢谢', category: '日常用语', difficulty: 'beginner' },
  { english: 'Please', chinese: '请', category: '日常用语', difficulty: 'beginner' },
  { english: 'Sorry', chinese: '对不起', category: '日常用语', difficulty: 'beginner' },
  { english: 'Yes', chinese: '是的', category: '日常用语', difficulty: 'beginner' },
  { english: 'No', chinese: '不', category: '日常用语', difficulty: 'beginner' },
  { english: 'Excuse me', chinese: '打扰一下', category: '日常用语', difficulty: 'beginner' },

  // 基础名词 - 初级
  { english: 'Apple', chinese: '苹果', category: '食物', difficulty: 'beginner' },
  { english: 'Bread', chinese: '面包', category: '食物', difficulty: 'beginner' },
  { english: 'Water', chinese: '水', category: '食物', difficulty: 'beginner' },
  { english: 'Coffee', chinese: '咖啡', category: '食物', difficulty: 'beginner' },
  { english: 'Milk', chinese: '牛奶', category: '食物', difficulty: 'beginner' },
  { english: 'Tea', chinese: '茶', category: '食物', difficulty: 'beginner' },
  { english: 'Rice', chinese: '米饭', category: '食物', difficulty: 'beginner' },
  { english: 'Chicken', chinese: '鸡肉', category: '食物', difficulty: 'beginner' },

  // 身体部位 - 初级
  { english: 'Head', chinese: '头', category: '身体', difficulty: 'beginner' },
  { english: 'Eyes', chinese: '眼睛', category: '身体', difficulty: 'beginner' },
  { english: 'Nose', chinese: '鼻子', category: '身体', difficulty: 'beginner' },
  { english: 'Mouth', chinese: '嘴', category: '身体', difficulty: 'beginner' },
  { english: 'Ear', chinese: '耳朵', category: '身体', difficulty: 'beginner' },
  { english: 'Hand', chinese: '手', category: '身体', difficulty: 'beginner' },
  { english: 'Foot', chinese: '脚', category: '身体', difficulty: 'beginner' },
  { english: 'Leg', chinese: '腿', category: '身体', difficulty: 'beginner' },

  // 家居物品 - 初级
  { english: 'Chair', chinese: '椅子', category: '家居', difficulty: 'beginner' },
  { english: 'Table', chinese: '桌子', category: '家居', difficulty: 'beginner' },
  { english: 'Bed', chinese: '床', category: '家居', difficulty: 'beginner' },
  { english: 'Door', chinese: '门', category: '家居', difficulty: 'beginner' },
  { english: 'Window', chinese: '窗户', category: '家居', difficulty: 'beginner' },
  { english: 'Book', chinese: '书', category: '家居', difficulty: 'beginner' },
  { english: 'Lamp', chinese: '灯', category: '家居', difficulty: 'beginner' },
  { english: 'Phone', chinese: '电话', category: '家居', difficulty: 'beginner' },

  // 颜色 - 初级
  { english: 'Red', chinese: '红色', category: '颜色', difficulty: 'beginner' },
  { english: 'Blue', chinese: '蓝色', category: '颜色', difficulty: 'beginner' },
  { english: 'Yellow', chinese: '黄色', category: '颜色', difficulty: 'beginner' },
  { english: 'Green', chinese: '绿色', category: '颜色', difficulty: 'beginner' },
  { english: 'Black', chinese: '黑色', category: '颜色', difficulty: 'beginner' },
  { english: 'White', chinese: '白色', category: '颜色', difficulty: 'beginner' },
  { english: 'Purple', chinese: '紫色', category: '颜色', difficulty: 'beginner' },
  { english: 'Orange', chinese: '橙色', category: '颜色', difficulty: 'beginner' },

  // 数字 - 初级
  { english: 'One', chinese: '一', category: '数字', difficulty: 'beginner' },
  { english: 'Two', chinese: '二', category: '数字', difficulty: 'beginner' },
  { english: 'Three', chinese: '三', category: '数字', difficulty: 'beginner' },
  { english: 'Four', chinese: '四', category: '数字', difficulty: 'beginner' },
  { english: 'Five', chinese: '五', category: '数字', difficulty: 'beginner' },
  { english: 'Six', chinese: '六', category: '数字', difficulty: 'beginner' },
  { english: 'Seven', chinese: '七', category: '数字', difficulty: 'beginner' },
  { english: 'Eight', chinese: '八', category: '数字', difficulty: 'beginner' },

  // 动物 - 初级
  { english: 'Cat', chinese: '猫', category: '动物', difficulty: 'beginner' },
  { english: 'Dog', chinese: '狗', category: '动物', difficulty: 'beginner' },
  { english: 'Bird', chinese: '鸟', category: '动物', difficulty: 'beginner' },
  { english: 'Fish', chinese: '鱼', category: '动物', difficulty: 'beginner' },
  { english: 'Elephant', chinese: '大象', category: '动物', difficulty: 'beginner' },
  { english: 'Lion', chinese: '狮子', category: '动物', difficulty: 'beginner' },
  { english: 'Tiger', chinese: '老虎', category: '动物', difficulty: 'beginner' },
  { english: 'Monkey', chinese: '猴子', category: '动物', difficulty: 'beginner' },

  // 中级词汇 - 动词
  { english: 'Study', chinese: '学习', category: '动词', difficulty: 'intermediate' },
  { english: 'Work', chinese: '工作', category: '动词', difficulty: 'intermediate' },
  { english: 'Play', chinese: '玩', category: '动词', difficulty: 'intermediate' },
  { english: 'Read', chinese: '阅读', category: '动词', difficulty: 'intermediate' },
  { english: 'Write', chinese: '写', category: '动词', difficulty: 'intermediate' },
  { english: 'Listen', chinese: '听', category: '动词', difficulty: 'intermediate' },
  { english: 'Speak', chinese: '说话', category: '动词', difficulty: 'intermediate' },
  { english: 'Walk', chinese: '走路', category: '动词', difficulty: 'intermediate' },
  { english: 'Run', chinese: '跑步', category: '动词', difficulty: 'intermediate' },
  { english: 'Sleep', chinese: '睡觉', category: '动词', difficulty: 'intermediate' },

  // 中级词汇 - 形容词
  { english: 'Beautiful', chinese: '美丽的', category: '形容词', difficulty: 'intermediate' },
  { english: 'Ugly', chinese: '丑陋的', category: '形容词', difficulty: 'intermediate' },
  { english: 'Big', chinese: '大的', category: '形容词', difficulty: 'intermediate' },
  { english: 'Small', chinese: '小的', category: '形容词', difficulty: 'intermediate' },
  { english: 'Long', chinese: '长的', category: '形容词', difficulty: 'intermediate' },
  { english: 'Short', chinese: '短的', category: '形容词', difficulty: 'intermediate' },
  { english: 'Happy', chinese: '快乐的', category: '形容词', difficulty: 'intermediate' },
  { english: 'Sad', chinese: '悲伤的', category: '形容词', difficulty: 'intermediate' },
  { english: 'Angry', chinese: '生气的', category: '形容词', difficulty: 'intermediate' },
  { english: 'Tired', chinese: '疲劳的', category: '形容词', difficulty: 'intermediate' },

  // 中级词汇 - 时间
  { english: 'Morning', chinese: '早上', category: '时间', difficulty: 'intermediate' },
  { english: 'Afternoon', chinese: '下午', category: '时间', difficulty: 'intermediate' },
  { english: 'Evening', chinese: '晚上', category: '时间', difficulty: 'intermediate' },
  { english: 'Night', chinese: '夜晚', category: '时间', difficulty: 'intermediate' },
  { english: 'Monday', chinese: '星期一', category: '时间', difficulty: 'intermediate' },
  { english: 'Tuesday', chinese: '星期二', category: '时间', difficulty: 'intermediate' },
  { english: 'Wednesday', chinese: '星期三', category: '时间', difficulty: 'intermediate' },
  { english: 'Thursday', chinese: '星期四', category: '时间', difficulty: 'intermediate' },

  // 中级词汇 - 地点
  { english: 'School', chinese: '学校', category: '地点', difficulty: 'intermediate' },
  { english: 'Hospital', chinese: '医院', category: '地点', difficulty: 'intermediate' },
  { english: 'Library', chinese: '图书馆', category: '地点', difficulty: 'intermediate' },
  { english: 'Market', chinese: '市场', category: '地点', difficulty: 'intermediate' },
  { english: 'Restaurant', chinese: '餐厅', category: '地点', difficulty: 'intermediate' },
  { english: 'Park', chinese: '公园', category: '地点', difficulty: 'intermediate' },
  { english: 'Museum', chinese: '博物馆', category: '地点', difficulty: 'intermediate' },
  { english: 'Theater', chinese: '剧院', category: '地点', difficulty: 'intermediate' },

  // 高级词汇
  { english: 'Extraordinary', chinese: '非凡的', category: '形容词', difficulty: 'advanced' },
  { english: 'Perseverance', chinese: '毅力', category: '名词', difficulty: 'advanced' },
  { english: 'Ambition', chinese: '野心', category: '名词', difficulty: 'advanced' },
  { english: 'Integrity', chinese: '诚实正直', category: '名词', difficulty: 'advanced' },
  { english: 'Eloquent', chinese: '善辩的', category: '形容词', difficulty: 'advanced' },
  { english: 'Meticulous', chinese: '一丝不苟的', category: '形容词', difficulty: 'advanced' },
  { english: 'Diligent', chinese: '勤奋的', category: '形容词', difficulty: 'advanced' },
  { english: 'Innovative', chinese: '创新的', category: '形容词', difficulty: 'advanced' },
  { english: 'Prosperity', chinese: '繁荣', category: '名词', difficulty: 'advanced' },
  { english: 'Compassion', chinese: '同情心', category: '名词', difficulty: 'advanced' }
];

// 插入数据
function seedDatabase() {
  db.serialize(() => {
    const stmt = db.prepare(`
      INSERT INTO words (english, chinese, category, difficulty)
      VALUES (?, ?, ?, ?)
    `);

    let count = 0;
    seedWords.forEach(word => {
      stmt.run([word.english, word.chinese, word.category, word.difficulty], (err) => {
        if (err) {
          console.error(`❌ 错误添加单词 "${word.english}":`, err.message);
        } else {
          count++;
          console.log(`✅ 已添加: ${word.english} (${word.chinese})`);
        }
      });
    });

    stmt.finalize(() => {
      db.get('SELECT COUNT(*) as count FROM words', (err, row) => {
        if (err) {
          console.error('❌ 无法统计单词数:', err);
        } else {
          console.log(`\n📚 数据库中现有 ${row.count} 个单词！`);
        }
        db.close();
      });
    });
  });
}

// 检查是否已有数据
db.get('SELECT COUNT(*) as count FROM words', (err, row) => {
  if (err) {
    console.error('❌ 错误:', err);
    db.close();
    return;
  }

  if (row.count > 0) {
    console.log(`⚠️  数据库已包含 ${row.count} 个单词，跳过种子数据导入。`);
    console.log('💡 如果要重新初始化，请删除 database.db 文件并重新运行此脚本。');
    db.close();
  } else {
    console.log('🌱 开始添加初始单词数据...\n');
    seedDatabase();
  }
});
