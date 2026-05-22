import {defineConfig} from 'vitepress'
import {set_sidebar} from "../utils/auto-gen-sidebar.mjs";

export default defineConfig({
    lang: 'zh-CN',
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
                text: 'AI大模型',
                items: [
                    {text: 'Claude Code', link: '/ai/claudecode/第1部分 基础入门/Claude Code概述.md'},
                ]
            }
        ],

        outlineTitle: "目录导航",
        outline: [1, 6],
        sidebar: {
            "/ai": set_sidebar("/ai"),
        },

        socialLinks: [
            {icon: 'github', link: 'https://github.com'}
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
            copyright: 'Copyright © 2026-present SnowFlying'
        }
    }
})
