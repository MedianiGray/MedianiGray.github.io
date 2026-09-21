/**
 * 观照之境 - 全站配置加载器
 * 从Supabase site_config表读取配置，应用到页面
 * 后端100%控制前端所有元素
 */
(function() {
    const supabaseUrl = 'https://xyxrwstdhmauwrbrojnr.supabase.co';
    const supabaseKey = 'sb_publishable_Vu7vCurGlKENUEo2i8cl9w_jHo36hjG';
    
    // 默认配置
    const defaults = {
        basic: { site_name: '观照之境', site_description: '在思考中看见思考本身', site_logo: '', site_favicon: '/img/favicon.png' },
        theme: { primary: '#689F89', bg: '#0a0f0e', text: '#e8edf2', text_dim: '#7a8595', border: 'rgba(255,255,255,0.08)', font: '-apple-system, BlinkMacSystemFont, PingFang SC, sans-serif', radius: '12px' },
        home: { title: '观照之境', subtitle: '在思考中看见思考本身', cta_text: '进入门廊', cta_link: '/home/', bg_image: '' },
        features: { comments: true, search: true, register: true, community: true, tools: true, knowledge: true, space: true },
        social: { github: '', twitter: '', email: '', weibo: '' },
        seo: { title: '观照之境 - 在思考中看见思考本身', description: '一个关于思考、哲学与自我觉察的数字空间', keywords: '哲学,思考,自我觉察,观照' },
        advanced: { custom_css: '', custom_js: '', analytics_code: '' }
    };
    
    let config = null;
    let sb = null;
    
    // 初始化Supabase客户端
    function initSupabase() {
        if (typeof supabase !== 'undefined' && supabase.createClient) {
            sb = supabase.createClient(supabaseUrl, supabaseKey);
            return true;
        }
        return false;
    }
    
    // 合并默认配置
    function mergeDefaults(cfg) {
        const result = JSON.parse(JSON.stringify(defaults));
        if (!cfg) return result;
        for (const group in defaults) {
            if (cfg[group]) {
                for (const key in defaults[group]) {
                    if (cfg[group][key] !== undefined) {
                        result[group][key] = cfg[group][key];
                    }
                }
            }
        }
        return result;
    }
    
    // 应用主题到CSS变量
    function applyTheme(theme) {
        const root = document.documentElement;
        if (theme.primary) root.style.setProperty('--main', theme.primary);
        if (theme.bg) root.style.setProperty('--bg', theme.bg);
        if (theme.text) root.style.setProperty('--text', theme.text);
        if (theme.text_dim) root.style.setProperty('--text-dim', theme.text_dim);
        if (theme.border) root.style.setProperty('--border', theme.border);
        if (theme.font) root.style.setProperty('--font', theme.font);
        if (theme.radius) root.style.setProperty('--radius', theme.radius);
    }
    
    // 应用自定义CSS
    function applyCustomCSS(css) {
        if (!css) return;
        const style = document.createElement('style');
        style.textContent = css;
        style.setAttribute('data-site-config', 'custom-css');
        document.head.appendChild(style);
    }
    
    // 应用自定义JS
    function applyCustomJS(js) {
        if (!js) return;
        try {
            const script = document.createElement('script');
            script.textContent = js;
            script.setAttribute('data-site-config', 'custom-js');
            document.body.appendChild(script);
        } catch (e) {
            console.warn('自定义JS执行失败:', e);
        }
    }
    
    // 应用统计代码
    function applyAnalytics(code) {
        if (!code) return;
        const div = document.createElement('div');
        div.innerHTML = code;
        div.setAttribute('data-site-config', 'analytics');
        document.head.appendChild(div);
    }
    
    // 更新页面标题
    function updatePageTitle(seo, basic) {
        if (seo && seo.title) {
            document.title = seo.title;
        } else if (basic && basic.site_name) {
            document.title = basic.site_name;
        }
    }
    
    // 更新meta标签
    function updateMetaTags(seo) {
        if (!seo) return;
        if (seo.description) {
            let meta = document.querySelector('meta[name="description"]');
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('name', 'description');
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', seo.description);
        }
        if (seo.keywords) {
            let meta = document.querySelector('meta[name="keywords"]');
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('name', 'keywords');
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', seo.keywords);
        }
    }
    
    // 加载配置
    async function loadConfig() {
        // 先用默认配置
        config = JSON.parse(JSON.stringify(defaults));
        applyTheme(config.theme);
        
        if (!initSupabase()) {
            console.warn('Supabase客户端未加载，使用默认配置');
            return config;
        }
        
        try {
            const { data, error } = await sb.from('site_config').select('*').limit(1).single();
            if (error) throw error;
            if (data && data.config_json) {
                config = mergeDefaults(data.config_json);
                // 应用配置
                applyTheme(config.theme);
                applyCustomCSS(config.advanced.custom_css);
                applyCustomJS(config.advanced.custom_js);
                applyAnalytics(config.advanced.analytics_code);
                updatePageTitle(config.seo, config.basic);
                updateMetaTags(config.seo);
            }
        } catch (e) {
            console.warn('加载配置失败，使用默认配置:', e.message);
        }
        
        return config;
    }
    
    // 获取配置（同步，需要先调用loadConfig）
    function getConfig() {
        return config || defaults;
    }
    
    // 获取某个分组的配置
    function getGroup(group) {
        return (config && config[group]) || defaults[group];
    }
    
    // 获取某个配置值
    function get(group, key, defaultValue) {
        if (config && config[group] && config[group][key] !== undefined) {
            return config[group][key];
        }
        return defaultValue !== undefined ? defaultValue : (defaults[group] && defaults[group][key]);
    }
    
    // 暴露到全局
    window.SiteConfig = {
        load: loadConfig,
        get: get,
        getGroup: getGroup,
        getConfig: getConfig,
        defaults: defaults
    };
    
    // 自动加载（如果页面引入了这个JS）
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadConfig);
    } else {
        loadConfig();
    }
})();
