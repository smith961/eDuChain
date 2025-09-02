module educhain::educhain;

use sui::vec_map::{Self, VecMap};
use sui::package;
use sui::display;
use sui::clock::{Self, Clock};
use sui::event;
use std::string::{Self, String};

// =====Constants=====
const LESSON_XP_REWARD: u64 =  50;
const COURSE_COMPLETION_XP: u64 = 200;
const QUIZ_PASS_XP: u64 = 100;
const DAILY_LOGIN_BONUS: u64 = 10;

// =====Level thresholds=====
const LEVEL_1_THRESHOLD: u64 = 200;
const LEVEL_2_THRESHOLD: u64 = 500;
const LEVEL_3_THRESHOLD: u64 = 1000;
const LEVEL_4_THRESHOLD: u64 = 2000;

// =====Error codes=====
const ENotAuthorized: u64 = 1;
const EAlreadyCompleted: u64 = 2;
const ECourseNotFound: u64 = 3;
const EUserNotRegistered: u64 = 4;
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
    current_level: u8,
    courses_enrolled: VecMap<ID, bool>, // course_id -> completed
    lessons_completed: VecMap<ID, bool>, // lesson_id -> completed
    nfts_earned: vector<ID>,
    last_login: u64, // timestamp of last login
    login_streak: u64, // consecutive login days
    registration_date: u64, // timestamp of registration
    is_active: bool,
}

/// Course structure
public struct Course has key {
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
public struct Lesson has  store {   
    id: UID,
    title: String,
    content_type: String,
    content_url: String, // link to video/text content
    duration: u64, // in minutes
    xp_reward: u64,
    quiz_id: Option<ID>,
    order_index: u64, // additional resource links
}

/// Quiz structure
public struct Quiz has key, store { 
    id: UID,
    lesson_id: ID,
    questions: vector<QuizQuestion>,
    passing_score: u64, // percentage
    max_attempts: u64,
    xp_reward: u64,
}
/// Individual quiz question
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

/// NFT structure for rewards
public struct CompletionNFT has key, store {
    id: UID,
    recipient: address,
    course_id: ID,
    issued_at: u64, // timestamp
    course_title: String,
    achievement_type: String, // e.g., "Course Completion", "Top Scorer"
    description: String,
    image_url: String, // link to NFT image
    attributes: VecMap<String, String>, // e.g., [("Level", "Beginner"), ("Category", "Math")]
    xp_earned: u64,
    completion_date: u64, // timestamp
    rarity: String, // e.g., "Common", "Rare", "Epic"
}

/// XP Token for rewards (FUNGIBLE)
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
    new_level: u8,
    total_xp: u64,
    timestamp: u64,
}

public struct NFTMinted has copy, drop {
    recipient: address,
    nft_id: ID,
    achievement_type: String,
    courese_title: String,
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

