// 使用import语句代替require
import axios from 'axios';

// 你的API的URL
const apiUrl = 'https://mermaid-to-excalidraw-9zs7w2coa-lyfs-projects-8ed59d54.vercel.app/api/hello-world';

// 执行GET请求测试API
axios.get(apiUrl)
  .then(response => {
    console.log('API Response:', response.data);
    if (response.status === 200 && response.data.message === 'Hello world!!') {
      console.log('测试成功：API返回正确的状态码和消息。');
    } else {
      console.error('测试失败：API没有返回预期的结果。');
    }
  })
  .catch(error => {
    console.error('测试失败：无法连接到API', error);
  });
