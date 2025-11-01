App({
  globalData: {
    tasks: [
      {
        id: 'morning_routine',
        title: '保持良好作息',
        description: '按时起床、整理床铺、完成晨间祷告或冥想。'
      },
      {
        id: 'exercise',
        title: '日常运动',
        description: '进行至少20分钟的有氧或力量训练，帮助转移注意力。'
      },
      {
        id: 'learning',
        title: '学习充电',
        description: '阅读或学习30分钟，充实自己，远离诱惑。'
      },
      {
        id: 'journaling',
        title: '记录反思',
        description: '记录当日情绪与收获，培养自我觉察能力。'
      }
    ],
    resources: [
      {
        category: '学习资料',
        items: [
          {
            title: '摆脱坏习惯的实用指南',
            description: '了解导致上瘾的心理机制，学习行之有效的戒色策略。',
            link: 'https://mp.weixin.qq.com/'
          },
          {
            title: '如何建立自律系统',
            description: '通过目标拆解、习惯跟踪，构建长期坚持的底层逻辑。',
            link: 'https://weread.qq.com/'
          }
        ]
      },
      {
        category: '身心调节',
        items: [
          {
            title: '3分钟呼吸冥想音频',
            description: '快速平复情绪，帮助你度过冲动时刻。',
            link: 'https://y.qq.com/'
          },
          {
            title: '情绪ABC分析法',
            description: '通过记录触发事件、情绪与信念，建立理性认知。',
            link: 'https://mp.weixin.qq.com/'
          }
        ]
      },
      {
        category: '互助社区',
        items: [
          {
            title: '匿名互助群',
            description: '加入同路人社群，分享心得，获得陪伴与监督。',
            link: 'https://weixin.qq.com/'
          },
          {
            title: '求助热线',
            description: '当你感到焦虑或难以坚持时，拨打热线与专业人士对话。',
            link: 'tel:12355'
          }
        ]
      }
    ]
  }
});
