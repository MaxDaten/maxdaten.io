/**
 * Date formatting utilities for blog posts.
 * Uses native Intl APIs for relative and absolute date formatting.
 */

/**
 * Format a date string for display in blog posts.
 * - Within 7 days: Returns relative time ("Today", "Yesterday", "3 days ago")
 * - Older than 7 days: Returns uppercase formatted date ("JAN 20, 2026")
 *
 * @param dateStr - ISO date string or date-parseable string
 * @returns Formatted date string
 */
export function formatPostDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();

    // Reset time components for day comparison
    const dateDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    );
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const diffTime = today.getTime() - dateDay.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Use relative time for posts within the last week
    if (diffDays >= 0 && diffDays < 7) {
        const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

        if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else {
            // Format as "3 days ago"
            return rtf.format(-diffDays, 'day');
        }
    }

    // For older posts, use uppercase absolute date
    return date
        .toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            timeZone: 'UTC',
        })
        .toUpperCase();
}

/**
 * Format a date string as ISO date for datetime attributes.
 *
 * @param dateStr - ISO date string or date-parseable string
 * @returns ISO date string (YYYY-MM-DD)
 */
export function formatDateISO(dateStr: string): string {
    return new Date(dateStr).toISOString().split('T')[0];
}
