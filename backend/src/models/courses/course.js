const { pool } = require('../../config/database');

class Course {
  static async findAllPublished() {
    const [rows] = await pool.execute(
      'SELECT * FROM courses WHERE is_published = TRUE ORDER BY created_at DESC'
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM courses WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async findByBlockchainId(blockchainId) {
    const [rows] = await pool.execute(
      'SELECT * FROM courses WHERE blockchain_id = ?',
      [blockchainId]
    );
    return rows[0];
  }

  static async create(courseData) {
    const {
      blockchainId,
      title,
      description,
      instructorAddress,
      category,
      difficultyLevel,
      estimatedDuration,
      totalXpReward,
      isPublished,
      blockchainCreatedAt
    } = courseData;

    const [result] = await pool.execute(
      `INSERT INTO courses (
        blockchain_id, title, description, instructor_address,
        category, difficulty_level, estimated_duration,
        total_xp_reward, is_published, blockchain_created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        blockchainId, title, description, instructorAddress,
        category, difficultyLevel, estimatedDuration,
        totalXpReward, isPublished, blockchainCreatedAt
      ]
    );
    return result.insertId;
  }

  static async update(id, updates) {
    const fields = [];
    const values = [];

    Object.keys(updates).forEach(key => {
      fields.push(`${key} = ?`);
      values.push(updates[key]);
    });

    if (fields.length === 0) return;

    values.push(id);
    const [result] = await pool.execute(
      `UPDATE courses SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result;
  }

  static async getLessons(courseId) {
    const [rows] = await pool.execute(
      'SELECT * FROM lessons WHERE course_id = ? ORDER BY order_index ASC',
      [courseId]
    );
    return rows;
  }
}

module.exports = Course;