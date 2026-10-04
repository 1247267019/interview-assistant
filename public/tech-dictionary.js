// 编程技术术语词典 - 用于纠正语音识别错误
const TechDictionary = {
  // 常见误识别映射
  corrections: {
    // JavaScript
    'java script': 'JavaScript',
    'javascript': 'JavaScript',
    'js': 'JavaScript',
    'type script': 'TypeScript',
    'typescript': 'TypeScript',
    'node js': 'Node.js',
    'nodejs': 'Node.js',
    
    // React
    'react': 'React',
    'reactor': 'React',
    'hooks': 'Hooks',
    'hook': 'Hook',
    'use effect': 'useEffect',
    'use state': 'useState',
    'use callback': 'useCallback',
    'use memo': 'useMemo',
    'use ref': 'useRef',
    'use context': 'useContext',
    'jsx': 'JSX',
    'virtual dom': '虚拟DOM',
    
    // Vue
    'vue': 'Vue',
    'view': 'Vue',
    'vuex': 'Vuex',
    'pinia': 'Pinia',
    'computed': 'computed',
    'watch': 'watch',
    
    // CSS
    'css': 'CSS',
    'flex': 'Flex',
    'grid': 'Grid',
    'dom': 'DOM',
    'bom': 'BOM',
    
    // HTTP & 网络
    'http': 'HTTP',
    'https': 'HTTPS',
    'api': 'API',
    'rest': 'REST',
    'json': 'JSON',
    'ajax': 'AJAX',
    'cors': 'CORS',
    'tcp': 'TCP',
    'ip': 'IP',
    'dns': 'DNS',
    'cdn': 'CDN',
    
    // 工程化
    'webpack': 'Webpack',
    'vite': 'Vite',
    'babel': 'Babel',
    'git': 'Git',
    'npm': 'npm',
    'yarn': 'Yarn',
    'pnpm': 'pnpm',
    
    // 后端
    'spring': 'Spring',
    'spring boot': 'Spring Boot',
    'springboot': 'Spring Boot',
    'spring cloud': 'Spring Cloud',
    'spring mvc': 'Spring MVC',
    'mybatis': 'MyBatis',
    'hibernate': 'Hibernate',
    'mysql': 'MySQL',
    'redis': 'Redis',
    'mongodb': 'MongoDB',
    'docker': 'Docker',
    'kubernetes': 'Kubernetes',
    'k8s': 'K8s',
    'linux': 'Linux',
    'nginx': 'Nginx',
    'tomcat': 'Tomcat',
    
    // 算法
    'api 排序': '快速排序',
    '快排': '快速排序',
    '二叉树': '二叉树',
    '哈希表': '哈希表',
    'hash table': '哈希表',
    'stack': '栈',
    'queue': '队列',
    'heap': '堆',
    
    // 其他技术
    'html': 'HTML',
    'html5': 'HTML5',
    'xml': 'XML',
    'svg': 'SVG',
    'canvas': 'Canvas',
    'webgl': 'WebGL',
    'pwa': 'PWA',
    'spa': 'SPA',
    'seo': 'SEO',
    'w3c': 'W3C',
    'ecma': 'ECMA',
    'es6': 'ES6',
    'es7': 'ES7',
    'es8': 'ES8',
    'es2015': 'ES2015',
    'es2020': 'ES2020',
    
    // 常见误识别纠正
    '闭包': '闭包',
    '必报': '闭包',
    'b包': '闭包',
    '异步': '异步',
    '一步': '异步',
    '同步': '同步',
    '童步': '同步',
    '原型': '原型',
    '圆形': '原型',
    '继承': '继承',
    'j承': '继承',
    '组件': '组件',
    '祖健': '组件',
    '路由': '路由',
    '路游': '路由',
    '状态': '状态',
    '装态': '状态',
    '属性': '属性',
    '书性': '属性',
    '事件': '事件',
    '试件': '事件',
    '回调': '回调',
    '会调': '回调',
    '依赖': '依赖',
    '一赖': '依赖',
    '注入': '注入',
    '住入': '注入',
    '配置': '配置',
    '配直': '配置',
    '注解': '注解',
    '住姐': '注解',
    '反射': '反射',
    '反设': '反射',
    '代理': '代理',
    '带理': '代理',
    '缓存': '缓存',
    '换存': '缓存',
    '线程': '线程',
    '现成': '线程',
    '进程': '进程',
    '近程': '进程',
    '锁': '锁',
    '死锁': '死锁',
    '并发': '并发',
    '病发': '并发',
    '并行': '并行',
    '病型': '并行',
    '事务': '事务',
    '是物': '事务',
    '索引': '索引',
    '锁影': '索引',
    '优化': '优化',
    '忧化': '优化',
    '查询': '查询',
    '查选': '查询',
    '连接': '连接',
    '联机': '连接',
    '框架': '框架',
    '框假': '框架',
    '设计模式': '设计模式',
    '是计模式': '设计模式',
    '单例': '单例',
    '单立': '单例',
    '工厂': '工厂',
    '工长': '工厂',
    '观察者': '观察者',
    '观察着': '观察者',
    '策略': '策略',
    '侧略': '策略',
    '装饰器': '装饰器',
    '装是器': '装饰器',
    '适配器': '适配器',
    '是配器': '适配器',
    
    // Spring 相关
    'bean': 'Bean',
    'bean工厂': 'BeanFactory',
    '应用上下文': 'ApplicationContext',
    '依赖注入': '依赖注入',
    '控制反转': '控制反转',
    'aop': 'AOP',
    'ioc': 'IoC',
    'di': 'DI',
    'mvc': 'MVC',
    'orm': 'ORM',
    'jpa': 'JPA',
    'jdbc': 'JDBC',
    'servlet': 'Servlet',
    'filter': 'Filter',
    'interceptor': 'Interceptor',
    'listener': 'Listener',
    
    // 数据库
    'sql': 'SQL',
    'nosql': 'NoSQL',
    '事务隔离': '事务隔离级别',
    'acid': 'ACID',
    'cap': 'CAP',
    'base': 'BASE',
    '分库分表': '分库分表',
    '读写分离': '读写分离',
    '主从复制': '主从复制',
    '聚簇索引': '聚簇索引',
    '非聚簇索引': '非聚簇索引',
    'b树': 'B树',
    'b+树': 'B+树',
    
    // 微服务
    '微服务': '微服务',
    '服务注册': '服务注册',
    '服务发现': '服务发现',
    '负载均衡': '负载均衡',
    '熔断': '熔断',
    '降级': '降级',
    '限流': '限流',
    '网关': '网关',
    '配置中心': '配置中心',
    '链路追踪': '链路追踪',
    
    // 消息队列
    'mq': 'MQ',
    'kafka': 'Kafka',
    'rabbitmq': 'RabbitMQ',
    'rocketmq': 'RocketMQ',
    'activemq': 'ActiveMQ',
    '消息队列': '消息队列',
    '生产者': '生产者',
    '消费者': '消费者',
    'topic': 'Topic',
    'partition': 'Partition',
    'offset': 'Offset',
    
    // 安全
    'jwt': 'JWT',
    'oauth': 'OAuth',
    'sso': 'SSO',
    'https': 'HTTPS',
    'ssl': 'SSL',
    'tls': 'TLS',
    '加密': '加密',
    '解密': '解密',
    '签名': '签名',
    '验签': '验签',
    '防重放': '防重放',
    'csrf': 'CSRF',
    'xss': 'XSS',
    'sql注入': 'SQL注入',
    
    // 性能
    'qps': 'QPS',
    'tps': 'TPS',
    'rt': 'RT',
    '并发量': '并发量',
    '吞吐量': '吞吐量',
    '响应时间': '响应时间',
    '性能优化': '性能优化',
    '内存泄漏': '内存泄漏',
    '内存溢出': '内存溢出',
    'oom': 'OOM',
    'gc': 'GC',
    '垃圾回收': '垃圾回收',
    'jvm': 'JVM',
    '类加载': '类加载',
    '双亲委派': '双亲委派模型'
  },

  // 纠正文本
  correct(text) {
    if (!text) return text;
    
    let corrected = text;
    
    // 1. 先进行整词匹配替换（避免部分替换导致错误）
    const sortedKeys = Object.keys(this.corrections).sort((a, b) => b.length - a.length);
    
    for (const key of sortedKeys) {
      const regex = new RegExp(this.escapeRegExp(key), 'gi');
      corrected = corrected.replace(regex, this.corrections[key]);
    }
    
    // 2. 处理连续的空格
    corrected = corrected.replace(/\s+/g, ' ').trim();
    
    return corrected;
  },

  // 转义正则特殊字符
  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  },

  // 添加自定义词汇
  addCustomVocab(vocab) {
    Object.assign(this.corrections, vocab);
  }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TechDictionary;
}
