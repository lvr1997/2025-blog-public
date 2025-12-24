> 浏览网站时发现的：为什么打开`google.com`，搜索特定词，有的网站排名第一
> 翻开开发者工具发现，有这么一段代码，于是 问AI:

![](/blogs/frontend-seo-gtm/e667c0a046973e82.png)
![](/blogs/frontend-seo-gtm/b7f12ddaea858a75.png)

Google帮助文档：[在网页端使用GTM](https://support.google.com/tagmanager/answer/14842164?hl=zh-Hans)

## 在wordpress中使用GTM

1. 在[Google Tag Manager](https://tagmanager.google.com/)中创建GTM容器并配置容器信息，创建成功后，你会看到类似这样的代码：

```html

<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXX');</script>
<!-- End Google Tag Manager -->

```

2. 在WordPress中使用新的容器ID

在header.php中添加GTM代码，这样便于管理：

```html

<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','<?php echo get_theme_mod('gtm_id', 'GTM-YOUR-ID'); ?>');</script>
<!-- End Google Tag Manager -->

```

然后在functions.php中添加主题选项：

```php

// 添加GTM ID设置选项
function theme_gtm_customizer($wp_customize) {
    $wp_customize->add_section('analytics_section', array(
        'title' => '分析工具',
        'priority' => 100,
    ));
    
    $wp_customize->add_setting('gtm_id', array(
        'default' => '',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    
    $wp_customize->add_control('gtm_id', array(
        'label' => 'Google Tag Manager ID',
        'section' => 'analytics_section',
        'type' => 'text',
        'description' => '输入你的GTM容器ID，格式如: GTM-XXXXXX',
    ));
}
add_action('customize_register', 'theme_gtm_customizer');

```

3. 配置Google Analytics 4 (GA4)标签
