const dotenv = require('dotenv');
const {
  sequelize,
  User,
  Branch,
  Trainer,
  MembershipPlan,
  Member,
  Membership,
  GymClass,
  Booking,
  Waitlist,
  Attendance,
  WorkoutPlan,
  NutritionPlan,
  Progress,
  Locker,
  Payment,
  Notification
} = require('../models');

dotenv.config();

const seedDB = async () => {
  try {
    console.log('[Seed] Connecting to PostgreSQL and resetting tables...');
    await sequelize.sync({ force: true });
    console.log('[Seed] Database tables dropped and recreated cleanly.');

    // 1. Create Branches
    const b1 = await Branch.create({
      name: 'Downtown Flagship',
      address: '742 Evergreen Terrace, Downtown District',
      phone: '+1 (555) 234-5678',
      email: 'downtown@apexfit.com',
      openingHours: '5:00 AM - 11:00 PM',
      capacity: 350
    });

    const b2 = await Branch.create({
      name: 'Westside Fitness Hub',
      address: '120 Ocean Boulevard, Westside Marina',
      phone: '+1 (555) 876-5432',
      email: 'westside@apexfit.com',
      openingHours: '6:00 AM - 10:00 PM',
      capacity: 250
    });

    console.log('[Seed] Branches created.');

    // 2. Create Membership Plans
    const planBasic = await MembershipPlan.create({
      name: 'Basic Access',
      durationDays: 30,
      price: 2999,
      description: '1 Month single branch access with full gym equipment availability.',
      features: ['Single Branch Access', 'Full Gym Equipment', 'Locker Room Access', 'Standard Mobile App'],
      accessLevel: 'Basic',
      classAccess: false,
      branchAccess: 'Single Branch'
    });

    const planStandard = await MembershipPlan.create({
      name: 'Standard Pro',
      durationDays: 90,
      price: 7499,
      description: '3 Months unlimited fitness access including group classes and locker rental.',
      features: ['Single Branch Access', 'Unlimited Group Classes', 'Free Locker Assignment', '1 Free Trainer Consultation'],
      accessLevel: 'Standard',
      classAccess: true,
      branchAccess: 'Single Branch'
    });

    const planPremium = await MembershipPlan.create({
      name: 'Premium All-Access',
      durationDays: 180,
      price: 12999,
      description: '6 Months multi-branch access with dedicated personal trainer assignment & custom nutrition planning.',
      features: ['Multi-Branch Access', 'Unlimited Premium Classes', 'Personal Trainer Assignment', 'Customized Meal & Workout Plans', 'Guest Pass (2/month)'],
      accessLevel: 'VIP Premium',
      classAccess: true,
      branchAccess: 'Multi-Branch Access'
    });

    const planAnnual = await MembershipPlan.create({
      name: 'Annual VIP Pass',
      durationDays: 365,
      price: 21999,
      description: '12 Months ultimate VIP experience with total multi-branch privileges, priority booking, and sauna access.',
      features: ['All Branch Access', 'Priority Class Booking & Waitlist', 'Dedicated Personal Coach', 'Custom Nutrition & Progress Logs', 'Sauna & Recovery Spa Access'],
      accessLevel: 'All Access',
      classAccess: true,
      branchAccess: 'Multi-Branch Access'
    });

    console.log('[Seed] Membership Plans created.');

    // 3. Create Admin and Trainer users
    const adminUser = await User.create({
      name: 'velocity',
      email: 'velocitygamer9@gmail.com',
      password: 'Demo123',
      role: 'Admin',
      phone: '',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
    });

    const trainerUser = await User.create({
      name: 'Sigmax',
      email: 'sigmax1209@gmail.com',
      password: 'Demo123',
      role: 'Trainer',
      phone: '',
      profileImage: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=300&auto=format&fit=crop&q=80'
    });

    await Trainer.create({
      userId: trainerUser.id,
      branchId: b1.id,
      specialization: 'General Fitness & Conditioning',
      experienceYears: 2,
      certifications: [],
      bio: '',
      rating: 4.5
    });

    console.log('[Seed] Created Admin and Trainer accounts.');

    console.log('[Seed] Database seeding completed successfully!');
    console.log('\n--- DEMO LOGIN CREDENTIALS ---');
    console.log('Admin:   velocitygamer9@gmail.com   / Demo123');
    console.log('Trainer: sigmax1209@gmail.com      / Demo123');
    console.log('-------------------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDB();
