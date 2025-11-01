const app = getApp();

Page({
  data: {
    resources: [],
    emergencySteps: [
      '深呼吸30秒，放慢节奏，让身体先冷静下来。',
      '离开当前环境，走到光线明亮的公共区域。',
      '联系信任的朋友或社群伙伴，寻求陪伴。',
      '翻看自己的成长记录，提醒自己为何出发。'
    ],
    focusTechniques: [
      '番茄钟法：专注25分钟，休息5分钟，循环四次后长休息。',
      '替代计划：提前准备运动、阅读、学习等替代行为列表。',
      '正念练习：注意力回到呼吸和身体感受，观察念头起落。',
      '奖励机制：完成目标后给自己小奖励，强化积极反馈。'
    ]
  },

  onLoad() {
    const { resources = [] } = app.globalData;
    this.setData({ resources });
  },

  openLink(event) {
    const { link } = event.currentTarget.dataset;
    if (!link) {
      return;
    }

    if (link.startsWith('tel:')) {
      const phoneNumber = link.replace('tel:', '');
      wx.makePhoneCall({ phoneNumber });
      return;
    }

    wx.setClipboardData({
      data: link,
      success: () => {
        wx.showToast({ title: '链接已复制，可在浏览器中打开', icon: 'none' });
      }
    });
  }
});
