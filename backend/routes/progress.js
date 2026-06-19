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

// 获取用户学习进度
router.get('/stats', verifyToken, (req, res) => {
  const userId = req.userId;

  db.get(
    `SELECT 
      COUNT(*) as total_words_learned,
      AVG(CASE WHEN is_learned = 1 THEN 100 ELSE 0 END) as learning_rate
    FROM user_progress 
    WHERE user_id = ?`,
    [userId],
    (err, stats) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to fetch stats' 
        });
      }

      // 获取最近的测验成绩
      db.get(
        `SELECT AVG(score) as avg_score, COUNT(*) as quiz_count
         FROM quiz_results 
         WHERE user_id = ?`,
        [userId],
        (err, quizStats) => {
          if (err) {
            return res.status(500).json({ 
              success: false, 
              message: 'Failed to fetch quiz stats' 
            });
          }

          res.json({ 
            success: true, 
            stats: {
              total_words_learned: stats.total_words_learned || 0,
              learning_rate: stats.learning_rate ? stats.learning_rate.toFixed(2) : 0,
              avg_quiz_score: quizStats.avg_score ? quizStats.avg_score.toFixed(2) : 0,
              total_quizzes: quizStats.quiz_count || 0
            }
          });
        }
      );
    }
  );
});

// 记录单词学习
router.post('/mark-learned', verifyToken, (req, res) => {
  const { wordId } = req.body;
  const userId = req.userId;

  if (!wordId) {
    return res.status(400).json({ 
      success: false, 
      message: 'Word ID is required' 
    });
  }

  db.run(
    `INSERT INTO user_progress (user_id, word_id, is_learned) 
     VALUES (?, ?, 1)
     ON CONFLICT(user_id, word_id) DO UPDATE SET is_learned = 1`,
    [userId, wordId],
    (err) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to mark word as learned' 
        });
      }

      res.json({ 
        success: true, 
        message: 'Word marked as learned' 
      });
    }
  );
});

// 获取用户已学单词
router.get('/learned-words', verifyToken, (req, res) => {
  const userId = req.userId;

  db.all(
    `SELECT w.* FROM words w
     INNER JOIN user_progress up ON w.id = up.word_id
     WHERE up.user_id = ? AND up.is_learned = 1`,
    [userId],
    (err, words) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to fetch learned words' 
        });
      }

      res.json({ 
        success: true, 
        words 
      });
    }
  );
});

module.exports = router;