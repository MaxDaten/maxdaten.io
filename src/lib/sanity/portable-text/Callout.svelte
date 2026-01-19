<script lang="ts">
    import type { CustomBlockComponentProps } from '@portabletext/svelte';
    import type { PortableTextBlock } from '@portabletext/types';
    import { PortableText } from '@portabletext/svelte';
    import CalloutUI from '$components/molecules/Callout.svelte';

    interface CalloutValue {
        type: 'info' | 'warning' | 'tip';
        content: PortableTextBlock[];
    }

    interface Props {
        portableText: CustomBlockComponentProps<CalloutValue>;
    }

    let { portableText }: Props = $props();
    let value = $derived(portableText.value);

    // Map Sanity callout types to existing Callout component types
    // 'tip' maps to 'success' for visual consistency
    function mapCalloutType(
        type: 'info' | 'warning' | 'tip'
    ): 'info' | 'warning' | 'success' {
        if (type === 'tip') return 'success';
        return type;
    }
</script>

<CalloutUI type={mapCalloutType(value.type)}>
    <PortableText value={value.content} />
</CalloutUI>
