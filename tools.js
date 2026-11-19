// Browser and Node.js share the same rules and fictional directory.
const CircleTools = (() => {
  const circles = [
    { id: 'cli', name: '命令行工具互测组', tags: ['CLI', '命令行', 'Python', '终端'], topics: ['安装体验', '文档可读性'], mode: '异步文字', terms: '提供安装命令和一条最短使用路径', delay: '两天内', capacity: 2 },
    { id: 'visual', name: '设计工具体验桌', tags: ['设计', 'Figma', '界面', '原型'], topics: ['交互体验', '文档可读性'], mode: '异步文字', terms: '提供可点击的原型和一个体验任务', delay: '三天内', capacity: 1 },
    { id: 'browser', name: '浏览器插件试用会', tags: ['浏览器', '插件', '扩展', 'Chrome'], topics: ['安装体验', '交互体验'], mode: '语音交流', terms: '提供测试版本并预留十五分钟演示', delay: '演示当晚', capacity: 3 }
  ];

  function findCircles({ background, topic, mode }) {
    if (typeof background !== 'string' || !background.trim() || !topic || !mode) {
      throw new Error('请填写项目背景、反馈目标和沟通方式。');
    }
    const matches = [];
    for (const circle of circles) {
      if (!circle.topics.includes(topic) || (mode !== '都可以' && mode !== circle.mode)) continue;
      const tags = circle.tags.filter(tag => background.toLowerCase().includes(tag.toLowerCase()));
      if (tags.length) matches.push({ id: circle.id, name: circle.name, tags, topic, mode: circle.mode });
    }
    return matches.sort((a, b) => b.tags.length - a.tags.length);
  }

  function simulate({ circleId, background, topic, mode, reply = 'available' }) {
    const selected = findCircles({ background, topic, mode }).find(item => item.id === circleId);
    if (!selected) throw new Error('所选圈子不匹配当前委托。');
    if (!['available','full','silent'].includes(reply)) throw new Error('未知回复情境。');
    const circle = circles.find(item => item.id === circleId);
    const messages = [];
    const send = text => messages.push({ from: '我的分身', text });
    const receive = text => messages.push({ from: circle.name, text });
    send('你好，我是项目方的分身。项目涉及' + selected.tags.join('、') + '，希望收集「' + topic + '」反馈。请问这期还有试用名额吗？');
    if (reply === 'silent') return { status: '等待圈主回复', next: '尚无回信，名额和反馈时间待定。', messages };
    if (reply === 'full') {
      receive('这期名额已满，下轮时间还没定。');
      return { status: '本期已满', next: '可以选择另一个匹配的圈子。', messages };
    }
    receive('本期还有 ' + circle.capacity + ' 个试用名额。');
    send('参与需要准备什么？反馈用什么方式，预计什么时候能拿到？');
    receive('请' + circle.terms + '。采用' + circle.mode + '，收到材料后' + circle.delay + '反馈。方便参加吗？');
    return { status: '等你决定', next: circle.terms + '。确认后以' + circle.mode + '参与，预计' + circle.delay + '收到反馈。', messages };
  }
  return { findCircles, simulate };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CircleTools;
  if (require.main === module) {
    try {
      const [operation, json] = process.argv.slice(2);
      if (!Object.hasOwn(CircleTools, operation)) throw new Error('操作可选 findCircles 或 simulate。');
      console.log(JSON.stringify(CircleTools[operation](JSON.parse(json)), null, 2));
    } catch (error) {
      console.error(error.message);
      process.exitCode = 1;
    }
  }
}
