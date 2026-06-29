import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // ========== USERS ==========
  console.log("📝 Creating users...");

  const hashedPassword = await bcrypt.hash("Password@123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@projex.com" },
    update: {},
    create: {
      email: "admin@projex.com",
      name: "Admin User",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      avatar: "AU",
      emailVerified: true,
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: "manager@projex.com" },
    update: {},
    create: {
      email: "manager@projex.com",
      name: "Sarah Kim",
      password: hashedPassword,
      role: "PROJECT_MANAGER",
      avatar: "SK",
      emailVerified: true,
    },
  });

  const developer = await prisma.user.upsert({
    where: { email: "developer@projex.com" },
    update: {},
    create: {
      email: "developer@projex.com",
      name: "Marcus Lee",
      password: hashedPassword,
      role: "TEAM_MEMBER",
      avatar: "ML",
      emailVerified: true,
    },
  });

  // Additional team members
  const alexChen = await prisma.user.upsert({
    where: { email: "alex.chen@projex.com" },
    update: {},
    create: {
      email: "alex.chen@projex.com",
      name: "Alex Chen",
      password: hashedPassword,
      role: "TEAM_MEMBER",
      avatar: "AC",
      emailVerified: true,
    },
  });

  const johnDoe = await prisma.user.upsert({
    where: { email: "john.doe@projex.com" },
    update: {},
    create: {
      email: "john.doe@projex.com",
      name: "John Doe",
      password: hashedPassword,
      role: "TEAM_MEMBER",
      avatar: "JD",
      emailVerified: true,
    },
  });

  const emilySmith = await prisma.user.upsert({
    where: { email: "emily.smith@projex.com" },
    update: {},
    create: {
      email: "emily.smith@projex.com",
      name: "Emily Smith",
      password: hashedPassword,
      role: "TEAM_MEMBER",
      avatar: "ES",
      emailVerified: true,
    },
  });

  console.log("✅ Users created");

  // ========== PROJECTS ==========
  console.log("📝 Creating projects...");

  const websiteRedesign = await prisma.project.upsert({
    where: { slug: "website-redesign" },
    update: {},
    create: {
      name: "Website Redesign",
      description: "Redesign the company website using modern UI/UX principles.",
      slug: "website-redesign",
      status: "IN_PROGRESS",
      priority: "HIGH",
      visibility: "INTERNAL",
      startDate: new Date("2024-01-15"),
      endDate: new Date("2024-03-31"),
      progress: 65,
      ownerId: manager.id,
    },
  });

  const mobileBanking = await prisma.project.upsert({
    where: { slug: "mobile-banking-app" },
    update: {},
    create: {
      name: "Mobile Banking App",
      description: "Build a secure mobile banking application.",
      slug: "mobile-banking-app",
      status: "PLANNING",
      priority: "CRITICAL",
      visibility: "PRIVATE",
      startDate: new Date("2024-03-01"),
      endDate: new Date("2024-09-30"),
      progress: 15,
      ownerId: admin.id,
    },
  });

  const aiSupport = await prisma.project.upsert({
    where: { slug: "ai-customer-support" },
    update: {},
    create: {
      name: "AI Customer Support Platform",
      description: "Develop an AI-powered customer support system.",
      slug: "ai-customer-support",
      status: "IN_PROGRESS",
      priority: "HIGH",
      visibility: "INTERNAL",
      startDate: new Date("2024-02-01"),
      endDate: new Date("2024-08-31"),
      progress: 40,
      ownerId: manager.id,
    },
  });

  const ecommercePlatform = await prisma.project.upsert({
    where: { slug: "ecommerce-platform" },
    update: {},
    create: {
      name: "E-Commerce Platform",
      description: "Build a scalable online marketplace.",
      slug: "ecommerce-platform",
      status: "REVIEW",
      priority: "MEDIUM",
      visibility: "PUBLIC",
      startDate: new Date("2023-11-01"),
      endDate: new Date("2024-06-30"),
      progress: 85,
      ownerId: developer.id,
    },
  });

  console.log("✅ Projects created");

  // ========== PROJECT MEMBERS ==========
  console.log("📝 Adding project members...");

  await prisma.projectMember.upsert({
    where: {
      projectId_userId: {
        projectId: websiteRedesign.id,
        userId: manager.id,
      },
    },
    update: {},
    create: {
      projectId: websiteRedesign.id,
      userId: manager.id,
      role: "PROJECT_MANAGER",
      joinedAt: new Date(),
    },
  });

  await prisma.projectMember.upsert({
    where: {
      projectId_userId: {
        projectId: websiteRedesign.id,
        userId: alexChen.id,
      },
    },
    update: {},
    create: {
      projectId: websiteRedesign.id,
      userId: alexChen.id,
      role: "TEAM_MEMBER",
      joinedAt: new Date(),
    },
  });

  await prisma.projectMember.upsert({
    where: {
      projectId_userId: {
        projectId: websiteRedesign.id,
        userId: developer.id,
      },
    },
    update: {},
    create: {
      projectId: websiteRedesign.id,
      userId: developer.id,
      role: "TEAM_MEMBER",
      joinedAt: new Date(),
    },
  });

  // Mobile Banking members
  await prisma.projectMember.upsert({
    where: {
      projectId_userId: {
        projectId: mobileBanking.id,
        userId: admin.id,
      },
    },
    update: {},
    create: {
      projectId: mobileBanking.id,
      userId: admin.id,
      role: "PROJECT_MANAGER",
      joinedAt: new Date(),
    },
  });

  await prisma.projectMember.upsert({
    where: {
      projectId_userId: {
        projectId: mobileBanking.id,
        userId: developer.id,
      },
    },
    update: {},
    create: {
      projectId: mobileBanking.id,
      userId: developer.id,
      role: "TEAM_MEMBER",
      joinedAt: new Date(),
    },
  });

  console.log("✅ Project members added");

  // ========== LABELS ==========
  console.log("📝 Creating labels...");

  const designLabel = await prisma.label.create({
    data: {
      projectId: websiteRedesign.id,
      name: "Design",
      color: "#5C6BC0",
    },
  });

  const uiuxLabel = await prisma.label.create({
    data: {
      projectId: websiteRedesign.id,
      name: "UI/UX",
      color: "#3B82F6",
    },
  });

  const backendLabel = await prisma.label.create({
    data: {
      projectId: websiteRedesign.id,
      name: "Backend",
      color: "#F59E0B",
    },
  });

  const securityLabel = await prisma.label.create({
    data: {
      projectId: mobileBanking.id,
      name: "Security",
      color: "#EF4444",
    },
  });

  const realtimeLabel = await prisma.label.create({
    data: {
      projectId: aiSupport.id,
      name: "Realtime",
      color: "#10B981",
    },
  });

  console.log("✅ Labels created");

  // ========== BOARDS ==========
  console.log("📝 Creating boards...");

  const websiteBoard1 = await prisma.board.create({
    data: {
      projectId: websiteRedesign.id,
      name: "Sprint 1",
      order: 1,
    },
  });

  const websiteBoard2 = await prisma.board.create({
    data: {
      projectId: websiteRedesign.id,
      name: "Sprint 2",
      order: 2,
    },
  });

  const mobileBankingBoardMVP = await prisma.board.create({
    data: {
      projectId: mobileBanking.id,
      name: "MVP",
      order: 1,
    },
  });

  const mobileBankingBoardQA = await prisma.board.create({
    data: {
      projectId: mobileBanking.id,
      name: "QA",
      order: 2,
    },
  });

  const aiSupportBoard = await prisma.board.create({
    data: {
      projectId: aiSupport.id,
      name: "Development",
      order: 1,
    },
  });

  console.log("✅ Boards created");

  // ========== COLUMNS ==========
  console.log("📝 Creating columns...");

  const columnNames = ["Backlog", "Todo", "In Progress", "Review", "Testing", "Done"];
  const columnColors = ["#9CA3AF", "#3B82F6", "#F59E0B", "#8B5CF6", "#EC4899", "#10B981"];

  const websiteBoard1Columns = await Promise.all(
    columnNames.map((name, index) =>
      prisma.column.create({
        data: {
          boardId: websiteBoard1.id,
          name,
          color: columnColors[index],
          order: index,
        },
      })
    )
  );

  const websiteBoard2Columns = await Promise.all(
    columnNames.map((name, index) =>
      prisma.column.create({
        data: {
          boardId: websiteBoard2.id,
          name,
          color: columnColors[index],
          order: index,
        },
      })
    )
  );

  const mobileBankingBoardColumns = await Promise.all(
    columnNames.map((name, index) =>
      prisma.column.create({
        data: {
          boardId: mobileBankingBoardMVP.id,
          name,
          color: columnColors[index],
          order: index,
        },
      })
    )
  );

  const aiSupportBoardColumns = await Promise.all(
    columnNames.map((name, index) =>
      prisma.column.create({
        data: {
          boardId: aiSupportBoard.id,
          name,
          color: columnColors[index],
          order: index,
        },
      })
    )
  );

  console.log("✅ Columns created");

  // ========== TASKS ==========
  console.log("📝 Creating tasks...");

  // Website Redesign Tasks
  const designHomepageTask = await prisma.task.create({
    data: {
      columnId: websiteBoard1Columns[1].id, // Todo
      title: "Design Homepage Wireframe",
      description: "Create detailed wireframes for the new homepage design",
      priority: "HIGH",
      status: "TODO",
      assigneeId: alexChen.id,
      creatorId: manager.id,
      dueDate: new Date("2024-02-15"),
      storyPoints: 8,
    },
  });

  const designComponentsTask = await prisma.task.create({
    data: {
      columnId: websiteBoard1Columns[1].id, // Todo
      title: "Design UI Components Library",
      description: "Create reusable UI components for the website",
      priority: "MEDIUM",
      status: "TODO",
      assigneeId: alexChen.id,
      creatorId: manager.id,
      dueDate: new Date("2024-02-20"),
      storyPoints: 5,
    },
  });

  const developHeaderTask = await prisma.task.create({
    data: {
      columnId: websiteBoard1Columns[2].id, // In Progress
      title: "Develop Header and Navigation",
      description: "Implement header component with responsive navigation",
      priority: "HIGH",
      status: "IN_PROGRESS",
      assigneeId: developer.id,
      creatorId: manager.id,
      dueDate: new Date("2024-02-18"),
      storyPoints: 5,
      startDate: new Date("2024-02-05"),
    },
  });

  const testDesignTask = await prisma.task.create({
    data: {
      columnId: websiteBoard1Columns[4].id, // Testing
      title: "Test Homepage Design",
      description: "QA testing for the homepage",
      priority: "MEDIUM",
      status: "TESTING",
      assigneeId: emilySmith.id,
      creatorId: manager.id,
      dueDate: new Date("2024-02-22"),
      storyPoints: 3,
    },
  });

  // Mobile Banking Tasks
  const authAPITask = await prisma.task.create({
    data: {
      columnId: mobileBankingBoardColumns[1].id, // Todo
      title: "Build Authentication API",
      description: "Implement secure OAuth2 authentication",
      priority: "URGENT",
      status: "TODO",
      assigneeId: developer.id,
      creatorId: admin.id,
      dueDate: new Date("2024-04-15"),
      storyPoints: 13,
    },
  });

  const paymentAPITask = await prisma.task.create({
    data: {
      columnId: mobileBankingBoardColumns[1].id, // Todo
      title: "Build Payment Processing API",
      description: "Integrate with payment gateway",
      priority: "HIGH",
      status: "TODO",
      assigneeId: developer.id,
      creatorId: admin.id,
      dueDate: new Date("2024-05-01"),
      storyPoints: 21,
    },
  });

  // AI Support Tasks
  const notificationServiceTask = await prisma.task.create({
    data: {
      columnId: aiSupportBoardColumns[1].id, // Todo
      title: "Create Notification Service",
      description: "Build real-time notification system using Socket.IO",
      priority: "MEDIUM",
      status: "TODO",
      assigneeId: manager.id,
      creatorId: manager.id,
      dueDate: new Date("2024-04-01"),
      storyPoints: 8,
    },
  });

  const aiTrainingTask = await prisma.task.create({
    data: {
      columnId: aiSupportBoardColumns[2].id, // In Progress
      title: "Train AI Model for Support",
      description: "Train and optimize the support chatbot AI model",
      priority: "HIGH",
      status: "IN_PROGRESS",
      assigneeId: developer.id,
      creatorId: manager.id,
      dueDate: new Date("2024-05-15"),
      storyPoints: 13,
      startDate: new Date("2024-03-15"),
    },
  });

  console.log("✅ Tasks created");

  // ========== TASK LABELS ==========
  console.log("📝 Adding task labels...");

  await prisma.taskLabel.create({
    data: {
      taskId: designHomepageTask.id,
      labelId: designLabel.id,
    },
  });

  await prisma.taskLabel.create({
    data: {
      taskId: designHomepageTask.id,
      labelId: uiuxLabel.id,
    },
  });

  await prisma.taskLabel.create({
    data: {
      taskId: authAPITask.id,
      labelId: securityLabel.id,
    },
  });

  await prisma.taskLabel.create({
    data: {
      taskId: notificationServiceTask.id,
      labelId: realtimeLabel.id,
    },
  });

  console.log("✅ Task labels added");

  // ========== COMMENTS ==========
  console.log("📝 Creating comments...");

  await prisma.comment.create({
    data: {
      taskId: designHomepageTask.id,
      userId: manager.id,
      content: "Great start on the homepage design! Please check the brand guidelines for colors.",
    },
  });

  await prisma.comment.create({
    data: {
      taskId: authAPITask.id,
      userId: admin.id,
      content: "Make sure to implement 2FA for enhanced security.",
    },
  });

  console.log("✅ Comments created");

  // ========== NOTIFICATIONS ==========
  console.log("📝 Creating notifications...");

  await prisma.notification.create({
    data: {
      userId: manager.id,
      type: "TASK_ASSIGNED",
      title: "Task Assigned",
      message: "Sarah Kim assigned you to 'Build Authentication API'",
      relatedTaskId: authAPITask.id,
      relatedUserId: developer.id,
    },
  });

  await prisma.notification.create({
    data: {
      userId: alexChen.id,
      type: "DUE_DATE_REMINDER",
      title: "Due Date Reminder",
      message: "'Design Homepage Wireframe' is due tomorrow",
      relatedTaskId: designHomepageTask.id,
    },
  });

  await prisma.notification.create({
    data: {
      userId: manager.id,
      type: "PROJECT_INVITATION",
      title: "Project Invitation",
      message: "Alex Chen invited you to 'AI Customer Support Platform'",
      relatedProjectId: aiSupport.id,
      relatedUserId: alexChen.id,
    },
  });

  await prisma.notification.create({
    data: {
      userId: developer.id,
      type: "MENTIONED_IN_COMMENT",
      title: "Mentioned in Comment",
      message: "Marcus Lee mentioned you in 'Build Authentication API'",
      relatedTaskId: authAPITask.id,
      relatedUserId: admin.id,
    },
  });

  console.log("✅ Notifications created");

  // ========== ACTIVITY LOGS ==========
  console.log("📝 Creating activity logs...");

  await prisma.activityLog.create({
    data: {
      userId: manager.id,
      projectId: websiteRedesign.id,
      action: "created",
      entityType: "Project",
      entityId: websiteRedesign.id,
      changes: JSON.stringify({
        name: "Website Redesign",
        status: "IN_PROGRESS",
      }),
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: alexChen.id,
      projectId: websiteRedesign.id,
      taskId: designHomepageTask.id,
      action: "created",
      entityType: "Task",
      entityId: designHomepageTask.id,
      changes: JSON.stringify({
        title: "Design Homepage Wireframe",
        priority: "HIGH",
      }),
    },
  });

  console.log("✅ Activity logs created");

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
