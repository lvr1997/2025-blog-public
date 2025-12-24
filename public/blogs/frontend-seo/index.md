> 浏览网页时发现：有的meta标签中property属性值前缀带og:   比如 ：property="og:description"是什么意思？

`og:` 前缀是 Open Graph 协议的标识，用于社交媒体分享优化。

## Open Graph 协议是什么？

Open Graph 协议是由 Facebook 创建的元数据标准，用于让网页内容在社交媒体上以更丰富的方式显示。当你在 Facebook、LinkedIn、Twitter 等平台分享链接时，这些平台会读取页面的 Open Graph 标签来生成预览卡片。

## 常见的 Open Graph 标签

```html

<!-- 基本OG标签 -->
<meta property="og:title" content="页面标题">
<meta property="og:description" content="页面描述">
<meta property="og:image" content="https://example.com/image.jpg">
<meta property="og:url" content="https://example.com/page-url">
<meta property="og:type" content="website">

<!-- 更详细的OG标签 -->
<meta property="og:site_name" content="网站名称">
<meta property="og:locale" content="zh_CN">
<meta property="og:video" content="https://example.com/video.mp4">

```

## 为什么需要Open Graph标签？

- 社交媒体优化：确保链接在分享时有吸引人的预览
- 控制显示内容：精确控制标题、描述、图片的显示
- 提升点击率：丰富的预览卡片能吸引更多点击

## 在wordpress中使用Open Graph标签

1. 在`header.php`中添加完整的Open Graph标签

```php

 <!-- Open Graph Meta Tags -->
<meta property="og:title" content="<?php echo get_og_title(); ?>">
<meta property="og:description" content="<?php echo get_og_description(); ?>">
<meta property="og:image" content="<?php echo get_og_image(); ?>">
<meta property="og:url" content="<?php echo get_og_url(); ?>">
<meta property="og:type" content="<?php echo get_og_type(); ?>">
<meta property="og:site_name" content="<?php bloginfo('name'); ?>">
<meta property="og:locale" content="zh_CN">

```

2. 然后在functions.php中添加对应的函数：

```php

// ... existing code ...

/**
 * 获取Open Graph标题
 */
function get_og_title() {
    if (is_singular()) {
        return get_the_title();
    } elseif (is_category()) {
        return single_cat_title('', false);
    } elseif (is_tag()) {
        return single_tag_title('', false);
    } else {
        return get_bloginfo('name');
    }
}

/**
 * 获取Open Graph描述
 */
function get_og_description() {
    return get_meta_description(); // 可以复用之前的描述函数
}

/**
 * 获取Open Graph图片
 */
function get_og_image() {
    $image_url = '';
    
    // 单篇文章/产品页：使用特色图片
    if (is_singular() && has_post_thumbnail()) {
        $image_url = get_the_post_thumbnail_url(null, 'large');
    }
    
    // 如果没有特色图片，使用默认图片
    if (empty($image_url)) {
        $image_url = get_bloginfo('template_url') . '/images/og-default.jpg';
    }
    
    return $image_url;
}

/**
 * 获取Open Graph URL
 */
function get_og_url() {
    if (is_singular()) {
        return get_permalink();
    } else {
        return home_url($_SERVER['REQUEST_URI']);
    }
}

/**
 * 获取Open Graph类型
 */
function get_og_type() {
    if (is_singular()) {
        return 'article';
    } else {
        return 'website';
    }
}

// ... existing code ...

```

3. 测试Open Graph标签

使用以下工具测试你的Open Graph标签是否设置正确：
- [Facebook分享调试器](https://developers.facebook.com/tools/debug/)
- [Twitter卡片验证器](https://cards-dev.twitter.com/validator)
- [LinkedIn帖子检查器](https://www.linkedin.com/post-inspector/)


