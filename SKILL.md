---
name: circle-agent
description: 为开源项目匹配公开招募渠道或演示圈子。当开发者想找人试安装、体验交互或读文档，并有沟通方式偏好时使用。
---

# 找个内测圈

在本技能目录用 Node.js 18+ 运行 `tools.js`。把用户的项目简介放入 `background`，将反馈目标映射为「安装体验」「交互体验」「文档可读性」之一，沟通方式映射为「异步文字」「语音交流」或「都可以」。如果用户没说反馈目标且无法从描述推断，先询问；未指定沟通方式时用「都可以」。

```bash
node tools.js findCircles '{"background":"开源 Python CLI","topic":"安装体验","mode":"异步文字"}'
```

将整个 JSON 作为单个参数传入。结合项目和沟通偏好解释匹配。返回项的 kind 为 community 时，sourceUrl 是公开来源，submitUrl 是招募入口，checkedOn 是上次核查日期。kind 为 demo 的条目是虚构示例。空数组表示目录没有匹配。

如果用户选了虚构示例并想体验代询，用同一组参数加上选中的 `circleId`，调用 `simulate`。如实转述模拟回复及待用户决定的事项；实际名额和联络状态未知。
