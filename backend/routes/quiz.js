const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { db } = require('../db/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// 验证token
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'No token provided' 
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
}

// 生成随机测验
router.get('/random', (req, res) => {
  const count = parseInt(req.query.count) || 10;

  db.all(
    `SELECT id, english, chinese FROM words ORDER BY RANDOM() LIMIT ?`,
    [count],
    (err, words) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to generate quiz' 
        });
      }

      // 为每个单词生成选项
      const quiz = words.map(word => {
        return {
          id: word.id,
          english: word.english,
          correctAnswer: word.chinese
        };
      });

      res.json({ 
        success: true, 
        quiz 
      });
    }
  );
});

// 提交测验答案
router.post('/submit', verifyToken, (req, res) => {
  const { answers, totalQuestions, duration } = req.body;
  const userId = req.userId;

  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid answers format' 
    });
  }

  // 计算正确答案数
  let correctCount = 0;
  
  const promises = answers.map(answer => {
    return new Promise((resolve) => {
      db.get(
        'SELECT chinese FROM words WHERE id = ?',
        [answer.wordId],
        (err, word) => {
          if (word && word.chinese === answer.userAnswer) {
            correctCount++;
          }
          resolve();
        }
      );
    });
  });

  Promise.all(promises).then(() => {
    const score = (correctCount / totalQuestions * 100).toFixed(2);

    db.run(
      `INSERT INTO quiz_results (user_id, total_questions, correct_answers, score, duration) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId, totalQuestions, correctCount, score, duration],
      function(err) {
        if (err) {
          return res.status(500).json({ 
            success: false, 
            message: 'Failed to save quiz result' 
          });
        }

        res.json({ 
          success: true, 
          message: 'Quiz submitted successfully',
          result: {
            totalQuestions,
            correctAnswers: correctCount,
            wrongAnswers: totalQuestions - correctCount,
            score,
            accuracy: `${score}%`
          }
        });
      }
    );
  });
});

// 获取用户测验历史
router.get('/history', verifyToken, (req, res) => {
  const userId = req.userId;

  db.all(
    `SELECT * FROM quiz_results WHERE user_id = ? ORDER BY created_at DESC LIMIT 10`,
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to fetch quiz history' 
        });
      }

      res.json({ 
        success: true, 
        results 
      });
    }
  );
});

module.exports = router;