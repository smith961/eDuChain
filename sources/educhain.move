module educhain::educhain;

use sui::vec_map::{Self, VecMap};
use sui::package;
use sui::display;
use sui::clock::{Self, Clock};
use sui::event;
use sui::url::{Self, Url};
use std::string::{Self, String};

#[allow(unused_const)]
// =====Constants=====
const LESSON_XP_REWARD: u64 =  50;
const COURSE_COMPLETION_XP: u64 = 200;
const QUIZ_PASS_XP: u64 = 100;
const DAILY_LOGIN_XP: u64 = 10;
const ACHIEVEMENT_BASE_XP: u64 = 25;
const STREAK_BONUS_MULTIPLIER: u64 = 5;

// =====Level thresholds=====
// const LEVEL_1_THRESHOLD: u64 = 200;
const LEVEL_2_THRESHOLD: u64 = 500;
const LEVEL_3_THRESHOLD: u64 = 1000;
const LEVEL_4_THRESHOLD: u64 = 2000;
const LEVEL_5_THRESHOLD: u64 = 2000;

// =====Error codes=====
#[allow(unused_const)]
const ENotAuthorized: u64 = 1;
const EAlreadyCompleted: u64 = 2;
const ECourseNotFound: u64 = 3;
// const EUserNotRegistered: u64 = 4;
const EInvalidQuizScore: u64 = 5;
const EAlreadySignedIn: u64 = 6;

// =====Structs=====

/// One-time witness for creating display objects
public struct EDUCHAIN has drop {}

/// Main EDUCHAIN registry
public struct EDUCHAINRegistry has key, store {
    id: UID,
    total_users: u64,
    total_courses: u64,
    total_xp_awarded: u64,
    admin: address,
}

/// User profile  and authentication
public struct UserProfile has key {
    id: UID,
    user: address,
    username: String,
    email: String,
    total_xp: u64,
    current_level: u64,
    courses_enrolled: VecMap<ID, bool>, // course_id -> completed
    lessons_completed: VecMap<ID, bool>, // lesson_id -> completed
    quizzes_completed: VecMap<ID, u64>, // quiz_id -> score
    achievements: VecMap<ID, AchievementProgress>, // achievement tracking
    nfts_earned: vector<ID>,
    last_login: u64, // timestamp of last login
    login_streak: u64, // consecutive login days
    registration_date: u64, // timestamp of registration
    is_active: bool,
}

/// Course structure
public struct Course has key, store {
    id: UID,
    title: String,
    description: String,
    instructor: address,
    category: String,
    difficulty_level: u8, // 1-5 scale
    estimated_duration: u64, // in minutes
    lessons: vector<Lesson>,
    total_xp_reward: u64,
    prerequisites: vector<ID>, // course IDs
    is_published: bool,
    created_at: u64, // timestamp
    total_enrollments: u64,
}

/// Individual lesson structure
public struct Lesson has   store {   
    id: ID,
    title: String,
    content_type: String,
    content_url: String, // link to video/text content
    duration: u64, // in minutes
    xp_reward: u64,
    quiz_id: Option<ID>,
    order_index: u64, // additional resource links
}

/// Quiz structure
#[allow(unused_field)]
public struct Quiz has key, store { 
    id: UID,
    lesson_id: ID,
    questions: vector<QuizQuestion>,
    passing_score: u64, // percentage
    max_attempts: u64,
    xp_reward: u64,
}
/// Individual quiz question
#[allow(unused_field)]
public struct QuizQuestion has store {
    question: String,
    options: vector<String>,
    correct_answer: u64,
    explanation: String,
}

/// User's course progress
public struct CourseEnrollment has key {
    id: UID,
    user_address: address,
    course_id: ID,
    progress_percentage: u64,
    lessons_completed: VecMap<ID, LessonCompletion>, // lesson_id -> completed
    quiz_attempts: VecMap<ID, vector<QuizAttempt>>, // quiz_id -> passed
    started_at: u64, // timestamp
    last_accessed: u64, // timestamp
    is_completed: bool,
    completion_date: Option<u64>, // timestamp
    total_xp_earned: u64,
    
}

/// Lesson completion details
public struct LessonCompletion has store {
    completed_at: u64, // timestamp
    xp_earned: u64,
    time_spent: u64, // in minutes
}
/// Quiz attempt details
public struct QuizAttempt has store {
    score: u64, // percentage
    passed: bool,
    attempted_at: u64, // timestamp
    answers: vector<u64>, // indices of selected answers
}

/// Achievement structure
public struct Achievement has store {
    id: ID,
    name: String,
    description: String,
    icon: String,
    xp_reward: u64,
    rarity: String, // "common", "rare", "epic", "legendary", "mythic"
    category: String, // "learning", "social", "completion", "streak"
    unlocked_at: Option<u64>,
}

/// NFT structure for rewards
public struct CompletionNFT has key, store {
    id: UID,
    recipient: address,
    course_id: ID,
    course_title: String,
    achievement_type: String, // e.g., "Course Completion", "Top Scorer"
    description: String,
    image_url: Url, // link to NFT image
    attributes: VecMap<String, String>, // e.g., [("Level", "Beginner"), ("Category", "Math")]
    xp_earned: u64,
    completion_date: u64, // timestamp
    rarity: String, // e.g., "Common", "Rare", "Epic"
}

/// Achievement Progress structure
public struct AchievementProgress has store {
    achievement_id: ID,
    progress: u64,
    target: u64,
    completed: bool,
}
   

/// XP Token for rewards (FUNGIBLE)
#[allow(unused_field)]
public struct XPToken has key, store {
    id: UID,
    balance: u64,
    owner: address,
}

/// Admin capability
public struct AdminCap has key {
    id: UID,
}

/// =====Events=====

public struct UserRegistered has copy, drop {
    user: address,
    username: String,
    timestamp: u64,
}

public struct UserSignedIn has copy, drop {
    user: address,
    timestamp: u64,
    streak_bonus_xp: u64
}

public struct CourseEnrolled has copy, drop {
    user: address,
    course_id: ID,
    course_title: String,
    timestamp: u64,
}

public struct LessonCompleted has copy, drop {
    user: address,
    lesson_id: ID,
    course_id: ID,
    lesson_title: String,
    xp_earned: u64,
    timestamp: u64,
}

public struct QuizCompleted has copy, drop {
    user: address,
    quiz_id: ID,
    score: u64,
    passed: bool,
    xp_earned: u64,
    timestamp: u64,
}

public struct CourseCompleted has copy, drop {
    user: address,
    course_id: ID,
    total_xp_earned: u64,
    completion_time: u64, // in minutes
    timestamp: u64,
}    

public struct XPAwarded has copy, drop {
    user: address,
    amount: u64,
    reason: String,
    timestamp: u64,
}
    
public struct LevelUp has copy, drop {
    user: address,
    new_level: u64,
    total_xp: u64,
    timestamp: u64,
}

public struct NFTMinted has copy, drop {
    recipient: address,
    nft_id: ID,
    achievement_type: String,
    course_title: String,
    timestamp: u64,
}
   
// =====Initialize Function=====    

fun init (otw: EDUCHAIN, ctx: &mut TxContext) {
    // Create the EDUCHAIN registry
    let registry = EDUCHAINRegistry {
        id: object::new(ctx),
        total_users: 0,
        total_courses: 0,
        total_xp_awarded: 0,
        admin: tx_context::sender(ctx),
    };

    // Create admin capability
    let admin_cap = AdminCap {
        id: object::new(ctx),
    };

    // Create display for NFTs
    let keys = vector[
        string::utf8(b"name"),
        string::utf8(b"description"),
        string::utf8(b"image_url"),
        string::utf8(b"achievement_type"),
        string::utf8(b"course_title"),
        string::utf8(b"rarity"),
    ];

    let values = vector[
        string::utf8(b"{course_title} - {achievement_type}"),
        string::utf8(b"{description}"),
        string::utf8(b"{image_url}"), // Placeholder image URL
        string::utf8(b"{achievement_type}"),
        string::utf8(b"{course_title}"),
        string::utf8(b"{rarity}"), // Default rarity
    ];

    let publisher = package::claim(otw, ctx);
    let mut display = display::new_with_fields<CompletionNFT>(&publisher, keys, values, ctx);
    display::update_version(&mut display);

    transfer::public_transfer(publisher, tx_context::sender(ctx));
    transfer::public_transfer(display, tx_context::sender(ctx));
    transfer::share_object(registry);
    transfer::transfer(admin_cap, tx_context::sender(ctx));
}

// ===== User Management Functions =====

/// Register a new user
public entry fun register_user(
    registry: &mut EDUCHAINRegistry,
    username: String,
    email: String,
    clock: &Clock,
    ctx: &mut TxContext
) {
    let current_time = clock::timestamp_ms(clock);

    let profile = UserProfile {
        id: object::new(ctx),
        user: tx_context::sender(ctx),
        username,
        email,
        total_xp: 0,
        current_level: 0,
        courses_enrolled: vec_map::empty(),
        lessons_completed: vec_map::empty(),
        quizzes_completed: vec_map::empty(),
        achievements: vec_map::empty(),
        nfts_earned: vector::empty(),
        last_login: current_time,
        login_streak: 1,
        registration_date: current_time,
        is_active: true,
    };

    registry.total_users = registry.total_users + 1;

    event::emit(UserRegistered {
        user: tx_context::sender(ctx),
        username: profile.username,
        timestamp: current_time,
    });
    transfer::transfer(profile, tx_context::sender(ctx));
}

/// User sign-in with streak bonus
public entry fun sign_in(
        registry: &mut EDUCHAINRegistry,
        profile: &mut UserProfile,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        
        assert!(profile.user == tx_context::sender(ctx), ENotAuthorized);
        
        let current_time = clock::timestamp_ms(clock);
        let time_since_last_login = current_time - profile.last_login;
        let one_day_ms = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

        let mut streak_bonus_xp = 0;

        // Check if it's been more than 24 hours since last login
        if (time_since_last_login >= one_day_ms) {
            // Award daily login XP
            streak_bonus_xp = DAILY_LOGIN_XP;
            
            // Check if streak continues (within 48 hours)
            if (time_since_last_login <= one_day_ms * 2) {
                profile.login_streak = profile.login_streak + 1;
                // Bonus XP for streak
                streak_bonus_xp = streak_bonus_xp + (profile.login_streak * 5);
            } else {
                // Streak broken, reset to 1
                profile.login_streak = 1;
            };

            profile.total_xp = profile.total_xp + streak_bonus_xp;
            registry.total_xp_awarded = registry.total_xp_awarded + streak_bonus_xp;
            
            // Check for level up
            check_level_up(profile, clock);

            event::emit(XPAwarded {
                user: tx_context::sender(ctx),
                amount: streak_bonus_xp,
                reason: string::utf8(b"daily_login_bonus"),
                timestamp: current_time,
            });
        };

        profile.last_login = current_time;

        event::emit(UserSignedIn {
            user: tx_context::sender(ctx),
            timestamp: current_time,
            streak_bonus_xp,
        });
    }

 // ===== Course Management Functions =====

    /// Create a new course (admin only)
    public entry fun create_course(
        _: &AdminCap,
        registry: &mut EDUCHAINRegistry,
        title: String,
        description: String,
        instructor: address,
        category: String,
        difficulty_level: u8,
        estimated_duration: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let course = Course {
            id: object::new(ctx),
            title,
            description,
            instructor,
            category,
            difficulty_level,
            estimated_duration,
            lessons: vector::empty(),
            total_xp_reward: 0,
            prerequisites: vector::empty(),
            is_published: false,
            created_at: clock::timestamp_ms(clock),
            total_enrollments: 0,
        };

        registry.total_courses = registry.total_courses + 1;
        transfer::share_object(course);
    }

  /// Add lesson to course (admin only)
    public entry fun add_lesson(
        _: &AdminCap,
        course: &mut Course,
        title: String,
        content_type: String,
        content_url: String,
        duration: u64,
        order_index: u64,
        ctx: &mut TxContext
    ) {
        let lesson_id = object::id_from_address(tx_context::fresh_object_address(ctx));
        let xp_reward = calculate_lesson_xp(duration, course.difficulty_level);
        
        let lesson = Lesson {
            id: lesson_id,
            title,
            content_type,
            content_url,
            duration,
            xp_reward,
            quiz_id: option::none(),
            order_index,
        };

        vector::push_back(&mut course.lessons, lesson);
        course.total_xp_reward = course.total_xp_reward + xp_reward;
    }


 /// Publish course (admin only)
   public entry fun publish_course(
       _: &AdminCap,
       course: &mut Course,
       _ctx: &mut TxContext
   ) {
       course.is_published = true;
   }

   /// Create quiz for lesson (admin only)
   public entry fun create_quiz(
       _: &AdminCap,
       course: &mut Course,
       lesson_index: u64,
       passing_score: u64,
       max_attempts: u64,
       xp_reward: u64,
       ctx: &mut TxContext
   ) {
       let lesson = vector::borrow_mut(&mut course.lessons, lesson_index);
       let quiz = Quiz {
           id: object::new(ctx),
           lesson_id: lesson.id,
           questions: vector::empty(),
           passing_score,
           max_attempts,
           xp_reward,
       };

       lesson.quiz_id = option::some(object::id(&quiz));
       transfer::share_object(quiz);
   }

   /// Add quiz question (admin only)
   public entry fun add_quiz_question(
       _: &AdminCap,
       quiz: &mut Quiz,
       question: String,
       options: vector<String>,
       correct_answer: u64,
       explanation: String,
       _ctx: &mut TxContext
   ) {
       let quiz_question = QuizQuestion {
           question,
           options,
           correct_answer,
           explanation,
       };
       vector::push_back(&mut quiz.questions, quiz_question);
   }


// ===== Learning Functions =====

    /// Enroll in a course
    public entry fun enroll_in_course(
        course: &mut Course,
        profile: &mut UserProfile,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(profile.user == tx_context::sender(ctx), ENotAuthorized);
        assert!(course.is_published, ECourseNotFound);

        let course_id = object::id(course);
        let current_time = clock::timestamp_ms(clock);

        // Check if already enrolled
        if (vec_map::contains(&profile.courses_enrolled, &course_id)) {
            abort EAlreadySignedIn
        };

        // Create enrollment record
        let enrollment = CourseEnrollment {
            id: object::new(ctx),
            user_address: tx_context::sender(ctx),
            course_id,
            progress_percentage: 0,
            lessons_completed: vec_map::empty(),
            quiz_attempts: vec_map::empty(),
            started_at: current_time,
            last_accessed: current_time,
            is_completed: false,
            completion_date: option::none(),
            total_xp_earned: 0,
        };

        // Update profile
        vec_map::insert(&mut profile.courses_enrolled, course_id, false);
        course.total_enrollments = course.total_enrollments + 1;

        event::emit(CourseEnrolled {
            user: tx_context::sender(ctx),
            course_id,
            course_title: course.title,
            timestamp: current_time,
        });

        transfer::transfer(enrollment, tx_context::sender(ctx));
    }


 /// Complete a lesson
    public entry fun complete_lesson(
        registry: &mut EDUCHAINRegistry,
        course: &Course,
        enrollment: &mut CourseEnrollment,
        profile: &mut UserProfile,
        lesson_index: u64,
        time_spent: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(profile.user == tx_context::sender(ctx), ENotAuthorized);
        assert!(enrollment.user_address == tx_context::sender(ctx), ENotAuthorized);

        let current_time = clock::timestamp_ms(clock);
        let lesson = vector::borrow(&course.lessons, lesson_index);
        let lesson_id = lesson.id;
        let lesson_title = lesson.title;

        // Check if already completed
        if (vec_map::contains(&enrollment.lessons_completed, &lesson_id)) {
            abort EAlreadyCompleted
        };

        // Create completion record
        let completion = LessonCompletion {
            completed_at: current_time,
            xp_earned: lesson.xp_reward,
            time_spent,
        };

        // Update records
        vec_map::insert(&mut enrollment.lessons_completed, lesson_id, completion);
        vec_map::insert(&mut profile.lessons_completed, lesson_id, true);
        enrollment.total_xp_earned = enrollment.total_xp_earned + lesson.xp_reward;
        profile.total_xp = profile.total_xp + lesson.xp_reward;
        registry.total_xp_awarded = registry.total_xp_awarded + lesson.xp_reward;
        enrollment.last_accessed = current_time;

        // Update progress percentage
        let completed_lessons = vec_map::length(&enrollment.lessons_completed);
        let total_lessons = vector::length(&course.lessons);
        enrollment.progress_percentage = (completed_lessons * 100) / total_lessons;

        // Check for level up
        check_level_up(profile, clock);

        event::emit(LessonCompleted {
            user: tx_context::sender(ctx),
            lesson_id,
            lesson_title,
            course_id: enrollment.course_id,
            xp_earned: lesson.xp_reward,
            timestamp: current_time,
        });

        event::emit(XPAwarded {
            user: tx_context::sender(ctx),
            amount: lesson.xp_reward,
            reason: string::utf8(b"lesson_completion"),
            timestamp: current_time,
        });
    }



    /// Submit quiz answers
    public entry fun submit_quiz(
        registry: &mut EDUCHAINRegistry,
        quiz: &Quiz,
        enrollment: &mut CourseEnrollment,
        profile: &mut UserProfile,
        answers: vector<u64>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(profile.user == tx_context::sender(ctx), ENotAuthorized);
        
        let current_time = clock::timestamp_ms(clock);
        let quiz_id = object::id(quiz);
        
        // Calculate score
        let score = calculate_quiz_score(quiz, &answers);
        let passed = score >= quiz.passing_score;
        
        let attempt = QuizAttempt {
            score,
            passed,
            attempted_at: current_time,
            answers,
        };

        // Store attempt
        if (!vec_map::contains(&enrollment.quiz_attempts, &quiz_id)) {
            vec_map::insert(&mut enrollment.quiz_attempts, quiz_id, vector::empty());
        };
        let attempts = vec_map::get_mut(&mut enrollment.quiz_attempts, &quiz_id);
        vector::push_back(attempts, attempt);

        // Track quiz completion in profile
        vec_map::insert(&mut profile.quizzes_completed, quiz_id, score);

        // Award XP if passed
        let mut xp_earned = 0;
        if (passed) {
            xp_earned = quiz.xp_reward;
            enrollment.total_xp_earned = enrollment.total_xp_earned + xp_earned;
            profile.total_xp = profile.total_xp + xp_earned;
            registry.total_xp_awarded = registry.total_xp_awarded + xp_earned;

            check_level_up(profile, clock);

            event::emit(XPAwarded {
                user: tx_context::sender(ctx),
                amount: xp_earned,
                reason: string::utf8(b"quiz_completion"),
                timestamp: current_time,
            });
        };

        event::emit(QuizCompleted {
            user: tx_context::sender(ctx),
            quiz_id,
            score,
            passed,
            xp_earned,
            timestamp: current_time,
        });
    }

/// Complete entire course and mint NFT
    public entry fun complete_course(
        registry: &mut EDUCHAINRegistry,
        course: &Course,
        enrollment: &mut CourseEnrollment,
        profile: &mut UserProfile,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(profile.user == tx_context::sender(ctx), ENotAuthorized);
        assert!(!enrollment.is_completed, EAlreadyCompleted);

        let current_time = clock::timestamp_ms(clock);
        let course_id = object::id(course);

        // Check if all lessons are completed
        let total_lessons = vector::length(&course.lessons);
        let completed_lessons = vec_map::length(&enrollment.lessons_completed);
        assert!(completed_lessons == total_lessons, EInvalidQuizScore);

        // Mark as completed
        enrollment.is_completed = true;
        enrollment.completion_date = option::some(current_time);
        enrollment.progress_percentage = 100;

        // Update profile
        let course_entry = vec_map::get_mut(&mut profile.courses_enrolled, &course_id);
        *course_entry = true;

        // Award completion bonus XP
        let bonus_xp = COURSE_COMPLETION_XP + (course.difficulty_level as u64) * 50;
        enrollment.total_xp_earned = enrollment.total_xp_earned + bonus_xp;
        profile.total_xp = profile.total_xp + bonus_xp;
        registry.total_xp_awarded = registry.total_xp_awarded + bonus_xp;

        check_level_up(profile, clock);

        // Mint completion NFT
        let nft = mint_completion_nft(
            course,
            enrollment.total_xp_earned,
            current_time,
            ctx
        );
        let nft_id = object::id(&nft);
        vector::push_back(&mut profile.nfts_earned, nft_id);

        event::emit(CourseCompleted {
            user: tx_context::sender(ctx),
            course_id,
            total_xp_earned: enrollment.total_xp_earned,
            completion_time: current_time - enrollment.started_at,
            timestamp: current_time,
        });

        event::emit(XPAwarded {
            user: tx_context::sender(ctx),
            amount: bonus_xp,
            reason: string::utf8(b"course_completion_bonus"),
            timestamp: current_time,
        });

        event::emit(NFTMinted {
            recipient: tx_context::sender(ctx),
            nft_id,
            achievement_type: string::utf8(b"course_completion"),
            course_title: course.title,
            timestamp: current_time,
        });

        transfer::public_transfer(nft, tx_context::sender(ctx));
    }

     // ===== Helper Functions =====

    /// Calculate XP reward for lesson based on duration and difficulty
    fun calculate_lesson_xp(duration: u64, difficulty: u8): u64 {
        let base_xp = duration / 5; // 1 XP per 5 minutes
        let difficulty_multiplier = (difficulty as u64);
        base_xp * difficulty_multiplier
    }

    /// Calculate quiz score
    fun calculate_quiz_score(quiz: &Quiz, answers: &vector<u64>): u64 {
        let mut correct_answers = 0;
        let mut i = 0;
        let total_questions = vector::length(&quiz.questions);

        while (i < total_questions && i < vector::length(answers)) {
            let question = vector::borrow(&quiz.questions, i);
            let user_answer = *vector::borrow(answers, i);
            
            if (user_answer == question.correct_answer) {
                correct_answers = correct_answers + 1;
            };
            i = i + 1;
        };

        (correct_answers * 100) / total_questions
    }

    /// Check and handle level up
    fun check_level_up(profile: &mut UserProfile, clock: &Clock) {
        let new_level = calculate_level(profile.total_xp);
        if (new_level > profile.current_level) {
            profile.current_level = new_level;
            
            event::emit(LevelUp {
                user: profile.user,
                new_level,
                total_xp: profile.total_xp,
                timestamp: clock::timestamp_ms(clock),
            });
        };
    }

    /// Calculate user level based on XP
    fun calculate_level(total_xp: u64): u64 {
        if (total_xp < LEVEL_2_THRESHOLD) 1
        else if (total_xp < LEVEL_3_THRESHOLD) 2
        else if (total_xp < LEVEL_4_THRESHOLD) 3
        else if (total_xp < LEVEL_5_THRESHOLD) 4
        else 5 + ((total_xp - LEVEL_5_THRESHOLD) / 1000)
    }


 /// Mint completion NFT
    fun mint_completion_nft(
        course: &Course,
        total_xp: u64,
        completion_date: u64,
        ctx: &mut TxContext
    ): CompletionNFT {
        let rarity = determine_rarity(course.difficulty_level, total_xp);
        let image_url = url::new_unsafe_from_bytes(b"https://eduplatform.io/nft/completion.png");
        
        let mut attributes = vec_map::empty();
        vec_map::insert(&mut attributes, string::utf8(b"difficulty"), difficulty_to_string(course.difficulty_level));
        vec_map::insert(&mut attributes, string::utf8(b"xp_earned"), u64_to_string(total_xp));
        vec_map::insert(&mut attributes, string::utf8(b"category"), course.category);

        CompletionNFT {
            id: object::new(ctx),
            recipient: tx_context::sender(ctx),
            course_id: object::id(course),
            course_title: course.title,
            achievement_type: string::utf8(b"course_completion"),
            description: string::utf8(b"Successfully completed the entire course"),
            image_url,
            attributes,
            xp_earned: total_xp,
            completion_date,
            rarity,
        }
    }

/// Determine NFT rarity
    fun determine_rarity(difficulty: u8, total_xp: u64): String {
        if (difficulty >= 5 && total_xp >= 1000) {
            string::utf8(b"legendary")
        } else if (difficulty >= 4 && total_xp >= 500) {
            string::utf8(b"epic")
        } else if (difficulty >= 3) {
            string::utf8(b"rare")
        } else {
            string::utf8(b"common")
        }
    }

    /// Convert difficulty to string
    fun difficulty_to_string(difficulty: u8): String {
        if (difficulty == 1) string::utf8(b"Beginner")
        else if (difficulty == 2) string::utf8(b"Easy")
        else if (difficulty == 3) string::utf8(b"Intermediate")
        else if (difficulty == 4) string::utf8(b"Advanced")
        else string::utf8(b"Expert")
    }

    /// Convert u64 to string (simplified)
    fun u64_to_string(value: u64): String {
        if (value == 0) return string::utf8(b"0");
        
        let mut digits = vector::empty<u8>();
        let mut temp = value;
        
        while (temp > 0) {
            let digit = ((temp % 10) as u8) + 48; // Convert to ASCII
            vector::push_back(&mut digits, digit);
            temp = temp / 10;
        };
        
        vector::reverse(&mut digits);
        string::utf8(digits)
    }

 // ===== View Functions =====

    /// Get user profile info
    public fun get_user_info(profile: &UserProfile): (String, u64, u64, u64, u64, u64) {
        (
            profile.username,
            profile.total_xp,
            profile.current_level,
            vec_map::length(&profile.courses_enrolled),
            vec_map::length(&profile.lessons_completed),
            vector::length(&profile.nfts_earned)
        )
    }

    /// Get course info
    public fun get_course_info(course: &Course): (String, String, String, u8, u64, bool, u64) {
        (
            course.title,
            course.description,
            course.category,
            course.difficulty_level,
            course.total_xp_reward,
            course.is_published,
            course.total_enrollments
        )
    }

    /// Get enrollment progress
    public fun get_enrollment_progress(enrollment: &CourseEnrollment): (u64, bool, u64, u64) {
        (
            enrollment.progress_percentage,
            enrollment.is_completed,
            enrollment.total_xp_earned,
            vec_map::length(&enrollment.lessons_completed)
        )
    }

    /// Get platform stats
    public fun get_platform_stats(registry: &EDUCHAINRegistry): (u64, u64, u64) {
        (
            registry.total_users,
            registry.total_courses,
            registry.total_xp_awarded
        )
    }

    /// Get user achievements count
    public fun get_user_achievements_count(profile: &UserProfile): u64 {
        vec_map::length(&profile.achievements)
    }

    /// Get quiz info
    public fun get_quiz_info(quiz: &Quiz): (u64, u64, u64, u64) {
        (
            vector::length(&quiz.questions),
            quiz.passing_score,
            quiz.max_attempts,
            quiz.xp_reward
        )
    }

    /// Get lesson progress for user
    public fun get_user_lesson_progress(enrollment: &CourseEnrollment, lesson_id: ID): (bool, u64, u64) {
        if (vec_map::contains(&enrollment.lessons_completed, &lesson_id)) {
            let completion = vec_map::get(&enrollment.lessons_completed, &lesson_id);
            (true, completion.xp_earned, completion.completed_at)
        } else {
            (false, 0, 0)
        }
    }

    /// Get user quiz attempts count
    public fun get_user_quiz_attempts_count(enrollment: &CourseEnrollment, quiz_id: ID): u64 {
        if (vec_map::contains(&enrollment.quiz_attempts, &quiz_id)) {
            vector::length(vec_map::get(&enrollment.quiz_attempts, &quiz_id))
        } else {
            0
        }
    }

    /// Check if user has completed achievement
    public fun has_achievement(profile: &UserProfile, achievement_id: ID): bool {
        if (vec_map::contains(&profile.achievements, &achievement_id)) {
            let progress = vec_map::get(&profile.achievements, &achievement_id);
            progress.completed
        } else {
            false
        }
    }
