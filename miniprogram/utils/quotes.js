const quotes = [
  {
    text: '真正的自由不是放纵欲望，而是掌控欲望。',
    author: '柏拉图'
  },
  {
    text: '意志坚强的人能把世界放在手中像泥块一样任意揉捏。',
    author: '歌德'
  },
  {
    text: '别让短暂的快乐击碎你长期的目标。',
    author: '戒色日记'
  },
  {
    text: '一个人最可怕的敌人，就是自我怀疑。',
    author: '罗曼·罗兰'
  },
  {
    text: '自律让生活充满力量，善待自己从克制开始。',
    author: '匿名'
  }
];

function getDailyQuote(date = new Date()) {
  const dayIndex = Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
  const index = dayIndex % quotes.length;
  return quotes[index];
}

module.exports = {
  getDailyQuote
};
