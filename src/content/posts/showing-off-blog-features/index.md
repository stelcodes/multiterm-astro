---
title: 'Showing Off Blog Features'
published: 2025-07-20
draft: false
tags: ['astro', 'demo', 'markdown']
toc: true
coverImage:
  src: './cover.jpg'
  alt: 'A person with short, thick hair and prescription glasses sits at an organized workstation, using a magnification app to navigate a webpage. Their posture is proper and relaxed. On the desk: a computer, a mouse, a large desk lamp and a small notebook.'
---

Since the post does not have a description in the frontmatter, the first paragraph is used.

## Theming

> Use your favorite editor theme for your blog!

Theming for the website comes from builtin Shiki themes found in Expressive Code. You can view them [here](https://expressive-code.com/guides/themes/#available-themes). A website can have one or more themes, defined in `src/site.config.ts`. There are three theming modes to choose from:

1. `single`: Choose a single theme for the website. Simple.
2. `light-dark-auto`: Choose two themes for the website to use for light and dark mode. The header will include a button for toggling between light/dark/auto. For example, you could choose `github-dark` and `github-light` with a default of `"auto"` and the user's experience will match their operating system theme straight away.
3. `select`: Choose two or more themes for the website and include a button in the header to change between any of these themes. You could include as many Shiki themes from Expressive Code as you like. Allow users to find their favorite theme!

> When the user changes the theme, their preference is stored in `localStorage` to persist across page navigation.

## Code Blocks

Let's look at some code block styles:

```python
def hello_world():
    print("Hello, world!")

hello_world()
```

```python title="hello.py"
def hello_world():
    print("Hello, world!")

hello_world()
```

```shell
python hello.py
```

Also some inline code: `1 + 2 = 3`. Or maybe even `(= (+ 1 2) 3)`.

See the [Expressive Code Docs](https://expressive-code.com/key-features/syntax-highlighting/) for more information on available features like wrapping text, line highlighting, diffs, etc.

## Basic Markdown Elements

- List item 1
- List item 2

**Bold text**

_Italic text_

~~Strikethrough text~~

[Link](https://www.example.com)

> In life, as in art, some endings are bittersweet. Especially when it comes to love. Sometimes fate throws two lovers together only to rip them apart. Sometimes the hero finally makes the right choice but the timing is all wrong. And, as they say, timing is everything.
>
> \- Gossip Girl

| Name    | Age | City        |
| ------- | --- | ----------- |
| Alice   | 30  | New York    |
| Bob     | 25  | Los Angeles |
| Charlie | 35  | Chicago     |

---

## Images

Images can include a title string after the URL to render as a `<figure>` with a `<figcaption>`.

![Pixel art of a tree](./PixelatedGreenTreeSide.png 'Pixel art renders poorly without proper CSS')

```md title="Pixel art markdown" wrap
![Pixel art of a tree](./PixelatedGreenTreeSide.png 'Pixel art renders poorly without proper CSS')
```

I've also added a special tag for pixel art that adds the correct CSS to render properly. Just add `#pixelated` to the very end of the alt string.

![Pixel art of a tree #pixelated](./PixelatedGreenTreeSide.png 'But adding #pixelated to the end of the alt string fixes this')

```md title="Pixel art markdown with #pixelated" wrap
![Pixel art of a tree #pixelated](./PixelatedGreenTreeSide.png 'But adding #pixelated to the end of the alt string fixes this')
```

## Admonitions

```md title="Admonition example in markdown"
:::note
testing123
:::
```

:::note
testing123
:::

:::tip
testing123
:::

:::important
testing123
:::

:::caution
testing123
:::

:::warning
testing123
:::

## Character Chats

```md title="Custom character chat" wrap
:::duck
**Did you know?** You can easily create custom character chats for your blog with MultiTerm!
:::
```

:::duck
**Did you know?** You can easily create custom character chats for your blog with MultiTerm!
:::

### Adding Your Own

To add your own character, first add an image file to the top-level `/public` directory in your cloned MultiTerm repo. Astro cannot automatically optimize image assets from markdown plugins, so make sure to compress the image to a web-friendly size (<100kb).

I recommend Google's free [Squoosh](https://squoosh.app) web app for creating super small webp files. The characters here have been resized to 300 pixels wide and exported to webp with 75% quality using Squoosh.

After you've added your image, update the `characters` option in `site.config.ts` with your newly added image file and restart the development server.

### Character Conversations

When there are multiple character chats in a row, the order of the chat image and chat bubble reverses to give the chat more of a back-and-forth appearance.

```md title="Sequential character chats"
:::owl
This is a cool feature!
:::

:::unicorn
I agree!
:::
```

:::owl
This is a cool feature!
:::

:::unicorn
I agree!
:::

You can specify the alignment (`left` or `right`) to override the default `left, right, left, ...` ordering.

```md wrap title="Character chats with specific alignment"
:::unicorn{align="right"}
Over here, to the right!
:::
```

:::unicorn{align="right"}
Over here, to the right!
:::

## GitHub Cards

GitHub overview cards heavily inspired by [Astro Cactus](https://github.com/chrismwilliams/astro-theme-cactus).

```md title="GitHub repo card example in markdown"
::github{repo="stelcodes/multiterm-astro"}
```

::github{repo="stelcodes/multiterm-astro"}

```md wrap=true title="GitHub user card example in markdown"
::github{user="withastro"}
```

::github{user="withastro"}

## Emoji :star_struck:

Emojis can be added in markdown by including a literal emoji character or a GitHub shortcode. You can browse an unofficial database [here](https://emojibase.dev/emojis?shortcodePresets=github).

```md title="Example markdown with GitHub emoji shortcodes"
Good morning! :sleeping: :coffee: :pancakes:
```

Good morning! :sleeping: :coffee: :pancakes:

> All emojis \(both literal and shortcoded\) are made more accessible by wrapping them in a `span` tag like this:
>
> ```html
> <span role="img" aria-label="coffee">☕️</span>
> ```
>
> At the time of writing, [emoji v16](https://emojipedia.org/emoji-16.0) is not supported yet. These emojis can be included literally but they do not have shortcodes and will not be wrapped.

## LaTeX/KaTeX Math Support

You can also display inline math via [remark-math and rehype-katex](https://github.com/remarkjs/remark-math).

```txt title="Rendering inline math with KaTeX"
Make those equations pretty! $ \frac{a}{b} \cdot b = a $
```

Make those equations pretty! $ \frac{a}{b} \cdot b = a $

Check out the [KaTeX docs](https://katex.org/docs/supported) to learn about the syntax.

```md title="Rendering a block of KaTeX" wrap
$$
a + ar + ar^2 + ar^3 + \dots + ar^{n-1} = \displaystyle\sum_{k=0}^{n - 1}ar^k = a \bigg(\dfrac{1 - r^n}{1 -r}\bigg)
$$
```

$$
a + ar + ar^2 + ar^3 + \dots + ar^{n-1} = \displaystyle\sum_{k=0}^{n - 1}ar^k = a \bigg(\dfrac{1 - r^n}{1 -r}\bigg)
$$

## HTML Elements

<button>A Button</button>

### Fieldset with Inputs

<fieldset>
    <input type="text" placeholder="Type something"><br>
    <input type="number" placeholder="Insert number"><br>
    <input type="text" value="Input value"><br>
    <select>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
    </select><br>
    <textarea placeholder="Insert a comment..."></textarea><br>
    <label><input type="checkbox"> I understand<br></label>
    <button type="submi">Submit</button>
</fieldset>

### Form with Labels

<form>
<label>
    <input type="radio" name="fruit" value="apple">
    Apple
</label><br>

<label>
    <input type="radio" name="fruit" value="banana">
    Banana
</label><br>

<label>
    <input type="radio" name="fruit" value="orange">
    Orange
</label><br>

<label>
    <input type="radio" name="fruit" value="grape">
    Grape
</label><br>

<label>
    <input type="checkbox" name="terms" value="agree">
    I agree to the terms and conditions
</label><br>
