const express = require('express');
const router = express.Router();
const { db } = require('../db/database');

// 获取所有单词
router.get('/', (req, res) => {
  const category = req.query.category;
  const difficulty = req.query.difficulty;

  let query = 'SELECT * FROM words WHERE 1=1';
  const params = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  if (difficulty) {
    query += ' AND difficulty = ?';
    params.push(difficulty);
  }

  db.all(query, params, (err, words) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch words' 
      });
    }

    res.json({ 
      success: true, 
      words 
    });
  });
});

// 获取单个单词
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get(
    'SELECT * FROM words WHERE id = ?',
    [id],
    (err, word) => {
      if (err || !word) {
        return res.status(404).json({ 
          success: false, 
          message: 'Word not found' 
        });
      }

      res.json({ 
        success: true, 
        word 
      });
    }
  );
});

// 添加单词（管理员）
router.post('/', (req, res) => {
  const { english, chinese, category, difficulty, example, pronunciation } = req.body;

  if (!english || !chinese) {
    return res.status(400).json({ 
      success: false, 
      message: 'English and Chinese translations are required' 
    });
  }

  db.run(
    `INSERT INTO words (english, chinese, category, difficulty, example, pronunciation) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [english, chinese, category || 'General', difficulty || 'beginner', example, pronunciation],
    function(err) {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to add word' 
        });
      }

      res.status(201).json({ 
        success: true, 
        message: 'Word added successfully',
        wordId: this.lastID
      });
    }
  );
});

// 获取单词分类
router.get('/categories/list', (req, res) => {
  db.all(
    'SELECT DISTINCT category FROM words ORDER BY category',
    (err, categories) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to fetch categories' 
        });
      }

      res.json({ 
        success: true, 
        categories: categories.map(c => c.category) 
      });
    }
  );
});

module.exports = router;