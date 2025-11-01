const PROGRESS_STORAGE_KEY = 'progressData';

function formatDateTime(dateTime) {
  const date = new Date(dateTime);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${month}-${day} ${hours}:${minutes}`;
}

Page({
  data: {
    streak: 0,
    lastSuccessDate: null,
    daysSinceRelapse: null,
    lastActionText: '暂无记录',
    logs: [],
    note: ''
  },

  onShow() {
    this.loadProgress();
  },

  handleNoteInput(event) {
    this.setData({ note: event.detail.value });
  },

  loadProgress() {
    const stored = wx.getStorageSync(PROGRESS_STORAGE_KEY) || {
      streak: 0,
      logs: []
    };
    const { streak = 0, lastSuccessDate = null, logs = [] } = stored;
    const formattedLogs = logs.map((log) => ({
      ...log,
      label: log.type === 'success' ? '坚持成功' : '破戒记录',
      timeLabel: formatDateTime(log.dateTime)
    }));

    const lastAction = logs[0];
    const lastActionText = lastAction
      ? `${formatDateTime(lastAction.dateTime)} ${
          lastAction.type === 'success' ? '坚持成功' : '记录了一次破戒'
        }${lastAction.note ? ` · ${lastAction.note}` : ''}`
      : '暂无记录，点击按钮开启新旅程';

    this.setData({
      streak,
      lastSuccessDate,
      daysSinceRelapse: this.calcDaysSinceRelapse(logs),
      lastActionText,
      logs: formattedLogs
    });
  },

  calcDaysSinceRelapse(logs) {
    const relapseLog = logs.find((log) => log.type === 'relapse');
    if (!relapseLog) {
      return null;
    }
    const now = new Date();
    const relapseDate = new Date(relapseLog.dateTime);
    const diff = now.getTime() - relapseDate.getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  },

  getTodayKey(date = new Date()) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  markSuccess() {
    const note = this.data.note.trim();
    const stored = wx.getStorageSync(PROGRESS_STORAGE_KEY) || {
      streak: 0,
      logs: [],
      lastSuccessDate: null
    };
    const todayKey = this.getTodayKey();

    if (stored.lastSuccessDate === todayKey) {
      wx.showToast({
        title: '今天已经记录过坚持啦',
        icon: 'none'
      });
      return;
    }

    const now = new Date();
    const logEntry = {
      type: 'success',
      dateTime: now.toISOString(),
      note
    };

    const logs = [logEntry, ...(stored.logs || [])].slice(0, 60);

    wx.setStorageSync(PROGRESS_STORAGE_KEY, {
      streak: (stored.streak || 0) + 1,
      lastSuccessDate: todayKey,
      logs
    });

    this.setData({ note: '' });
    wx.showToast({ title: '已记录，坚持就是胜利', icon: 'success' });
    this.loadProgress();
  },

  markRelapse() {
    const note = this.data.note.trim();
    const stored = wx.getStorageSync(PROGRESS_STORAGE_KEY) || {
      streak: 0,
      logs: [],
      lastSuccessDate: null
    };

    const now = new Date();
    const logEntry = {
      type: 'relapse',
      dateTime: now.toISOString(),
      note
    };

    const logs = [logEntry, ...(stored.logs || [])].slice(0, 60);

    wx.setStorageSync(PROGRESS_STORAGE_KEY, {
      streak: 0,
      lastSuccessDate: null,
      logs
    });

    this.setData({ note: '' });
    wx.showToast({
      title: '记录成功，整理心情重新出发',
      icon: 'none'
    });
    this.loadProgress();
  }
});
