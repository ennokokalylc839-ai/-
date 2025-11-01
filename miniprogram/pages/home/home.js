const app = getApp();
const { getDailyQuote } = require('../../utils/quotes');

const PROGRESS_STORAGE_KEY = 'progressData';

function formatDateTime(dateString) {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${month}月${day}日 ${hours}:${minutes}`;
}

Page({
  data: {
    streakDays: 0,
    lastRecordText: '暂无记录，今天就开始第一步吧！',
    completedTasks: 0,
    totalTasks: 0,
    quote: null
  },

  onLoad() {
    this.updateQuote();
  },

  onShow() {
    this.updateProgress();
    this.updateTasksPreview();
  },

  updateQuote() {
    const quote = getDailyQuote(new Date());
    this.setData({ quote });
  },

  updateProgress() {
    const stored = wx.getStorageSync(PROGRESS_STORAGE_KEY) || { streak: 0, logs: [] };
    const { streak = 0, logs = [] } = stored;
    let lastRecordText = '暂无记录，今天就开始第一步吧！';

    if (logs.length > 0) {
      const [latest] = logs;
      if (latest.type === 'success') {
        lastRecordText = `${formatDateTime(latest.dateTime)} 坚持成功${
          latest.note ? ` · ${latest.note}` : ''
        }`;
      } else {
        lastRecordText = `${formatDateTime(latest.dateTime)} 记录了一次破戒${
          latest.note ? ` · ${latest.note}` : ''
        }`;
      }
    }

    this.setData({
      streakDays: streak,
      lastRecordText
    });
  },

  updateTasksPreview() {
    const tasks = app.globalData.tasks || [];
    const todayKey = this.getTodayKey();
    const status = wx.getStorageSync(`taskStatus_${todayKey}`) || {};
    const completed = Object.values(status).filter(Boolean).length;

    this.setData({
      completedTasks: completed,
      totalTasks: tasks.length
    });
  },

  getTodayKey() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
});
