const Course = require('../../models/courses/course');

const getPublishedCourses = async (req, res) => {
  try {
    const courses = await Course.findAllPublished();

    res.json({
      success: true,
      courses: courses.map(course => ({
        id: course.id,
        blockchainId: course.blockchain_id,
        title: course.title,
        description: course.description,
        instructorAddress: course.instructor_address,
        category: course.category,
        difficultyLevel: course.difficulty_level,
        estimatedDuration: course.estimated_duration,
        totalXpReward: course.total_xp_reward,
        isPublished: course.is_published,
        createdAt: course.created_at
      }))
    });
  } catch (error) {
    console.error('Get published courses error:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Get lessons for this course
    const lessons = await Course.getLessons(id);

    res.json({
      success: true,
      course: {
        id: course.id,
        blockchainId: course.blockchain_id,
        title: course.title,
        description: course.description,
        instructorAddress: course.instructor_address,
        category: course.category,
        difficultyLevel: course.difficulty_level,
        estimatedDuration: course.estimated_duration,
        totalXpReward: course.total_xp_reward,
        isPublished: course.is_published,
        createdAt: course.created_at
      },
      lessons: lessons.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        contentType: lesson.content_type,
        contentUrl: lesson.content_url,
        duration: lesson.duration,
        xpReward: lesson.xp_reward,
        orderIndex: lesson.order_index
      }))
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
};

const syncCourseFromBlockchain = async (req, res) => {
  try {
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
    } = req.body;

    // Check if course already exists
    let course = await Course.findByBlockchainId(blockchainId);

    if (course) {
      // Update existing course
      await Course.update(course.id, {
        title,
        description,
        instructor_address: instructorAddress,
        category,
        difficulty_level: difficultyLevel,
        estimated_duration: estimatedDuration,
        total_xp_reward: totalXpReward,
        is_published: isPublished
      });
    } else {
      // Create new course
      await Course.create({
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
      });
    }

    res.json({ success: true, message: 'Course synced successfully' });
  } catch (error) {
    console.error('Sync course error:', error);
    res.status(500).json({ error: 'Failed to sync course' });
  }
};

module.exports = {
  getPublishedCourses,
  getCourseById,
  syncCourseFromBlockchain
};