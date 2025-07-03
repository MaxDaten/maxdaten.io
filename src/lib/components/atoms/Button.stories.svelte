<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import Button from './Button.svelte';

    const { Story } = defineMeta({
        title: 'Atoms/Button',
        component: Button,
        tags: ['autodocs'],
        argTypes: {
            color: {
                control: { type: 'select' },
                options: ['primary', 'secondary'],
            },
            style: {
                control: { type: 'select' },
                options: ['solid', 'understated', 'clear'],
            },
            size: {
                control: { type: 'select' },
                options: ['small', 'medium', 'large'],
            },
            href: {
                control: 'text',
            },
        },
        args: {
            onclick: () => alert('clicked'),
        },
    });
</script>

<!-- Primary Button Variants -->
<Story name="Primary Solid" args={{ color: 'primary', style: 'solid' }}>
    Primary Button
</Story>

<Story
    name="Primary Understated"
    args={{ color: 'primary', style: 'understated' }}
>
    Primary Button
</Story>

<Story name="Primary Clear" args={{ color: 'primary', style: 'clear' }}>
    Primary Button
</Story>

<!-- Secondary Button Variants -->
<Story name="Secondary Solid" args={{ color: 'secondary', style: 'solid' }}>
    Secondary Button
</Story>

<Story
    name="Secondary Understated"
    args={{ color: 'secondary', style: 'understated' }}
>
    Secondary Button
</Story>

<Story name="Secondary Clear" args={{ color: 'secondary', style: 'clear' }}>
    Secondary Button
</Story>

<!-- Size Variants -->
<Story name="Small" args={{ size: 'small' }}>Small Button</Story>

<Story name="Medium" args={{ size: 'medium' }}>Medium Button</Story>

<Story name="Large" args={{ size: 'large' }}>Large Button</Story>

<!-- Link Variants -->
<Story name="Internal Link" args={{ href: '/blog' }}>Internal Link</Story>

<Story name="External Link" args={{ href: 'https://example.com' }}>
    External Link
</Story>

<!-- With Icon -->
<Story name="With Icon" args={{ icon: () => 'XXX' }}>
    {#snippet template(args)}
        <Button {...args}>
            {#snippet icon()}
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path
                        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                    />
                </svg>
            {/snippet}
            Button With Icon
        </Button>
    {/snippet}
</Story>
