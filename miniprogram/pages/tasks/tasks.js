const app = getApp();

Page({
  data: {
    todayKey: '',
    tasks: [],
    status: {},
    completedCount: 0,
    totalCount: 0,
    completionRate: 0,
    showAddForm: false,
    newTaskTitle: '',
    newTaskDesc: ''
  },

  onLoad() {
    this.syncTodayKey();
  },

  onShow() {
    this.syncTodayKey();
    this.loadTasks();
  },

  syncTodayKey() {
    const todayKey = this.getTodayKey();
    if (this.data.todayKey !== todayKey) {
      this.setData({ todayKey });
    }
  },

  getTodayKey(date = new Date()) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  loadTasks() {
    const baseTasks = app.globalData.tasks || [];
    const customTasks = wx.getStorageSync('customTasks') || [];
    const allTasks = [...baseTasks, ...customTasks];
    const status = wx.getStorageSync(`taskStatus_${this.data.todayKey}`) || {};

    const tasks = allTasks.map((task) => ({
      ...task,
      completed: Boolean(status[task.id])
    }));

    const completedCount = tasks.filter((task) => task.completed).length;
    const totalCount = tasks.length;
    const completionRate = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

    this.setData({
      tasks,
      status,
      completedCount,
      totalCount,
      completionRate
    });
  },

  toggleTask(event) {
    const { id } = event.currentTarget.dataset;
    const { value } = event.detail;
    const status = { ...this.data.status, [id]: value };
    wx.setStorageSync(`taskStatus_${this.data.todayKey}`, status);
    this.setData({ status });
    this.loadTasks();
    wx.showToast({
      title: value ? '已完成一项任务' : '已取消完成状态',
      icon: 'none'
    });
  },

  openAddForm() {
    this.setData({
      showAddForm: true,
      newTaskTitle: '',
      newTaskDesc: ''
    });
  },

  closeAddForm() {
    this.setData({
      showAddForm: false,
      newTaskTitle: '',
      newTaskDesc: ''
    });
  },

  handleTitleInput(event) {
    this.setData({ newTaskTitle: event.detail.value });
  },

  handleDescInput(event) {
    this.setData({ newTaskDesc: event.detail.value });
  },

  submitNewTask() {
    const title = this.data.newTaskTitle.trim();
    const description = this.data.newTaskDesc.trim();

    if (!title) {
      wx.showToast({ title: '请填写任务名称', icon: 'none' });
      return;
    }

    const newTask = {
      id: `custom_${Date.now()}`,
      title,
      description: description || '为自己设定的小任务，坚持就有改变。'
    };

    const customTasks = wx.getStorageSync('customTasks') || [];
    customTasks.push(newTask);
    wx.setStorageSync('customTasks', customTasks);

    this.setData({
      showAddForm: false,
      newTaskTitle: '',
      newTaskDesc: ''
    });

    wx.showToast({ title: '已添加任务', icon: 'success' });
    this.loadTasks();
  },

  resetTodayStatus() {
    wx.showModal({
      title: '重置今日记录',
      content: '确定清空今天的任务完成情况吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync(`taskStatus_${this.data.todayKey}`);
          this.loadTasks();
          wx.showToast({ title: '已重置今日记录', icon: 'none' });
        }
      }
    });
  }
});
