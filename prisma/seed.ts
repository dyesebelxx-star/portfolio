import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.work.deleteMany();
  await prisma.admin.deleteMany();

  // Create admin user
  await prisma.admin.create({
    data: {
      username: "admin",
      passwordHash: "admin123", // For env-based auth, this is a placeholder
    },
  });

  // Seed sample works
  const works = [
    {
      slug: "ai-campus-love-ep1",
      title: "AI校园恋综 第一集：初见",
      type: "video",
      category: "恋综",
      tags: JSON.stringify(["AI视频", "恋综", "Runway", "Midjourney"]),
      coverImage: "/uploads/covers/campus-love-cover.jpg",
      description: "全程使用AI工具制作的校园恋爱综艺第一集，从人物设计到场景搭建，再到视频生成，完整呈现AI内容创作流程。",
      content: `## 项目概述

这是国内首批全程使用AI工具制作的校园恋爱综艺节目。本项目从零开始，使用AI工具完成人物设计、场景搭建、视频生成、配音配乐等全部制作环节。

## 创作亮点

- **人物一致性**：通过精心设计的 Prompt 模板，确保同一角色在不同场景中保持一致的外观
- **情感表达**：利用 AI 视频生成工具的图生视频功能，实现细腻的情感表达
- **多工具协作**：结合 Midjourney、Runway Gen-2、ElevenLabs 等多个AI工具`,
      images: JSON.stringify([
        "/uploads/images/campus-1.jpg",
        "/uploads/images/campus-2.jpg",
        "/uploads/images/campus-3.jpg",
      ]),
      videoUrl: "",
      prompts: JSON.stringify([
        {
          title: "女主角人物设计 Prompt",
          content: "A beautiful Chinese college student, early 20s, natural makeup, long black hair, warm smile, wearing a white blouse and jeans, soft natural lighting, portrait photography style, shot on 85mm lens, f/1.8 --ar 3:4 --style raw --v 6.1",
          model: "Midjourney v6.1",
          notes: "重点控制人物年龄感和学生气质，避免过度成熟的妆容"
        },
        {
          title: "校园场景 Prompt",
          content: "A modern Chinese university campus, cherry blossom trees in bloom, spring season, students walking in background, afternoon golden hour lighting, wide angle architectural photography, clean composition --ar 16:9 --style raw --v 6.1",
          model: "Midjourney v6.1",
          notes: "场景需要多角度拍摄，保证后期视频编辑的素材丰富度"
        }
      ]),
      workflow: JSON.stringify([
        { order: 1, title: "人物设计", description: "使用Midjourney设计主要角色形象，通过多次迭代确定人物最终外观。为每个角色建立视觉参考库，确保后续生成的一致性。" },
        { order: 2, title: "场景搭建", description: "利用Midjourney和Stable Diffusion生成校园各场景背景图，包括教室、图书馆、操场、食堂等关键场景。" },
        { order: 3, title: "视频生成", description: "使用Runway Gen-2的图生视频功能将关键帧转化为动态视频片段，结合运动笔刷控制角色动作。" },
        { order: 4, title: "配音与后期", description: "使用ElevenLabs进行AI配音，剪映进行视频剪辑和配乐，完成最终成品。" },
      ]),
      summary: "本项目证明了AI工具在视频内容创作领域的巨大潜力。通过合理的Prompt工程和多工具协作，单人即可完成原本需要专业团队才能制作的视频内容。关键成功因素在于对Prompt的精细控制和多工具之间的无缝衔接。",
      featured: true,
      published: true,
    },
    {
      slug: "ai-fashion-collection-2026",
      title: "AI时装系列：东方新韵 2026",
      type: "image",
      category: "人物设计",
      tags: JSON.stringify(["AI图片", "时尚", "Midjourney", "人物设计", "东方美学"]),
      coverImage: "/uploads/covers/fashion-cover.jpg",
      description: "探索AI在时装设计领域的应用，将东方传统元素与现代时尚融合，创造独特的虚拟时装系列。",
      content: `## 创作理念

这个系列探索了如何利用AI将中国传统服饰元素与现代时尚趋势相结合。通过精心设计的Prompt，引导AI在保持东方美学精髓的同时，创造出符合当代审美的时装作品。

## 技术细节

- 使用 Midjourney v6.1 的风格参考功能
- 通过 --cref 参数确保模特一致性
- 多轮迭代优化服装细节`,
      images: JSON.stringify([
        "/uploads/images/fashion-1.jpg",
        "/uploads/images/fashion-2.jpg",
        "/uploads/images/fashion-3.jpg",
        "/uploads/images/fashion-4.jpg",
      ]),
      videoUrl: "",
      prompts: JSON.stringify([
        {
          title: "东方新韵风格 Prompt",
          content: "A haute couture fashion editorial, East Asian female model, modern cheongsam-inspired dress with flowing silk fabric, traditional cloud patterns reimagined in minimalist style, jade green and warm gold color palette, studio lighting, Vogue magazine style, full body shot --ar 2:3 --style raw --v 6.1",
          model: "Midjourney v6.1",
          notes: "关键是将传统元素'现代化'而非简单复制，通过minimalist等词控制设计方向"
        }
      ]),
      workflow: JSON.stringify([
        { order: 1, title: "灵感收集", description: "研究中国传统服饰元素，收集纹样、色彩、廓形等视觉参考" },
        { order: 2, title: "Prompt 设计", description: "编写和迭代优化 Prompt，平衡传统与现代的设计语言" },
        { order: 3, title: "批量生成", description: "使用多种Prompt变体批量生成，筛选最佳作品" },
        { order: 4, title: "后期精修", description: "使用 Photoshop AI 进行细节修复和色彩调校" },
      ]),
      summary: "AI在时装设计领域的应用正在快速发展。本系列证明了AI不仅能辅助设计，更能在文化融合方面提供独特的创意视角。",
      featured: true,
      published: true,
    },
    {
      slug: "ai-scifi-short-film",
      title: "AI科幻短片：《最后的守护者》",
      type: "video",
      category: "AI短剧",
      tags: JSON.stringify(["AI视频", "科幻", "短片", "Runway", "ComfyUI"]),
      coverImage: "/uploads/covers/scifi-cover.jpg",
      description: "一部完全由AI生成的科幻短片，讲述未来世界中AI守护人类文明最后火种的故事。",
      content: `## 项目背景

这是一部实验性的AI科幻短片，全程使用AI工具完成。从剧本构思到视觉呈现，探索AI在叙事型视频创作中的可能性。

## 制作工具链

- **图像生成**: ComfyUI + Stable Diffusion XL
- **视频生成**: Runway Gen-2 + Pika Labs
- **配音**: ElevenLabs
- **配乐**: Suno AI`,
      images: JSON.stringify([
        "/uploads/images/scifi-1.jpg",
        "/uploads/images/scifi-2.jpg",
      ]),
      videoUrl: "",
      prompts: JSON.stringify([
        {
          title: "科幻场景 Prompt",
          content: "A futuristic cyberpunk cityscape, year 2157, neon lights reflecting on wet streets, holographic advertisements, lone figure standing on rooftop overlooking the city, cinematic lighting, blade runner aesthetic, ultra detailed, 8k --ar 16:9 --v 6.1",
          model: "Midjourney v6.1",
          notes: "使用 --ar 16:9 确保视频素材比例正确"
        }
      ]),
      workflow: JSON.stringify([
        { order: 1, title: "剧本构思", description: "与Claude协作完成剧本大纲和分镜脚本" },
        { order: 2, title: "视觉概念设计", description: "使用AI生成关键场景和角色的概念图" },
        { order: 3, title: "分镜生成", description: "按分镜脚本逐一生成所需画面素材" },
        { order: 4, title: "视频合成", description: "将静态画面转化为动态视频，添加转场和特效" },
      ]),
      summary: "AI正在改变视频创作的方式。本项目展示了即使没有专业影视团队，个人创作者也能通过AI工具完成高质量的叙事短片。",
      featured: true,
      published: true,
    },
    {
      slug: "prompt-engineering-guide",
      title: "Prompt工程实践：从入门到精通",
      type: "image",
      category: "其他",
      tags: JSON.stringify(["Prompt工程", "教程", "最佳实践"]),
      coverImage: "/uploads/covers/prompt-guide-cover.jpg",
      description: "系统总结AI图像生成中的Prompt工程技巧，包含100+实用Prompt模板和详细注释。",
      content: `## 关于这个项目

这是我在长期AI图像创作中积累的Prompt工程经验总结。包含了从基础语法到高级技巧的完整知识体系。

## 内容结构

1. **基础篇**: Prompt的基本结构和语法
2. **进阶篇**: 风格控制、负面提示词、参数调优
3. **高级篇**: 多工具Prompt适配、风格迁移、人物一致性`,
      images: JSON.stringify([]),
      videoUrl: "",
      prompts: JSON.stringify([
        {
          title: "通用高质量 Prompt 模板",
          content: "[主体描述], [环境/背景], [光线条件], [构图/角度], [风格参考], [技术参数] --ar [比例] --style raw --v 6.1",
          model: "通用模板",
          notes: "这是最基础的prompt结构模板，可根据具体需求调整各部分的详细程度"
        }
      ]),
      workflow: JSON.stringify([
        { order: 1, title: "知识整理", description: "系统梳理在各类项目中使用的Prompt技巧" },
        { order: 2, title: "分类归纳", description: "按应用场景分类整理Prompt模板" },
        { order: 3, title: "验证测试", description: "逐个验证Prompt的可用性和效果" },
      ]),
      summary: "Prompt工程是AI时代最重要的技能之一。通过系统化的学习和实践，每个人都能掌握与AI高效沟通的能力。",
      featured: false,
      published: true,
    },
  ];

  for (const work of works) {
    await prisma.work.create({ data: work });
  }

  console.log("✅ Seed data created successfully");
  console.log(`   - ${works.length} sample works`);
  console.log("   - 1 admin user (admin / admin123)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
