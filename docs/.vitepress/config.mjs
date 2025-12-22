import {defineConfig} from 'vitepress'
import {set_sidebar} from "../utils/auto-gen-sidebar.mjs";

export default defineConfig({
    base: "/snow_coder/",
    title: "Compass Tech",
    srcDir: "src",
    description: "A VitePress Site",
    head: [["link", {rel: "icon", href: "imgs/index/logo.svg"}]],
    themeConfig: {
        logo: "imgs/index/logo.svg",
        // 设置搜索框的样式
        search: {
            provider: "local",
            options: {
                translations: {
                    button: {
                        buttonText: "搜索文档",
                        buttonAriaLabel: "搜索文档",
                    },
                    modal: {
                        noResultsText: "无法找到相关结果",
                        resetButtonTitle: "清除查询条件",
                        footer: {
                            selectText: "选择",
                            navigateText: "切换",
                        },
                    },
                },
            },
        },

        // https://vitepress.dev/reference/default-theme-config
        nav: [
            {
                text: 'Java编程',
                items: [
                    {text: 'Java编发编程', link: '/dir1/java并发/1-1'},
                    {text: 'JVM调优技术', link: '/dir2/3'},
                    {text: 'Java21新特性', link: '/dir1'}
                ]
            },
            {
                text: 'Go编程',
                items: [
                    {text: 'Go编程1', link: '/markdown-examples'},
                    {text: 'Go编程2', link: '/markdown-examples'},
                    {text: 'Go编程3', link: '/markdown-examples'}
                ]
            },
            {
                text: 'Python编程',
                items: [
                    {text: 'Python编程1', link: '/markdown-examples'},
                    {text: 'Python编程2', link: '/markdown-examples'},
                    {text: 'Python编程3', link: '/markdown-examples'}
                ]
            },
            {
                text: '微服务',
                items: [
                    {text: 'Spring Boot', link: '/markdown-examples'},
                    {text: 'Spring Cloud Alibaba', link: '/markdown-examples'}
                ]
            },
            {
                text: '容器化',
                items: [
                    {text: 'Docker', link: '/markdown-examples'},
                    {text: 'K8s', link: '/markdown-examples'}
                ]
            },
            {
                text: '框架&源码',
                items: [
                    {text: 'Spring', link: '/markdown-examples'},
                    {text: 'MyBatis', link: '/markdown-examples'}
                ]
            },
            {
                text: '算法',
                items: [
                    {text: '数据结构', link: '/markdown-examples'},
                    {text: '算法主题', link: '/markdown-examples'}
                ]
            },
            {
                text: 'AI大模型',
                items: [
                    {text: '大模型基础', link: '/markdown-examples'},
                    {text: '每日主题', link: '/markdown-examples'}
                ]
            },
            {
                text: '项目实战',
                items: [
                    {text: '项目1', link: '/markdown-examples'},
                    {text: '项目2', link: '/markdown-examples'}
                ]
            },
            {
                text: '其他',
                items: [
                    {text: '其他1', link: '/markdown-examples'},
                    {text: '其他2', link: '/markdown-examples'}
                ]
            },
        ],

        outlineTitle: "目录导航",
        outline: [1, 6],
        sidebar: {
            "/dir1": set_sidebar("/dir1"),
            "/dir2": set_sidebar("/dir2"),
        },

        socialLinks: [
            {icon: 'github', link: 'https://github.com/liqiaozi'}
        ],

        lastUpdated: {
            text: '最近更新于',
            formatOptions: {
                dateStyle: 'full',
                timeStyle: 'medium'
            }
        },

        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2025-present SnowFlying'
        }
    }
})
